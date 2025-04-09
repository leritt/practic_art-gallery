const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, delivery_method, comment } = req.body;

  try {
    const artwork = await Artwork.findByPk(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Картина не найдена' });
    }

    if (artwork.is_sold) {
      return res.status(400).json({ error: 'Картина уже продана' });
    }

    await Order.create({
      artwork_id: id,
      name,
      address,
      phone,
      delivery_method,
      comment
    });

    artwork.is_sold = true;
    await artwork.save();

    res.status(200).json({ message: 'Покупка оформлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при оформлении заказа', details: error.message });
  }
});

module.exports = router;
