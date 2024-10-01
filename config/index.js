const dotenv = require('dotenv');
const path = require('path');


const environment = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = environment;

const envConfig = dotenv.config({
    path: path.normalize(`${__dirname}/../env/.env`),
});

const APP_NAME = process.env.APP_NAME;

let config = {
    root: path.normalize(`${__dirname}/..`),
    appName: APP_NAME,
    host:'0.0.0.0',
    port: 7000,
    logger: {
        name: APP_NAME,
    },
    environment,
};

// merge this config with the environment based config
module.exports = Object.assign({}, config, envConfig.parsed);
