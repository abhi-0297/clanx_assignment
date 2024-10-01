/* eslint-disable no-console */

const { Writable, } = require('stream');
let bunyan = require('bunyan');

const DEFAULT_APP_NAME = process.env.SERVICE_NAME || 'service-undefined';
const HEALTH_CHECK_ROUTE = '/health-check';

const env = process.env.NODE_ENV;
const isDev = !env || env === '̄test';

const DEFAULT_LEVEL = !isDev ? bunyan.INFO : bunyan.TRACE;
let PROD_LEVEL = DEFAULT_LEVEL;
let BUGSNAG, SENTRY;

const BASE_LOGGER_CONFIG = {
    name: DEFAULT_APP_NAME,
    level: DEFAULT_LEVEL,
    src: true,
    log: {},
    user: '',
    username: '',
};

let baseConfig = {
    ...BASE_LOGGER_CONFIG,
};


const DEFAULT_LOG_OBJECT_KEYS = {
    'name': String,
    'module_name': String,
    'stream': String,
    'hostname': String,
    'pid': Number,
    'level': Number,
    'log_type': String,
    'method': String,
    'err': Object,
    'msg': String,
    'time': String,
    'src': Object,
    'log': String,
    'user': String,
    'status': String,
    'responseTime': String,
    'ipAddress': String,
    'url': String,
};


const DevStream = new Writable({
    objectMode: true,
    write(log, encoding, next) {

        try {
            const logObj = _formatLog(log);
            // // pretty print the log object
            if (logObj.level > 30) {
                console.log(JSON.stringify(logObj, null, 2));
            } else if (logObj.log_type === 'api_request') {
                console.log(`${logObj.method} ${logObj.url} ${logObj.status}`);
            } else {
                console.log(logObj.msg || logObj);
            }

        } catch (err) {
            console.log(log);
        }
        next();
    },
});


const ProdStream = new Writable({
    objectMode: true,
    write(log, encoding, next) {

        try {
            const logObj = _formatLog(log);
            // // pretty print the log object
            if (logObj.level >= PROD_LEVEL || logObj.log_type === 'api_request') {
                process.stdout.write(JSON.stringify(logObj) + '\n');
            }
        } catch (err) {
            process.stdout.write(log + '\n');
        }
        next();
    },
});


const init = (serviceName, level, Bugsnag, Sentry) => {
    baseConfig = {
        ...BASE_LOGGER_CONFIG,
        name: serviceName || DEFAULT_APP_NAME,
    };

    level = level || DEFAULT_LEVEL;
    baseConfig.level = level;
    PROD_LEVEL = level;

    if (isDev) {
        baseConfig.streams = [{
            stream: DevStream,
            level,
        }, ];
    } else {
        baseConfig.streams = [{
            stream: ProdStream,
            level,
        }, ];
    }
    if (Bugsnag) {
        BUGSNAG = Bugsnag;
    }
    if(Sentry){
        SENTRY = Sentry;
    }
};

/**
 * Instantiate a logger object
 */
const Logger = (fields = {}) => bunyan.createLogger({
    ...baseConfig,
    ...fields,
});

/**
 * Instantiate a logger for a module
 * @param {String} moduleName - the name of the software module from which the logs are being shipped
 * @param {Object} fields - [optional]
 */
