'use strict';

var config = require('./config.webgme'),
    validateConfig = require('webgme/config/validator');

// Add/overwrite any additional settings here
// config.server.port = 8080;
// config.mongo.uri = 'mongodb://127.0.0.1:27017/webgme_my_app';

config.requirejsPaths['widgets/DiagramDesigner'] =
    './node_modules/diagram-designers/src/visualizers/widgets/DiagramDesigner';

config.visualization.svgDirs = ['./src/svgs'];
config.seedProjects.defaultProject = 'BIP';

validateConfig(config);
module.exports = config;
