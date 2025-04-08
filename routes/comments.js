const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Получение комментариев для конкретной картины
router.get('/:artworkId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { artwork_id: req.params.artworkId },
      order: [['created_at', 'ASC']],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении комментариев', error: err.message });
  }
});

// Добавление комментария
router.post('/:artworkId', async (req, res) => {
  try {
    const { user_name, message } = req.body;
    const comment = await Comment.create({
      artwork_id: req.params.artworkId,
      user_name,
      message,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при добавлении комментария', error: err.message });
  }
});

module.exports = router;
