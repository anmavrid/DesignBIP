/**
 * Before running with this configuration (will not work with windows w/o)
 * 1. Install docker http://docs.master.dockerproject.org/engine/installation/linux/ubuntulinux/
 * 2. Build the image using the provided Docker file.
      $ docker build -t webgme-docker-worker:1.0.0 .
 */

// TODO: We need to turn on authentication and add the settings for cps-vo

'use strict';

var config = require('./config.default'),
    validateConfig = require('webgme/config/validator'),
    path = require('path');

console.log('#### Using Deployment Config ###');
config.server.workerManager.path = path.join(__dirname, '../node_modules/webgme-docker-worker-manager/dockerworkermanager');

config.server.workerManager.options = {
    //dockerode: null, // https://github.com/apocas/dockerode#getting-started
    image: 'webgme-docker-worker:1.0.0',
    maxRunningContainers: 4,
    keepContainersAtFailure: false
};

// Decrease from 10
config.server.maxWorkers = 6;

validateConfig(config);
module.exports = config;
