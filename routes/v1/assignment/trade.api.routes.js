let express = require('express');
let router = express.Router();
const { validate, } = require('express-validation');

const TradeCtrl = require('../../../controllers/trade.controllers');

router.post('/addTrade', TradeCtrl.addTrade);

module.exports = router;



