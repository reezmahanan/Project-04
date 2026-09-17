const express = require('express');
const router = express.Router();
const { pool } = require('../database/db');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM customers ORDER BY id DESC');
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
