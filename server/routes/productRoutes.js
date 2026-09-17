const express = require('express');
const router = express.Router();
const { pool } = require('../database/db');
const { validateProduct } = require('../middleware/validator');

/**
 * @route   GET /api/products
 * @desc    READ: Retrieve products (SQL SELECT with Parameterized Query filters)
 * @method  SQL SELECT
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Parameterized filtering to prevent SQL Injection
    if (category && category.toLowerCase() !== 'all') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ?)';
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    sql += ' ORDER BY id ASC';

    const [rows] = await pool.execute(sql, params);
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    READ: Retrieve a single product by Primary Key
 * @method  SQL SELECT
 */
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'Not Found',
        message: `Product with ID ${req.params.id} not found in database.`
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/products
 * @desc    CREATE: Add new product (SQL INSERT with Parameterized Query)
 * @method  SQL INSERT
 */
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const { name, category, price, regular_price, badge, img, stock_count } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO products (name, category, price, regular_price, badge, img, in_stock, stock_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        price,
        regular_price || null,
        badge || null,
        img || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
        (stock_count === undefined || stock_count > 0),
        stock_count || 10
      ]
    );

    // Fetch the newly inserted record using Primary Key
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Product created successfully in database.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    UPDATE: Modify existing product (SQL UPDATE with Parameterized Query)
 * @method  SQL UPDATE
 */
router.put('/:id', validateProduct, async (req, res, next) => {
  try {
    const { name, category, price, regular_price, badge, in_stock, stock_count } = req.body;

    const [result] = await pool.execute(
      `UPDATE products
       SET name = ?, category = ?, price = ?, regular_price = ?, badge = ?, in_stock = ?, stock_count = ?
       WHERE id = ?`,
      [
        name,
        category,
        price,
        regular_price || null,
        badge || null,
        in_stock !== undefined ? in_stock : true,
        stock_count || 10,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'Not Found',
        message: `Product with ID ${req.params.id} does not exist.`
      });
    }

    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Product updated successfully in database.',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    DELETE: Remove product (SQL DELETE with Parameterized Query)
 * @method  SQL DELETE
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'Not Found',
        message: `Product with ID ${req.params.id} does not exist.`
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: `Product with ID ${req.params.id} deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
