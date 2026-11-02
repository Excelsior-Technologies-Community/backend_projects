const express = require('express');
const router = express.Router();
const spService = require('../services/spService');
const emailService = require('../services/emailService');
const authRoutes = require('./auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Mount Auth routes
router.use('/auth', authRoutes);

// Configure local upload directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Single file upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// ==========================================
// 1. DASHBOARD STATISTICS (Stored Procedure)
// ==========================================
router.get('/dashboard/stats', async (req, res) => {
  try {
    const statsData = await spService.getDashboardStats();
    res.json(statsData);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. PROPERTIES (Stored Procedures)
// ==========================================
router.get('/properties', async (req, res) => {
  try {
    const { categoryId, locationId, purpose, minPrice, maxPrice, search, sort, limit, offset } = req.query;
    const result = await spService.getProperties({
      categoryId,
      locationId,
      purpose,
      minPrice,
      maxPrice,
      search,
      sort,
      limit,
      offset
    });
    res.json(result);
  } catch (err) {
    console.error('Get properties error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/properties/:id', async (req, res) => {
  try {
    const property = await spService.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    console.error('Get property by id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/properties', async (req, res) => {
  try {
    const newProp = await spService.createProperty(req.body);
    res.status(201).json(newProp);
  } catch (err) {
    console.error('Create property error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.put('/properties/:id', async (req, res) => {
  try {
    const updated = await spService.updateProperty(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Update property error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/properties/:id', async (req, res) => {
  try {
    await spService.deleteProperty(req.params.id);
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/properties/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await spService.query('UPDATE Properties SET status = ?, updatedAt = NOW() WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. INQUIRIES & LEAD EMAIL SERVICE
// ==========================================
router.post('/inquiries', async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // 1. Create inquiry in MySQL using Stored Procedure
    const inquiry = await spService.createInquiry({ propertyId, name, email, phone, message });

    // 2. Fetch target property details if applicable
    let property = {};
    if (propertyId) {
      property = (await spService.getPropertyById(propertyId)) || {};
    }

    // 3. Automated Dual Email Dispatch
    // A) Send Confirmation to Client
    emailService.sendInquiryConfirmationToUser(inquiry, property).catch(err => {
      console.error('[EmailService] Client confirmation dispatch error:', err.message);
    });

    // B) Send Hot Lead Notification to Admin
    emailService.sendInquiryAlertToAdmin(inquiry, property).catch(err => {
      console.error('[EmailService] Admin alert dispatch error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! A confirmation email has been sent to your inbox.',
      inquiry
    });
  } catch (err) {
    console.error('Create inquiry error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await spService.query(`
      SELECT i.*, p.title AS property_title, p.price AS property_price 
      FROM Inquiries i 
      LEFT JOIN Properties p ON i.PropertyId = p.id 
      ORDER BY i.createdAt DESC
    `);
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/inquiries/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await spService.query('UPDATE Inquiries SET status = ?, updatedAt = NOW() WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/inquiries/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM Inquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. CATEGORIES
// ==========================================
router.get('/categories', async (req, res) => {
  try {
    const categories = await spService.query(`
      SELECT c.*, COUNT(p.id) AS property_count 
      FROM Categories c 
      LEFT JOIN Properties p ON c.id = p.CategoryId 
      GROUP BY c.id 
      ORDER BY c.name ASC
    `);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const result = await spService.query(
      'INSERT INTO Categories (name, slug, description, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, finalSlug, description || '', image || '']
    );
    res.status(201).json({ id: result.insertId, name, slug: finalSlug, description, image });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    await spService.query(
      'UPDATE Categories SET name = ?, slug = ?, description = ?, image = ?, updatedAt = NOW() WHERE id = ?',
      [name, slug, description, image, req.params.id]
    );
    res.json({ id: req.params.id, name, slug, description, image });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM Categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. LOCATIONS
// ==========================================
router.get('/locations', async (req, res) => {
  try {
    const locations = await spService.query(`
      SELECT l.*, COUNT(p.id) AS property_count 
      FROM Locations l 
      LEFT JOIN Properties p ON l.id = p.LocationId 
      GROUP BY l.id 
      ORDER BY l.name ASC
    `);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/locations', async (req, res) => {
  try {
    const { name, city, state, country = 'USA', image } = req.body;
    const result = await spService.query(
      'INSERT INTO Locations (name, city, state, country, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, city, state, country, image || '']
    );
    res.status(201).json({ id: result.insertId, name, city, state, country, image });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/locations/:id', async (req, res) => {
  try {
    const { name, city, state, country = 'USA', image } = req.body;
    await spService.query(
      'UPDATE Locations SET name = ?, city = ?, state = ?, country = ?, image = ?, updatedAt = NOW() WHERE id = ?',
      [name, city, state, country, image, req.params.id]
    );
    res.json({ id: req.params.id, name, city, state, country, image });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/locations/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM Locations WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. AMENITIES
// ==========================================
router.get('/amenities', async (req, res) => {
  try {
    const amenities = await spService.query('SELECT * FROM Amenities ORDER BY name ASC');
    res.json(amenities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/amenities', async (req, res) => {
  try {
    const { name, icon = 'check' } = req.body;
    const result = await spService.query(
      'INSERT INTO Amenities (name, icon, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [name, icon]
    );
    res.status(201).json({ id: result.insertId, name, icon });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/amenities/:id', async (req, res) => {
  try {
    const { name, icon } = req.body;
    await spService.query(
      'UPDATE Amenities SET name = ?, icon = ?, updatedAt = NOW() WHERE id = ?',
      [name, icon, req.params.id]
    );
    res.json({ id: req.params.id, name, icon });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/amenities/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM Amenities WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. TESTIMONIALS
// ==========================================
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await spService.query('SELECT * FROM Testimonials ORDER BY createdAt DESC');
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { name, role, company, text, rating = 5, avatar } = req.body;
    const result = await spService.query(
      'INSERT INTO Testimonials (name, role, company, text, rating, avatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, role, company, text, rating, avatar || '']
    );
    res.status(201).json({ id: result.insertId, name, role, company, text, rating, avatar });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const { name, role, company, text, rating, avatar } = req.body;
    await spService.query(
      'UPDATE Testimonials SET name = ?, role = ?, company = ?, text = ?, rating = ?, avatar = ?, updatedAt = NOW() WHERE id = ?',
      [name, role, company, text, rating, avatar, req.params.id]
    );
    res.json({ id: req.params.id, name, role, company, text, rating, avatar });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM Testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. BANNERS & SLIDERS
// ==========================================
router.get('/sliders', async (req, res) => {
  try {
    const sliders = await spService.query('SELECT * FROM Sliders ORDER BY sortOrder ASC, id DESC');
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sliders', async (req, res) => {
  try {
    const { title, subtitle, image, link = '/properties', sortOrder = 0, status = 'Active' } = req.body;
    const result = await spService.query(
      'INSERT INTO Sliders (title, subtitle, image, link, sortOrder, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [title, subtitle, image, link, sortOrder, status]
    );
    res.status(201).json({ id: result.insertId, title, subtitle, image, link, sortOrder, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/sliders/:id', async (req, res) => {
  try {
    const { title, subtitle, image, link, sortOrder, status } = req.body;
    await spService.query(
      'UPDATE Sliders SET title = ?, subtitle = ?, image = ?, link = ?, sortOrder = ?, status = ?, updatedAt = NOW() WHERE id = ?',
      [title, subtitle, image, link, sortOrder, status, req.params.id]
    );
    res.json({ id: req.params.id, title, subtitle, image, link, sortOrder, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/sliders/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM Sliders WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. CMS PAGES
// ==========================================
router.get('/cms', async (req, res) => {
  try {
    const pages = await spService.query('SELECT * FROM CMS ORDER BY page ASC');
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cms/:page', async (req, res) => {
  try {
    const pages = await spService.query('SELECT * FROM CMS WHERE page = ?', [req.params.page]);
    if (pages.length === 0) return res.status(404).json({ error: 'Page not found' });
    res.json(pages[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/cms/:page', async (req, res) => {
  try {
    const { title, content, metaTitle, metaDescription } = req.body;
    await spService.query(
      `INSERT INTO CMS (page, title, content, metaTitle, metaDescription, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), metaTitle=VALUES(metaTitle), metaDescription=VALUES(metaDescription), updatedAt=NOW()`,
      [req.params.page, title, content, metaTitle, metaDescription]
    );
    const updated = await spService.query('SELECT * FROM CMS WHERE page = ?', [req.params.page]);
    res.json(updated[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 10. WEBSITE SETTINGS
// ==========================================
router.get('/settings', async (req, res) => {
  try {
    const rows = await spService.query('SELECT `key`, value FROM Settings');
    const settingsMap = {};
    rows.forEach(r => { settingsMap[r.key] = r.value; });
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, val] of Object.entries(settings)) {
      await spService.saveSetting(key, val);
    }
    const rows = await spService.query('SELECT `key`, value FROM Settings');
    const settingsMap = {};
    rows.forEach(r => { settingsMap[r.key] = r.value; });
    res.json({ success: true, settings: settingsMap });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Live Test Email Endpoint for Admin Settings
router.post('/settings/test-email', async (req, res) => {
  try {
    const targetEmail = req.body.email || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const result = await emailService.sendTestEmail(targetEmail);
    res.json({
      success: true,
      message: `Test email sent to ${targetEmail}`,
      details: result
    });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 11. USER MANAGEMENT (Admin & Customers)
// ==========================================
router.get('/users', async (req, res) => {
  try {
    const admins = await spService.query('SELECT id, name, email, role, createdAt FROM AdminUsers ORDER BY createdAt DESC');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const bcrypt = require('bcryptjs');

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const existing = await spService.query('SELECT id FROM AdminUsers WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) return res.status(400).json({ error: 'Admin email already exists' });

    const hashedPassword = await bcrypt.hash(password || 'admin123', 10);
    const result = await spService.query(
      'INSERT INTO AdminUsers (name, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, cleanEmail, hashedPassword, role]
    );
    res.status(201).json({ id: result.insertId, name, email: cleanEmail, role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM AdminUsers WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const customers = await spService.query(
      'SELECT id, firstName, lastName, email, phone, role, createdAt FROM Users ORDER BY createdAt DESC'
    );
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/customers/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM Users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 12. FAVORITES / SAVED PROPERTIES
// ==========================================
router.post('/favorites/toggle', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    if (!userId || !propertyId) {
      return res.status(400).json({ error: 'userId and propertyId required' });
    }
    const result = await spService.toggleFavorite(userId, propertyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/favorites/:userId', async (req, res) => {
  try {
    const favorites = await spService.getUserFavorites(req.params.userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 13. GALLERY / MEDIA
// ==========================================
router.get('/gallery', async (req, res) => {
  try {
    const images = await spService.query(`
      SELECT pi.*, p.title AS property_title 
      FROM PropertyImages pi 
      JOIN Properties p ON pi.PropertyId = p.id 
      ORDER BY pi.id DESC
    `);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/gallery', async (req, res) => {
  try {
    const { propertyId, url, isPrimary = false } = req.body;
    const result = await spService.query(
      'INSERT INTO PropertyImages (PropertyId, url, isPrimary, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [propertyId, url, isPrimary ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, propertyId, url, isPrimary });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    await spService.query('DELETE FROM PropertyImages WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
