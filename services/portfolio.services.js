const _ = require('lodash');
const portfolioModel = require('../models/portfolio');
const tradeModel = require('../models/trade');
const stockModel = require('../models/stock');



const getPortfolioData = async () => {
    const portfolio = await portfolioModel.findOne({include: { model: tradeModel, as: 'trades', include: ['stock'] }});
    return portfolio;
   
};
const calculateReturnsData = async () => {
    const holdings = await calculateHoldingsData();
    let returns = 0;
    
    for (const stock in holdings) {
      const holding = holdings[stock];
      returns += holding.quantity * (100 - holding.avgPrice); 
    }
    return returns;
   
};

const calculateHoldingsData = async () => {
    const trades = await tradeModel.findAll({
        include: [{ model: stockModel, as: 'stock' }]
      });
      console.log()
    const holdings = {};
    
    trades.forEach((trade) => {
      const stockName = trade.stock.name;
      if (!holdings[stockName]) {
        holdings[stockName] = { quantity: 0, avgPrice: 0 };
      }
  
      if (trade.type === 'BUY') {
        const currentHolding = holdings[stockName];
        const newQuantity = currentHolding.quantity + trade.quantity;
        const newAvgPrice = ((currentHolding.quantity * currentHolding.avgPrice) + (trade.quantity * trade.price)) / newQuantity;
        holdings[stockName] = { quantity: newQuantity, avgPrice: newAvgPrice };
      } else if (trade.type === 'SELL') {
        holdings[stockName].quantity -= trade.quantity;
      }
    });
  
    return holdings;
   
};

module.exports = {
    getPortfolioData,
    calculateHoldingsData,
    calculateReturnsData,
};
