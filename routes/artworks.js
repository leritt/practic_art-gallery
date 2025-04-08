const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// Получение всех картин
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.findAll();
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении картин', error: err.message });
  }
});

// Добавление новой картины
router.post('/', async (req, res) => {
  try {
    const { title, description, price, image_url } = req.body;
    const newArtwork = await Artwork.create({ title, description, price, image_url });
    res.status(201).json(newArtwork);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении картины', error: err.message });
  }
});

module.exports = router;
