const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const Artwork = require('./models/Artwork');
const Comment = require('./models/Comment');
const commentRoutes = require('./routes/comments');
const Order = require('./models/Order');
const orderRoutes = require('./routes/orders');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Роуты
app.use('/comments', commentRoutes);

app.use('/buy', orderRoutes);


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
