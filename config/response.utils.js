

const responseMessage = (success, message, payload, extraParamsObj) => {
    let payloadObj = {
        success,
    };
    if (message) {
        payloadObj.message = message;
    }
    if (extraParamsObj) {
        if (typeof extraParamsObj === 'object' && Object.keys(extraParamsObj).length) {
            payloadObj = { ...payloadObj, ...extraParamsObj, };
        }
    }
    if (payload) {
        payloadObj.payload = payload;
    }
    return payloadObj;
};

/**
 *
 * @param response
 * @param error
 * @param message
 * @param payload
 * @param statusCode
 * @returns {*|Promise<any>}
 */
const error = (response, error, message = 'Oops! Something went wrong!', payload, statusCode = 500, extraParamsObj) => {

    const payloadObj = responseMessage(false, error.message || message, payload, extraParamsObj);
    
    if (error.statusCode) {
        statusCode = error.statusCode;
    }

    return response.status(statusCode).json(payloadObj);
};

module.exports = {
    error,

};