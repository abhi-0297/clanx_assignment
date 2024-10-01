let express = require('express');
let router = express.Router();

const Api = require('./v1/index.api.v3.routes');


router.use('/api', Api);


module.exports = router;




