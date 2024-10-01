let express = require('express');
let router = express.Router();
const { validate, } = require('express-validation');

const PortfolioCtrl = require('../../../controllers/portfolio.controllers');

router.get('/', PortfolioCtrl.getPortfolio);
router.get('/holdings', PortfolioCtrl.getHoldings);
router.get('/returns', PortfolioCtrl.getReturns);

module.exports = router;