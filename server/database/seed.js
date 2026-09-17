const { pool, initDatabase } = require('./db');

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

async function seed() {
  await initDatabase();
  const conn = await pool.getConnection();

  try {
    console.log('[SEED] Seeding products...');
    const [existing] = await conn.query('SELECT COUNT(*) as count FROM products');
    if (existing[0].count === 0) {
      for (const p of seedProducts) {
        await conn.execute(
          `INSERT INTO products (name, category, price, regular_price, rating, reviews_count, badge, img, in_stock, stock_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.category, p.price, p.regular_price, p.rating, p.reviews_count, p.badge, p.img, p.in_stock, p.stock_count]
        );
      }
      console.log(`[SEED] Successfully seeded ${seedProducts.length} products.`);
    } else {
      console.log(`[SEED] Products table already has ${existing[0].count} items.`);
    }

    // Seed sample customer
    const [custRows] = await conn.execute('SELECT id FROM customers WHERE email = ?', ['reezmahanan@gmail.com']);
    let customerId;
    if (custRows.length === 0) {
      const [insertCust] = await conn.execute(
        `INSERT INTO customers (name, email, phone, address, city, district)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['M. Reezma Hanan', 'reezmahanan@gmail.com', '+94 77 123 4567', '125 Galle Road', 'Colombo 04', 'Colombo']
      );
      customerId = insertCust.insertId;
      console.log('[SEED] Seeded demo customer: M. Reezma Hanan');
    } else {
      customerId = custRows[0].id;
    }

    // Seed sample order
    const [orderRows] = await conn.execute('SELECT id FROM orders WHERE tracking_id = ?', ['DOMEX-LK-89421']);
    if (orderRows.length === 0) {
      const [insertOrder] = await conn.execute(
        `INSERT INTO orders (tracking_id, customer_id, subtotal, delivery_fee, total, payment_method, status, courier)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['DOMEX-LK-89421', customerId, 8900.00, 0.00, 8900.00, 'cod', 'Confirmed', 'Domex Express']
      );
      const orderId = insertOrder.insertId;
      await conn.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, 1, 1, 8900.00]
      );
      console.log('[SEED] Seeded demo order: DOMEX-LK-89421');
    }

    console.log('[SEED] Database seeding complete!');
  } catch (err) {
    console.error('[SEED ERROR]', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
