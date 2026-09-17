/**
 * STYLEO CEYLON — Unified Full-Stack Server
 * Project 4: Frontend & Backend Integration ("The Unified System")
 * DecodeLabs Industrial Training Kit
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const { initDatabase } = require('./database/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS Middleware (Network Security & Preflight)
app.use(cors());

// 2. Body Parser (JSON Deserialization)
app.use(express.json());

// 3. Serve Frontend Static Assets
app.use(express.static(path.join(__dirname, '../client')));

// 4. Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 5. Root API Health Check
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'STYLEO Ceylon Unified Full-Stack API',
    version: '1.0.0',
    phase: 'Project 4: Frontend & Backend Integration',
    status: 'Operational',
    database: {
      engine: 'MySQL / MariaDB',
      name: process.env.DB_NAME || 'styleo_db',
      status: 'Connected'
    },
    endpoints: {
      products: 'GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id',
      orders: 'GET /api/orders, GET /api/orders/:trackingId, POST /api/orders',
      customers: 'GET /api/customers'
    }
  });
});

// 6. Mount REST API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

// 7. Client Fallback Route (Serves index.html for frontend navigation)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// 8. Centralized Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 9. Boot Unified Full-Stack System
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🚀 STYLEO Ceylon Full-Stack System is Live!`);
    console.log(`🌐 Web Application:   http://localhost:${PORT}`);
    console.log(`📡 RESTful API:      http://localhost:${PORT}/api`);
    console.log(`🛍️ Products Endpoint: http://localhost:${PORT}/api/products`);
    console.log(`📦 Orders Endpoint:   http://localhost:${PORT}/api/orders`);
    console.log(`🗄️ MySQL Database:    ${process.env.DB_NAME || 'styleo_db'} (Port ${process.env.DB_PORT || '3306'})`);
    console.log('====================================================');
  });
}

start();

module.exports = app;
