const config = require('./config/index');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');


const LogUtils= require('./utils/log.utils');
const { ValidationError, } = require('express-validation');
const DB = require('./config/db');
const InitPGModels = require('./models/init-models');

const SERVICE_NAME = 'clanx_assignment';
const MODULE_NAME = 'clanx_assignment-index';

LogUtils.init(SERVICE_NAME, undefined, null,null);

const Log = LogUtils.ModuleLogger(MODULE_NAME);

const connectToDbs = () => {
    return Promise.all([
        DB.authenticate(),
        InitPGModels(DB),
    ]);
};


const startServer = async () => {
    try {
        await connectToDbs();

        const app = express();
        app.use(cors({
            origin: '*',
        }));
        app.options('*', (req, res, next) => {
            // ... (same as your existing code)
            next();
        });

        app.enable('trust proxy');
        app.use(bodyParser.json({ limit: '5mb' }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(compression());

        app.get('/health-check', (req, res) => res.send('OK'));

        app.use('/', require('./routes'));

        app.use('*', (req, res) => {
            res.status(404).end();
        });

        app.get('/shutdown-check', (req, res) => {
            // ... (same as your existing code)
        });

        const server = http.createServer(app);
        server.listen(config.port, config.host, function () {
            Log.info('clanx_assignment Service started on host: ' + config.host + ' and port: ' + config.port);
        });

        process.on('SIGINT', () => {
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGTERM', () => {
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();








