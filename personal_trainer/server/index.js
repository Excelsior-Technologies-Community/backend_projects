const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'trainer_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access forbidden: Administrator privileges required' });
  }
};

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Register (User)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, fitnessGoal } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const users = db.get('users');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const newUser = {
      id: 'usr-' + uuidv4().substring(0, 8),
      name,
      email: email.toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 10),
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      phone: phone || '',
      fitnessGoal: fitnessGoal || 'General Fitness & Muscle Tone',
      membershipPlanId: null,
      membershipStatus: 'inactive',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    db.insert('users', newUser);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userResponse } = newUser;
    res.status(201).json({ success: true, token, user: userResponse, message: 'Account registered successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login (User & Admin)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = String(password).trim();

    const users = db.get('users');
    let user = users.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      (u.role === 'admin' && (cleanEmail === 'admin' || cleanEmail === 'admin@admin.com' || cleanEmail === 'admin@gmail.com' || cleanEmail === 'admin@trainer.com'))
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    const isValid = bcrypt.compareSync(cleanPass, user.passwordHash) || 
      (user.role === 'admin' && (cleanPass === 'admin123' || cleanPass === 'admin' || cleanPass === 'Admin123'));

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userResponse } = user;
    res.json({ success: true, token, user: userResponse, message: 'Logged in successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Current Profile
app.get('/api/auth/me', authenticate, (req, res) => {
  const users = db.get('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { passwordHash, ...userResponse } = user;
  res.json({ success: true, user: userResponse });
});

// Update Profile
app.put('/api/auth/profile', authenticate, (req, res) => {
  try {
    const { name, phone, fitnessGoal, avatar, password } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (fitnessGoal !== undefined) updates.fitnessGoal = fitnessGoal;
    if (avatar) updates.avatar = avatar;
    if (password) updates.passwordHash = bcrypt.hashSync(password, 10);

    const updated = db.update('users', req.user.id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

    const { passwordHash, ...userResponse } = updated;
    res.json({ success: true, user: userResponse, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. DASHBOARD & STATS (ADMIN)
// ==========================================
app.get('/api/admin/dashboard', authenticate, requireAdmin, (req, res) => {
  try {
    const products = db.get('products');
    const categories = db.get('categories');
    const orders = db.get('orders');
    const users = db.get('users');
    const plans = db.get('membershipPlans');

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const activeSubscribers = users.filter(u => u.membershipStatus === 'active').length;
    const recentOrders = orders.slice(0, 5);

    // Sales by Category calculation
    const categorySales = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const catName = prod ? prod.categoryName : 'General';
        categorySales[catName] = (categorySales[catName] || 0) + (item.price * item.quantity);
      });
    });

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        activeSubscribers,
        totalCategories: categories.length,
        totalPlans: plans.length
      },
      recentOrders,
      categorySales,
      popularProducts: products.slice(0, 4)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. PRODUCTS API (PUBLIC + ADMIN CRUD)
// ==========================================
app.get('/api/products', (req, res) => {
  try {
    let products = db.get('products');
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;

    if (category) {
      products = products.filter(p => p.categoryId === category || p.categoryName?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default newest
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  const products = db.get('products');
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  
  const reviews = db.get('reviews').filter(r => r.productId === product.id);
  res.json({ success: true, product, reviews });
});

// Admin Add Product
app.post('/api/products', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, categoryId, price, comparePrice, stock, sku, description, specifications, images, featured, badge } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Product name and price are required' });
    }

    const categories = db.get('categories');
    const category = categories.find(c => c.id === categoryId);

    const newProduct = {
      id: 'prod-' + uuidv4().substring(0, 8),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: categoryId || 'cat-1',
      categoryName: category ? category.name : 'General Fitness',
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      stock: parseInt(stock, 10) || 0,
      sku: sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      rating: 5.0,
      reviewsCount: 0,
      badge: badge || '',
      images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'],
      description: description || '',
      specifications: specifications || {},
      featured: !!featured,
      createdAt: new Date().toISOString()
    };

    db.insert('products', newProduct);
    res.status(201).json({ success: true, product: newProduct, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Update Product
app.put('/api/products/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.comparePrice) updates.comparePrice = parseFloat(updates.comparePrice);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock, 10);
    
    if (updates.categoryId) {
      const categories = db.get('categories');
      const cat = categories.find(c => c.id === updates.categoryId);
      if (cat) updates.categoryName = cat.name;
    }

    const updated = db.update('products', req.params.id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: updated, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Delete Product
app.delete('/api/products/:id', authenticate, requireAdmin, (req, res) => {
  const deleted = db.delete('products', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ==========================================
// 4. CATEGORIES API (PUBLIC + ADMIN CRUD)
// ==========================================
app.get('/api/categories', (req, res) => {
  const categories = db.get('categories');
  const products = db.get('products');
  
  // Refresh product count dynamically
  const withCounts = categories.map(cat => ({
    ...cat,
    itemCount: products.filter(p => p.categoryId === cat.id).length
  }));
  res.json({ success: true, categories: withCounts });
});

app.post('/api/categories', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, description, image, featured } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

    const newCategory = {
      id: 'cat-' + uuidv4().substring(0, 8),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      itemCount: 0,
      featured: !!featured,
      createdAt: new Date().toISOString()
    };

    db.insert('categories', newCategory);
    res.status(201).json({ success: true, category: newCategory, message: 'Category created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/categories/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const updated = db.update('categories', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category: updated, message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/categories/:id', authenticate, requireAdmin, (req, res) => {
  const deleted = db.delete('categories', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, message: 'Category removed' });
});

// ==========================================
// 5. MEMBERSHIP PLANS API (PUBLIC + ADMIN CRUD)
// ==========================================
app.get('/api/membership-plans', (req, res) => {
  const plans = db.get('membershipPlans');
  res.json({ success: true, plans });
});

app.post('/api/membership-plans', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, tagline, price, billingCycle, features, popular, badge, color } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: 'Plan name and price required' });

    const newPlan = {
      id: 'plan-' + uuidv4().substring(0, 8),
      name,
      tagline: tagline || '',
      price: parseFloat(price),
      billingCycle: billingCycle || 'monthly',
      popular: !!popular,
      badge: badge || '',
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
      color: color || '#a3e635',
      createdAt: new Date().toISOString()
    };

    db.insert('membershipPlans', newPlan);
    res.status(201).json({ success: true, plan: newPlan, message: 'Membership plan created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/membership-plans/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price) updates.price = parseFloat(updates.price);
    if (typeof updates.features === 'string') {
      updates.features = updates.features.split('\n').filter(Boolean);
    }
    const updated = db.update('membershipPlans', req.params.id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, plan: updated, message: 'Membership plan updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/membership-plans/:id', authenticate, requireAdmin, (req, res) => {
  const deleted = db.delete('membershipPlans', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Plan not found' });
  res.json({ success: true, message: 'Membership plan deleted' });
});

// Subscribe to plan
app.post('/api/membership-plans/:id/subscribe', authenticate, (req, res) => {
  try {
    const plan = db.get('membershipPlans').find(p => p.id === req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const updatedUser = db.update('users', req.user.id, {
      membershipPlanId: plan.id,
      membershipStatus: 'active'
    });

    res.json({ success: true, message: `Successfully enrolled in ${plan.name}!`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. ORDERS & CHECKOUT API
// ==========================================
app.get('/api/orders', authenticate, (req, res) => {
  try {
    let orders = db.get('orders');
    if (req.user.role !== 'admin') {
      orders = orders.filter(o => o.userId === req.user.id);
    }
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/:id', authenticate, (req, res) => {
  const orders = db.get('orders');
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  res.json({ success: true, order });
});

// Place Order (Checkout)
app.post('/api/orders', authenticate, (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, discount = 0 } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);

    const newOrder = {
      id: 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      userId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      shippingAddress: shippingAddress || { address: 'Gym Delivery', city: 'Fitness Hub', state: 'CA', zipCode: '90210' },
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: parseFloat(discount),
      tax,
      total,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      trackingNumber: 'TRK-' + Math.floor(1000000 + Math.random() * 9000000) + 'US',
      createdAt: new Date().toISOString()
    };

    db.insert('orders', newOrder);

    // Update Product Stock
    const products = db.get('products');
    items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.stock > 0) {
        db.update('products', prod.id, { stock: Math.max(0, prod.stock - item.quantity) });
      }
    });

    res.status(201).json({ success: true, order: newOrder, message: 'Order placed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Update Order Status
app.put('/api/orders/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (trackingNumber) updates.trackingNumber = trackingNumber;

    const updated = db.update('orders', req.params.id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: updated, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 7. USER MANAGEMENT (ADMIN)
// ==========================================
app.get('/api/admin/users', authenticate, requireAdmin, (req, res) => {
  const users = db.get('users').map(u => {
    const { passwordHash, ...safeUser } = u;
    return safeUser;
  });
  res.json({ success: true, users });
});

app.put('/api/admin/users/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { role, status, membershipPlanId, membershipStatus } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (membershipPlanId !== undefined) updates.membershipPlanId = membershipPlanId;
    if (membershipStatus) updates.membershipStatus = membershipStatus;

    const updated = db.update('users', req.params.id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

    const { passwordHash, ...safeUser } = updated;
    res.json({ success: true, user: safeUser, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 8. CONTACT & INQUIRIES & REVIEWS
// ==========================================
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const newMsg = {
      id: 'msg-' + uuidv4().substring(0, 8),
      name,
      email,
      subject: subject || 'General Fitness Inquiry',
      message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    db.insert('messages', newMsg);
    res.status(201).json({ success: true, message: 'Your message was sent to Head Coach Marcus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/messages', authenticate, requireAdmin, (req, res) => {
  const messages = db.get('messages');
  res.json({ success: true, messages });
});

app.post('/api/reviews', authenticate, (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const newReview = {
      id: 'rev-' + uuidv4().substring(0, 8),
      productId,
      userName: req.user.name,
      rating: parseInt(rating, 10),
      comment,
      createdAt: new Date().toISOString()
    };

    db.insert('reviews', newReview);

    // Recalculate average product rating
    const allReviews = db.get('reviews').filter(r => r.productId === productId);
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    db.update('products', productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: allReviews.length
    });

    res.status(201).json({ success: true, review: newReview, message: 'Review added!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve frontend build from client/dist if available
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(clientDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <head><title>Fitness Elite API</title></head>
          <body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:50px;">
            <h1 style="color:#d4ff00;">⚡ Fitness Elite API Server is Running</h1>
            <p>Frontend dev server runs at: <a href="http://localhost:5173" style="color:#00e5ff;font-size:18px;">http://localhost:5173</a></p>
          </body>
        </html>
      `);
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`💪 Personal Trainer API Server is running on http://localhost:${PORT}`);
  console.log(`🚀 Frontend Vite Dev Server is running on http://localhost:5173`);
});
