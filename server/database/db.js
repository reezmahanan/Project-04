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

    // 5. Auto-seed initial catalog products if table is empty
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (existing[0].count === 0) {
      console.log('[DATABASE] Empty catalog detected. Auto-seeding initial 16 products...');
      const seedProducts = [
        { name: "Oversized Tailored Mocha Blazer", category: "blazers", price: 8900, regular_price: 11500, rating: 4.9, reviews_count: 48, badge: "Bestseller", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 12 },
        { name: "Artisanal Silk Linen Shirt", category: "linen", price: 4900, regular_price: 6500, rating: 4.8, reviews_count: 32, badge: "New", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 20 },
        { name: "Minimal White Leather Sneaker", category: "footwear", price: 8900, regular_price: 10800, rating: 4.7, reviews_count: 56, badge: "Trending", img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 15 },
        { name: "Sculptural Leather Shoulder Bag", category: "bags", price: 6900, regular_price: 8500, rating: 4.9, reviews_count: 41, badge: "Exclusive", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 8 },
        { name: "Dumbara Handloom Cotton Kimono", category: "blazers", price: 9800, regular_price: 12500, rating: 5.0, reviews_count: 27, badge: "Heritage", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 10 },
        { name: "Ratnapura Ceylon Sapphire Pendant", category: "jewelry", price: 18500, regular_price: 24000, rating: 4.9, reviews_count: 19, badge: "Certified", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 5 },
        { name: "Champagne Silk Evening Slip", category: "blazers", price: 12400, regular_price: 15500, rating: 4.8, reviews_count: 23, badge: "Limited", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 7 },
        { name: "Breathable Cuban Collar Linen", category: "linen", price: 5400, regular_price: 6900, rating: 4.7, reviews_count: 38, badge: "Essential", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 18 },
        { name: "Tailored Ivory Double-Breasted Suit", category: "blazers", price: 11200, regular_price: 14500, rating: 4.9, reviews_count: 17, badge: "Signature", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 9 },
        { name: "Indigo Hand-Dyed Batik Shirt", category: "linen", price: 6200, regular_price: 7800, rating: 4.8, reviews_count: 29, badge: "Artisan", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 14 },
        { name: "Handcrafted Saddle Leather Loafers", category: "footwear", price: 9600, regular_price: 12000, rating: 4.8, reviews_count: 34, badge: "Crafted", img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 11 },
        { name: "Colombo Mini Leather Crossbody", category: "bags", price: 5800, regular_price: 7200, rating: 4.9, reviews_count: 45, badge: "Popular", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 16 },
        { name: "Ratnapura Star Ruby Signet Ring", category: "jewelry", price: 15900, regular_price: 21000, rating: 5.0, reviews_count: 14, badge: "Collector", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 4 },
        { name: "Resort Raw Silk Band-Collar Shirt", category: "linen", price: 5100, regular_price: 6800, rating: 4.7, reviews_count: 22, badge: "Classic", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 12 },
        { name: "Woven Natural Rush Studio Tote", category: "bags", price: 7400, regular_price: 9200, rating: 4.8, reviews_count: 25, badge: "Eco-Luxe", img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 7 },
        { name: "Ceylon Moonstone & Silver Drop Earrings", category: "jewelry", price: 6800, regular_price: 8500, rating: 4.9, reviews_count: 31, badge: "Handmade", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80", in_stock: true, stock_count: 10 }
      ];
      for (const p of seedProducts) {
        await connection.execute(
          `INSERT INTO products (name, category, price, regular_price, rating, reviews_count, badge, img, in_stock, stock_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.category, p.price, p.regular_price, p.rating, p.reviews_count, p.badge, p.img, p.in_stock, p.stock_count]
        );
      }
      console.log('[DATABASE] Auto-seeded 16 catalog products successfully.');
    }

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
