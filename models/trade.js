const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('trades', {
  trade_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stock_id: {
    type: DataTypes.INTEGER,
    references: { model: 'stocks', key: 'stock_id' },
    allowNull: false,
  },
  portfolio_id: {
    type: DataTypes.INTEGER,
    references: { model: 'portfolios', key: 'portfolio_id' },
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('BUY', 'SELL'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  sequelize,
  tableName: 'trades',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'trade_id' },
      ],
    },
  ],
});

