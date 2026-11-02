const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Jashu@2005',
  database: process.env.DB_NAME || 'realestate_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

const spService = {
  // Pool access for raw query
  pool,

  async query(sql, params = []) {
    const [results] = await pool.query(sql, params);
    return results;
  },

  // 1. Dashboard Statistics
  async getDashboardStats() {
    const [results] = await pool.query('CALL sp_get_dashboard_stats()');
    const stats = results[0][0] || {};
    
    // Also fetch recent inquiries and recent properties for dashboard display
    const [recentInquiries] = await pool.query(`
      SELECT i.*, p.title AS property_title 
      FROM Inquiries i 
      LEFT JOIN Properties p ON i.PropertyId = p.id 
      ORDER BY i.createdAt DESC LIMIT 5
    `);

    const [recentProperties] = await pool.query(`
      SELECT p.*, c.name AS category_name, 
        (SELECT pi.url FROM PropertyImages pi WHERE pi.PropertyId = p.id ORDER BY pi.isPrimary DESC, pi.id ASC LIMIT 1) AS primary_image
      FROM Properties p 
      LEFT JOIN Categories c ON p.CategoryId = c.id 
      ORDER BY p.createdAt DESC LIMIT 5
    `);

    return {
      stats,
      recentInquiries,
      recentProperties
    };
  },

  // 2. Get Properties via Stored Procedure
  async getProperties({ categoryId = null, locationId = null, purpose = null, minPrice = null, maxPrice = null, search = '', sort = 'featured', limit = 20, offset = 0 } = {}) {
    const [results] = await pool.query(
      'CALL sp_get_properties(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        categoryId ? Number(categoryId) : null,
        locationId ? Number(locationId) : null,
        purpose || null,
        minPrice ? Number(minPrice) : null,
        maxPrice ? Number(maxPrice) : null,
        search || '',
        sort || 'featured',
        Number(limit) || 20,
        Number(offset) || 0
      ]
    );

    // Get total count for pagination
    let countSql = `SELECT COUNT(*) AS total FROM Properties p WHERE 1=1`;
    const countParams = [];
    if (categoryId) { countSql += ` AND p.CategoryId = ?`; countParams.push(categoryId); }
    if (locationId) { countSql += ` AND p.LocationId = ?`; countParams.push(locationId); }
    if (purpose) { countSql += ` AND p.purpose = ?`; countParams.push(purpose); }
    if (minPrice) { countSql += ` AND p.price >= ?`; countParams.push(minPrice); }
    if (maxPrice) { countSql += ` AND p.price <= ?`; countParams.push(maxPrice); }
    if (search) {
      countSql += ` AND (p.title LIKE ? OR p.address LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countRes] = await pool.query(countSql, countParams);
    const total = countRes[0]?.total || 0;

    return {
      properties: results[0] || [],
      total,
      limit: Number(limit),
      offset: Number(offset)
    };
  },

  // 3. Get Property by ID via Stored Procedure
  async getPropertyById(id) {
    const [results] = await pool.query('CALL sp_get_property_by_id(?)', [Number(id)]);
    const property = results[0]?.[0];
    if (!property) return null;

    const images = results[1] || [];
    const amenities = results[2] || [];

    return {
      ...property,
      images,
      amenities
    };
  },

  // 4. Create Property via Stored Procedure
  async createProperty(data) {
    const {
      title,
      slug = '',
      description = '',
      price = 0,
      type = 'Villa',
      purpose = 'For Sale',
      status = 'Active',
      bedrooms = 1,
      bathrooms = 1,
      areaSqFt = 1000,
      address = '',
      featured = false,
      categoryId = null,
      locationId = null,
      imageUrl = ''
    } = data;

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const [results] = await pool.query(
      'CALL sp_create_property(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @new_id)',
      [
        title,
        finalSlug,
        description,
        price,
        type,
        purpose,
        status,
        bedrooms,
        bathrooms,
        areaSqFt,
        address,
        featured ? 1 : 0,
        categoryId ? Number(categoryId) : null,
        locationId ? Number(locationId) : null,
        imageUrl || null
      ]
    );

    const newId = results[0]?.[0]?.id;
    return this.getPropertyById(newId);
  },

  // 5. Update Property via Stored Procedure
  async updateProperty(id, data) {
    const {
      title,
      description,
      price,
      type,
      purpose,
      status,
      bedrooms,
      bathrooms,
      areaSqFt,
      address,
      featured,
      categoryId,
      locationId
    } = data;

    await pool.query(
      'CALL sp_update_property(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        Number(id),
        title,
        description,
        price,
        type,
        purpose,
        status,
        bedrooms,
        bathrooms,
        areaSqFt,
        address,
        featured ? 1 : 0,
        categoryId ? Number(categoryId) : null,
        locationId ? Number(locationId) : null
      ]
    );

    return this.getPropertyById(id);
  },

  // 6. Delete Property via Stored Procedure
  async deleteProperty(id) {
    await pool.query('CALL sp_delete_property(?)', [Number(id)]);
    return { success: true, deletedId: id };
  },

  // 7. Create Inquiry via Stored Procedure
  async createInquiry({ propertyId, name, email, phone, message }) {
    const [results] = await pool.query(
      'CALL sp_create_inquiry(?, ?, ?, ?, ?)',
      [propertyId ? Number(propertyId) : null, name, email, phone || '', message || '']
    );
    return results[0]?.[0] || null;
  },

  // 8. Toggle Favorite
  async toggleFavorite(userId, propertyId) {
    const [results] = await pool.query(
      'CALL sp_toggle_favorite(?, ?)',
      [Number(userId), Number(propertyId)]
    );
    return results[0]?.[0] || {};
  },

  // 9. Get User Favorites
  async getUserFavorites(userId) {
    const [results] = await pool.query('CALL sp_get_user_favorites(?)', [Number(userId)]);
    return results[0] || [];
  },

  // 10. Upsert Setting
  async saveSetting(key, value) {
    const [results] = await pool.query('CALL sp_save_setting(?, ?)', [key, typeof value === 'object' ? JSON.stringify(value) : String(value)]);
    return results[0]?.[0] || null;
  }
};

module.exports = spService;
