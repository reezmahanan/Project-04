const express = require('express');
const router = express.Router();
const { pool } = require('../database/db');
const { validateOrder } = require('../middleware/validator');

/**
 * @route   GET /api/orders
 * @desc    READ: List orders joined with customer and items (Relational SQL JOIN)
 */
router.get('/', async (req, res, next) => {
  try {
    const [orders] = await pool.execute(`
      SELECT 
        o.id,
        o.tracking_id,
        o.subtotal,
        o.delivery_fee,
        o.total,
        o.payment_method,
        o.status,
        o.courier,
        o.created_at,
        c.id as customer_id,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.city as customer_city,
        c.district as customer_district
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.id DESC
    `);

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await pool.execute(`
        SELECT oi.id, oi.quantity, oi.unit_price, p.id as product_id, p.name as product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/orders/:trackingId
 * @desc    READ: Retrieve order details by Tracking ID
 */
router.get('/:trackingId', async (req, res, next) => {
  try {
    const trackingId = req.params.trackingId.trim().toUpperCase();

    const [orders] = await pool.execute(`
      SELECT 
        o.id,
        o.tracking_id,
        o.subtotal,
        o.delivery_fee,
        o.total,
        o.payment_method,
        o.status,
        o.courier,
        o.created_at,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.address as customer_address,
        c.city as customer_city,
        c.district as customer_district
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE UPPER(o.tracking_id) = ?
    `, [trackingId]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'Not Found',
        message: `Order with tracking number "${req.params.trackingId}" not found.`
      });
    }

    const order = orders[0];
    const [items] = await pool.execute(`
      SELECT oi.id, oi.quantity, oi.unit_price, p.id as product_id, p.name as product_name, p.img
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id]);
    order.items = items;

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/orders
 * @desc    CREATE: Place a new order using ACID Transaction (Insert Customer -> Insert Order -> Insert Items)
 */
router.post('/', validateOrder, async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    // Begin ACID Transaction
    await connection.beginTransaction();

    const { customer, items, paymentMethod } = req.body;

    // 1. Check or Insert Customer (Relational Integrity)
    let customerId;
    const [existingCust] = await connection.execute(
      'SELECT id FROM customers WHERE email = ?',
      [customer.email]
    );

    if (existingCust.length > 0) {
      customerId = existingCust[0].id;
      await connection.execute(
        'UPDATE customers SET name = ?, phone = ?, address = ?, city = ?, district = ? WHERE id = ?',
        [customer.name, customer.phone, customer.address || '', customer.city || '', customer.district || '', customerId]
      );
    } else {
      const [insertCust] = await connection.execute(
        'INSERT INTO customers (name, email, phone, address, city, district) VALUES (?, ?, ?, ?, ?, ?)',
        [customer.name, customer.email, customer.phone, customer.address || '', customer.city || '', customer.district || '']
      );
      customerId = insertCust.insertId;
    }

    // 2. Calculate Order Subtotal from Database Prices (Never trust client prices)
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const [pRows] = await connection.execute('SELECT id, name, price FROM products WHERE id = ?', [item.id]);
      if (pRows.length === 0) {
        throw new Error(`Product with ID ${item.id} does not exist.`);
      }
      const p = pRows[0];
      const itemSub = Number(p.price) * Number(item.qty);
      subtotal += itemSub;
      verifiedItems.push({
        product_id: p.id,
        name: p.name,
        unit_price: p.price,
        qty: item.qty
      });
    }

    const deliveryFee = subtotal >= 8500 ? 0 : 350;
    const total = subtotal + deliveryFee;
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `DOMEX-LK-${randomSuffix}`;

    // 3. Insert into Orders Table (Foreign Key -> customer_id)
    const [insertOrder] = await connection.execute(
      `INSERT INTO orders (tracking_id, customer_id, subtotal, delivery_fee, total, payment_method, status, courier)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [trackingId, customerId, subtotal, deliveryFee, total, paymentMethod || 'cod', 'Confirmed', 'Domex Express']
    );
    const orderId = insertOrder.insertId;

    // 4. Insert into Order Items Table (Foreign Keys -> order_id, product_id)
    for (const vItem of verifiedItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, vItem.product_id, vItem.qty, vItem.unit_price]
      );
    }

    // Commit Transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Order created and persisted to database successfully.',
      data: {
        orderId,
        trackingId,
        customerId,
        subtotal,
        deliveryFee,
        total,
        status: 'Confirmed',
        courier: 'Domex Express',
        items: verifiedItems
      }
    });
  } catch (err) {
    // Rollback Transaction in case of failure
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
});

module.exports = router;
