const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Artwork extends Model {}

Artwork.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Artwork',
    tableName: 'artworks', // Убедитесь, что имя таблицы указано правильно
    timestamps: false, // Если в таблице нет полей createdAt и updatedAt
  }
);

module.exports = Artwork;
