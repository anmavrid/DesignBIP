/**
 * This is just deployment with extra logging.
 */

'use strict';

var config = require('./config.deployment'),
    validateConfig = require('webgme/config/validator'),
    path = require('path');

console.log('#### Using Deployment Test Config ###');

config.server.workerManager.options.keepContainersAtFailure = true;

config.server.log.transports = [{
    transportType: 'Console',
    options: {
        level: 'debug',
        colorize: true,
        timestamp: true,
        prettyPrint: true,
        depth: 10,
        debugStdout: true
    }
}];


validateConfig(config);
module.exports = config;
