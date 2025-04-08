const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Comment extends Model {}

Comment.init(
  {
    artworkId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'artworks', // Указывает на таблицу artworks
        key: 'id',
      },
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments', // Убедитесь, что имя таблицы указано правильно
    timestamps: true, // Добавление поля created_at
  }
);

module.exports = Comment;
