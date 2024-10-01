const _ = require('lodash');
const stockModel = require('../models/stock');
const tradeModel = require('../models/trade');
const { Op,sequelize} = require('sequelize');

const addTradeData = async (stockName, type, quantity, price, date,portfolioId) => {
 let stock = await stockModel.findOne({ where: { name: stockName },raw:true });
 console.log(stock)
 if (!stock) {
   stock = await stockModel.create({ name: stockName });
 }

 const trade = await tradeModel.create({ stock_id: stock.stock_id, type, quantity, price, date, portfolio_id:portfolioId});
    return trade;
};

module.exports = {
    addTradeData
};
