'use strict';

var config = require('./config.webgme'),
    path = require('path'),
    validateConfig = require('webgme/config/validator');

// Add/overwrite any additional settings here
// config.server.port = 8080;
config.mongo.uri = 'mongodb://127.0.0.1:27017/bip';

config.requirejsPaths['widgets/DiagramDesigner'] =
    './node_modules/webgme-bip-editors/src/visualizers/widgets/DiagramDesigner';

config.requirejsPaths['bipsrc'] = './src';
config.visualization.svgDirs.push(path.join(__dirname, '../src/svgs'));
//config.visualization.svgDirs = ['./src/svgs'];
config.seedProjects.defaultProject = 'BIPv1';
config.plugin.allowServerExecution = true;
validateConfig(config);
module.exports = config;
