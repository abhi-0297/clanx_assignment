
const Sequelize = require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(config.CP_DATABASE, config.CP_USERNAME, config.CP_PASSWORD, {
    host: config.CP_HOST,
    port: config.CP_PORT,
    dialect: 'mysql',
    logging: config.environment === 'development' ? console.log : false,
});


module.exports = sequelize;
