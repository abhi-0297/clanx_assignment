const express = require('express');
const router = express.Router();

const portfolioRoute = require('./assignment/portfolio.api.routes');
const tradeRoute = require('./assignment/trade.api.routes');

router.use('/portfolio', portfolioRoute);
router.use('/trade', tradeRoute);



module.exports = router;
