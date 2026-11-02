const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Pending', 'Sold'),
    defaultValue: 'Active',
  },
}, {
  timestamps: true,
});

module.exports = Property;
