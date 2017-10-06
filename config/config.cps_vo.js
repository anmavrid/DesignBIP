'use strict';

var path = require('path'),
    config = require('./config.default'),
    validateConfig = require('webgme/config/validator');

// Add/overwrite any additional settings here
// config.server.port =
//config.mongo.uri = 'mongodb://127.0.0.1:27017/bip';

//config.requirejsPaths['widgets/DiagramDesigner'] =
//    './node_modules/webgme-bip-editors/src/visualizers/widgets/DiagramDesigner';

//config.requirejsPaths['bipsrc'] = './src';
//config.visualization.svgDirs = ['./src/svgs'];
//config.seedProjects.defaultProject = 'BIP';
//config.plugin.allowServerExecution = true;
//validateConfig(config);
//module.exports = config;
config.authentication.enable = true;
config.authentication.inferredUsersCanCreate = true;
config.authentication.allowGuests = false;
config.authentication.allowUserRegistration = false;
config.authentication.logInUrl = 'http://cps-vo.org/group/tools'
config.authentication.logOutUrl = 'http://cps-vo.org/group/tools'
config.authentication.jwt.privateKey = path.join(__dirname, '..', '..', 'token_keys','private_key');
config.authentication.jwt.publicKey = path.join(__dirname, '..', '..', 'token_keys', 'public_key');
config.server.port = 80;

console.log('#### Using CPS-VO Config ###');
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
