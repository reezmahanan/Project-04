/**
 * The Gatekeeper Rule: "Never Trust the Client"
 * Middleware for Syntactic & Semantic Validation
 * DecodeLabs Industrial Training Kit (Project 3)
 */

function validateProduct(req, res, next) {
  const { name, category, price } = req.body;

  if (!name || String(name).trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Product name is required.'
    });
  }

  if (!category || String(category).trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Product category is required.'
    });
  }

  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Product price must be a valid positive number.'
    });
  }

  next();
}

function validateOrder(req, res, next) {
  const { customer, items } = req.body;

  if (!customer || typeof customer !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Customer details are required.'
    });
  }

  if (!customer.name || !customer.phone || !customer.email) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Customer name, phone, and email are required.'
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Order must contain at least one item.'
    });
  }

  for (const item of items) {
    if (!item.id || !item.qty || item.qty <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Each item must have a valid id and positive quantity.'
      });
    }
  }

  next();
}

module.exports = {
  validateProduct,
  validateOrder
};
