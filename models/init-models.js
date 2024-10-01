
const stockModel = require('./stock');
const tradeModel = require('./trade');
const portfolioModel=require('./portfolio');


const initModels = async () => {
    stockModel.hasMany(tradeModel, { as: 'trades', foreignKey: 'stock_id' });  
    tradeModel.belongsTo(stockModel, { as: 'stock', foreignKey: 'stock_id' });  
    tradeModel.belongsTo(portfolioModel, { as: 'portfolio', foreignKey: 'portfolio_id' });  
    portfolioModel.hasMany(tradeModel, { as: 'trades', foreignKey: 'portfolio_id' });

};

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;



