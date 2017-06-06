'use strict';

var config = require('./config.default'),
    validateConfig = require('webgme/config/validator'),
    path = require('path');

console.log('#### Using Deployment Config ###');
config.server.workerManager.path = path.join(__dirname, '../node_modules/webgme-docker-worker-manager/dockerworkermanager');

// These are the default options - this section can be left out..
config.server.workerManager.options = {
    //dockerode: null, // https://github.com/apocas/dockerode#getting-started
    image: 'webgme-docker-worker:0.1.1',
    maxRunningContainers: 4,
    keepContainersAtFailure: false
};

validateConfig(config);
module.exports = config;
