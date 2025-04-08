const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const Artwork = require('./models/Artwork');
const Comment = require('./models/Comment');
const commentRoutes = require('./routes/comments');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Роуты
app.use('/comments', commentRoutes);

// Получение всех картин
app.get('/artworks', async (req, res) => {
  try {
    const artworks = await Artwork.findAll();
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось получить картины' });
  }
});

// Получение конкретной картины
app.get('/artworks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const artwork = await Artwork.findByPk(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Картина не найдена' });
    }
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось получить картину' });
  }
});

// Покупка картины
app.post('/buy/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const artwork = await Artwork.findByPk(id);
    if (!artwork) {
      return res.status(404).json({ error: 'Картина не найдена' });
    }
    if (artwork.is_sold) {
      return res.status(400).json({ error: 'Картина уже продана' });
    }

    artwork.is_sold = true;
    await artwork.save();
    res.status(200).json({ message: 'Покупка успешна' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при покупке картины', details: error.message });
  }
});

// Запуск сервера
sequelize.authenticate()
  .then(() => {
    console.log('База данных подключена');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Ошибка подключения к БД:', err);
  });
