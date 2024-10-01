const ResponseUtils=require("../config/response.utils")
const portfolioService = require('../services/portfolio.services');

const LogUtils = require('../utils/log.utils');

const MODULE_NAME = 'clanx_assignment';
const Log = LogUtils.ModuleLogger(MODULE_NAME);


const getPortfolio = async (req, res) => {
  try {
    const results = await portfolioService.getPortfolioData();
    if (!results) {
      return res.json({
        success: false,
        data: "invalid response"
      });
    }
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    Log.error(error);
    return ResponseUtils.error(res, error);

  }
  };

  const getHoldings = async (req, res) => {
    try {
      const results = await portfolioService.calculateHoldingsData();
      if (!results) {
        return res.json({
          success: false,
          data: "invalid response"
        });
      }
      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      Log.error(error);
      return ResponseUtils.error(res, error);
  
    }
    };

    const getReturns = async (req, res) => {
      try {
        const results = await portfolioService.calculateReturnsData();
        if (!results) {
          return res.json({
            success: false,
            data: "invalid response"
          });
        }
        return res.status(200).json({
          success: true,
          data: results
        });
      } catch (error) {
        Log.error(error);
        return ResponseUtils.error(res, error);
    
      }
      };







module.exports = {
  getPortfolio,
  getHoldings,
  getReturns
};