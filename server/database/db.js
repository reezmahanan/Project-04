const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool (Pillar 2: The Bridge)
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3307', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'styleo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auto-initialize tables if they do not exist
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('[DATABASE] Connected to MySQL successfully on port ' + (process.env.DB_PORT || '3307'));

    // 1. Customers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        district VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 2. Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        regular_price DECIMAL(10, 2),
        rating DECIMAL(2, 1) DEFAULT 5.0,
        reviews_count INT DEFAULT 0,
        badge VARCHAR(50),
        img TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        stock_count INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 3. Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tracking_id VARCHAR(50) NOT NULL UNIQUE,
        customer_id INT NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'cod',
        status VARCHAR(50) DEFAULT 'Confirmed',
        courier VARCHAR(100) DEFAULT 'Domex Express',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 4. Order Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    connection.release();
    console.log('[DATABASE] Tables verified and ready (customers, products, orders, order_items).');
  } catch (err) {
    console.error('[DATABASE ERROR] Failed to initialize database tables:', err.message);
  }
}

module.exports = {
  pool,
  initDatabase
};
