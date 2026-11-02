const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { pool } = require('./services/spService');
const apiRoutes = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'Real Estate Management API',
    endpoints: {
      properties: '/api/properties',
      categories: '/api/categories',
      locations: '/api/locations',
      amenities: '/api/amenities',
      inquiries: '/api/inquiries',
      dashboard: '/api/dashboard/stats',
      cms: '/api/cms',
      settings: '/api/settings',
      auth: '/api/auth'
    }
  });
});

const PORT = process.env.PORT || 5000;

// Test MySQL Database Connection & Start Server
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Database connected successfully with Stored Procedures support.');
    conn.release();
    app.listen(PORT, () => {
      console.log(`🚀 Real Estate REST API server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to MySQL database:', err.message);
  });
