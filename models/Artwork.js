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
    is_sold: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Artwork',
    tableName: 'artworks',
    timestamps: false,
  }
);

module.exports = Artwork;
