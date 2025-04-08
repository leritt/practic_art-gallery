const express = require('express');
const path = require('path');
const cors = require('cors'); // Добавляем CORS
const sequelize = require('./config/db'); // Подключение к базе данных
const app = express();
const PORT = process.env.PORT || 3000;

// Модели для картин и комментариев
const Artwork = require('./models/Artwork');
const Comment = require('./models/Comment');

// Включаем CORS для разрешения запросов с других доменов
app.use(cors()); // Это нужно добавить для разрешения всех доменов

// Настройка для обработки данных JSON (для POST-запросов)
app.use(express.json());

// Раздача статических файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// API для получения картин
app.get('/artworks', async (req, res) => {
    try {
        const artworks = await Artwork.findAll();
        res.json(artworks);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось получить картины' });
    }
});

// API для получения одной картины по ID
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

// API для получения комментариев по ID картины
app.get('/comments/:artworkId', async (req, res) => {
    const { artworkId } = req.params;
    try {
        const comments = await Comment.findAll({ where: { artworkId } });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось получить комментарии' });
    }
});

// API для добавления комментария
app.post('/comments/:artworkId', async (req, res) => {
    const { artworkId } = req.params;
    const { user_name, message } = req.body;
    try {
        const comment = await Comment.create({ artworkId, user_name, message });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось добавить комментарий' });
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('База данных подключена');
    })
    .catch(err => {
        console.error('Не удалось подключиться к базе данных:', err);
    });

// Запуск сервера
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
});