const ModuleLogger = (moduleName, fields = {}) => {
    const customLogger = {};
    const logger = bunyan.createLogger({
        ...baseConfig,
        module_name: moduleName,
        ...fields,
    });

    customLogger.trace = function () {
        const errorObj = arguments[0];
        const consoleObj = arguments[1];
        if(errorObj.constructor === Error){
            _logOnErrorTracker(errorObj, consoleObj);
        }
        logger.trace(errorObj);
    };
    customLogger.debug = function () {
        const errorObj = arguments[0];
        const consoleObj = arguments[1];
        if(errorObj.constructor === Error){
            _logOnErrorTracker(errorObj, consoleObj);
        }
        logger.debug(errorObj);
    };
    customLogger.info = function () {
        const errorObj = arguments[0];
        const consoleObj = arguments[1];
        if(errorObj.constructor === Error){
            _logOnErrorTracker(errorObj, consoleObj);
        }
        logger.info(errorObj);
    };
    customLogger.warn = function () {
        const errorObj = arguments[0];
        const consoleObj = arguments[1];
        if(errorObj.constructor === Error){
            _logOnErrorTracker(errorObj, consoleObj);
        }
        logger.warn(errorObj);
    };
    customLogger.error = function () {
        const errorObj = arguments[0];
        const consoleObj = arguments[1];
        if(errorObj instanceof Object){
            _logOnErrorTracker(errorObj, consoleObj);
        }
        logger.error(errorObj);
    };
    customLogger.fatal = function () {
        const errorObj = arguments[0];
        const consoleObj = arguments[1];
        if(errorObj.constructor === Error){
            _logOnErrorTracker(errorObj, consoleObj);
        }
        // logger.fatal(errorObj);
        console.log(errorObj);
    };
    customLogger.level = function () {
        return logger.level;
    };

    return customLogger;
};

const _logOnErrorTracker = (errorObj, consoleObj) => {
    if(errorObj.notifyException !== false && errorObj.statusCode !== 422){
        BUGSNAG && BUGSNAG.notify(errorObj, (event) => {
            event.addMetadata('payload', errorObj.payload);
            event.addMetadata('console', consoleObj);
        });
        SENTRY && SENTRY.captureException(errorObj, (scope) => {
            scope.setContext('payload', errorObj.payload);
            scope.setContext('console', consoleObj);
            return scope;
        });
    }
};

const _formatLog = (logObj) => {
    try {
        logObj = (typeof logObj === 'string' && logObj) ? JSON.parse(logObj) : logObj;
    } catch (e) {
        logObj = {};
    }
    logObj = logObj || {};

    if (logObj.log) {
        logObj = { ...logObj.log, ...logObj, };
        delete logObj.log;
    }

    delete logObj.v;
    const formattedLogObj = {};

    // eslint-disable-next-line no-unused-vars
    for (let key in DEFAULT_LOG_OBJECT_KEYS) {
        if (typeof logObj[key] === DEFAULT_LOG_OBJECT_KEYS[key].name.toLowerCase() && logObj[key]) {
            formattedLogObj[key] = logObj[key];
            delete logObj[key];
        } else if (typeof logObj[key] !== DEFAULT_LOG_OBJECT_KEYS[key].name.toLowerCase() && logObj[key]) {
            formattedLogObj[key] = DEFAULT_LOG_OBJECT_KEYS[key](logObj[key]);
        } else {
            formattedLogObj[key] = DEFAULT_LOG_OBJECT_KEYS[key]();
            delete logObj[key];
        }
    }
    formattedLogObj.log = JSON.stringify(logObj);
    return formattedLogObj;
};


/**
 * Facilitates api request logs
 * @param {BunyanLogger} logger - the logger to use
 * @param {Boolean} skipHealthCheck - whether the healthcheck requests should be logged
 */
const ApiLogMiddleware = function (logger, skipHealthCheck = true) {
    if (!logger) {
        throw new Error('No logger passed to apiLogMiddleware!');
    }
    const morgan = require('morgan');
    return morgan((tokens, req, res) => {

        if (skipHealthCheck && req.url.includes(HEALTH_CHECK_ROUTE)) {
            return;
        }

        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const log = {
            log_type: 'api_request',
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            contentLength: tokens.res(req, res, 'content-length'),
            responseTime: tokens['response-time'](req, res),
            ipAddress,
        };
        return logger.info(log);
    });
};


module.exports = {
    init,
    Logger,
    ModuleLogger,
    ApiLogMiddleware,
};