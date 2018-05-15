module.exports = {
    init: (app) => {
        const log4js = require('../../config/log4js.config')
        const traceLogger = log4js.getLogger('trace')
        const errorLogger = log4js.getLogger('error')
        const infoLogger = log4js.getLogger('info')
        log4js.useLogger(app, traceLogger);
        console.log = infoLogger.info.bind(infoLogger);
        console.error = errorLogger.error.bind(errorLogger);
    }
}