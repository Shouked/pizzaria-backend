const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = new Order({
      user: req.user.id, // O ID do usuário autenticado
      items,
      total,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
