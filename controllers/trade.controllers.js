const ResponseUtils=require("../config/response.utils")
const LogUtils = require('../utils/log.utils');
const tradeService = require('../services/trade.services');

const MODULE_NAME = 'stock_management';
const Log = LogUtils.ModuleLogger(MODULE_NAME);


const addTrade = async (req, res) => {
  try {
    const { stockName, type, quantity, price, date,portfolio_id:portfolioId,} = req.body;

    const results = await tradeService.addTradeData(stockName, type, quantity, price, date,portfolioId,);
    if (!results) {
      return res.json({
        success: false,
        data: "invalid response"
      });
    }
    return res.status(201).json({
      success: true,
      data: results
    });
  } catch (error) {
    Log.error(error);
    return ResponseUtils.error(res, error);
  }
};



module.exports = {
  addTrade,
};
