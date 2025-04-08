const { Sequelize } = require('sequelize');

// Настройка подключения к базе данных PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',  // Обычно база данных работает на localhost
  username: 'postgres', // Имя пользователя
  password: '', // Пустой пароль
  database: 'art_gallery', // Название базы данных
  logging: false, // Отключаем логирование SQL-запросов
});

module.exports = sequelize;
