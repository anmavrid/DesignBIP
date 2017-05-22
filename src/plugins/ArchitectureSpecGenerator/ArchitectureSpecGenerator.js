/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 1.7.0 from webgme on Sun Feb 19 2017 20:48:34 GMT-0600 (CST).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
    'common/util/xmljsonconverter'
], function (
        PluginConfig,
        pluginMetadata,
        PluginBase,
        Converter) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);
    /**
     * Initializes a new instance of ArchitectureSpecGenerator.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin ArchitectureSpecGenerator.
     * @constructor
     */
    var ArchitectureSpecGenerator = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    };
    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructue etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    ArchitectureSpecGenerator.metadata = pluginMetadata;
    // Prototypical inheritance from PluginBase.
    ArchitectureSpecGenerator.prototype = Object.create(PluginBase.prototype);
    ArchitectureSpecGenerator.prototype.constructor = ArchitectureSpecGenerator;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    ArchitectureSpecGenerator.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
            artifact,
            path = self.core.getAttribute(self.core.getParent(self.activeNode), 'path'),
            fs;

        if (path) {
            path += '/' + self.core.getAttribute(self.activeNode, 'name');
            path = path.replace(/\s+/g, '');
            try {
                fs = require('fs');
            } catch (e) {
                self.logger.error('To save directly to file system, plugin needs to run on server!');
            }
        }
        self.loadNodeMap(self.activeNode)
                .then(function (nodes) {
                    var violations = self.hasViolations(nodes),
                    model, xml, pathArrayForFile, tempPath, j,
                    filesToAdd = {},
                    macros = {};

                    if (violations.length > 0) {
                        violations.forEach(function (violation) {
                            self.createMessage(violation.node, violation.message, 'error');
                        });
                        throw new Error('Model has ' + violations.length + '  violation(s), see messages for details');
                    }
                    model = self.generateMacros(self.generateArchitectureModel(nodes));
                    macros = self.generateRequireAccept(model.ports);
                    xml = {glue: {accepts: {accept: macros.accept}, requires: {require: macros.require}}};
                    pathArrayForFile = 'Glue.xml'.split('/');
                    tempPath = path;
                    filesToAdd['Glue.xml'] = (new Converter.JsonToXml()).convertToString(xml);

                    if (path) {
                        if (pathArrayForFile.length >= 1) {
                            for (j = 0; j<=pathArrayForFile.length - 1; j+=1) {
                                tempPath += '/' + pathArrayForFile[j];
                                try {
                                    fs.statSync(path);
                                } catch (err) {
                                    if (err.code === 'ENOENT') {
                                        fs.mkdirSync(path);
                                    }
                                }
                            }
                            fs.writeFileSync(path + '/' + 'Glue.xml', filesToAdd['Glue.xml'], 'utf8');
                        }
                    }
                    artifact = self.blobClient.createArtifact('GlueSpecification');
                    return artifact.addFiles(filesToAdd);
                })
                .then(function (fileHash) {
                    self.result.addArtifact(fileHash);
                    return artifact.save();
                })
                .then(function () {
                    self.result.setSuccess(true);
                    callback(null, self.result);
                })
                .catch(function (err) {
                    self.logger.error(err.stack);
                    // Result success is false at invocation.
                    callback(err, self.result);
                }) ;
    };


    ArchitectureSpecGenerator.prototype.generateRequireAccept = function (inputPorts) {
        var acceptPorts = [],
        option = [],
        causes = [],
        ports = [],
        macros = {
            accept: [],
            require: []
        },
        effect, port, acc, requiredPort,
        acceptCauses, requiredPorts, listOfPorts;

        for (port of inputPorts) {
            effect = {'@id': port.name, '@specType': port.componentType};
            acceptPorts = [];
            for (acc of port.accept) {
                if (acc !== '') {
                    acceptPorts.push({'@id': acc[0], '@specType': acc[1]});
                }
            }
            acceptCauses = {port: acceptPorts};
            option = [];
            if (port.require !== '') {
                for (requiredPorts of port.require) {
                    causes = [];
                    for (listOfPorts of requiredPorts) {
                        ports = [];
                        for (requiredPort of listOfPorts) {
                            if (requiredPort !== '') {
                                ports.push({'@id': requiredPort[0], '@specType': requiredPort[1]});
                            }
                        }
                        causes.push({port: ports});
                    }
                    option.push({causes: causes});
                }
            }
            macros.accept.push({effect: effect, causes: acceptCauses});
            macros.require.push({effect: effect, causes: {option: option}});
        }
        return macros;
    };

    ArchitectureSpecGenerator.prototype.generateMacros = function (architectureModel) {
        var self = this,
        port,
        macros = {};

        for (port of architectureModel.ports) {
            macros = self.generateMacrosAlgorithm(port);
            //set to list
            port.require = [...macros.require];
            port.accept = [...macros.accept];
        }
        for (port of architectureModel.ports) {
            port = self.getMacroLists(port);
        }
        return architectureModel;
    };

    ArchitectureSpecGenerator.prototype.getMacroLists = function (port) {
        var acceptedPort, requireList, option, requiredPort,
            simpleAccept = [],
            simpleRequire = [],
            simpleRequireList = [];

        for (acceptedPort of port.accept) {
            if (acceptedPort === '') {
                simpleAccept.push('');
            } else {
                simpleAccept.push([acceptedPort.name, acceptedPort.componentType]);
            }
        }
        for (requireList of port.require) {
            if (requireList === '') {
                simpleRequire = '';
            } else {
                simpleRequireList = [];
                for (option of requireList) {
                    var simpleList = [];
                    for (requiredPort of option) {
                        if (requiredPort === '') {
                            simpleList.push('');
                        } else {
                            simpleList.push([requiredPort.name, requiredPort.componentType]);
                        }
                    }
                    simpleRequireList.push(simpleList);
                }
                simpleRequire.push(simpleRequireList);
            }
        }
        port.accept = simpleAccept;
        port.require = simpleRequire;
        return port;
    };

    /* This is the paper's algorithm */
    ArchitectureSpecGenerator.prototype.generateMacrosAlgorithm = function (port) {
        var i, connector, connectorEnd, end,
          option = [],
          macros = {
            require: new Set(),
            accept: new Set()
        },
         reqCause = [];

        if (port.connectorEnds !== undefined) {
            for (end of port.connectorEnds) {
                if (!end.hasOwnProperty('connector')) {
                    macros.require.add('');
                    macros.accept.add('');
                    break;
                }
            }
        }
        for (connector of port.connectors) {
            option = [];
            for (end of connector.ends) {
                if (end.port === port) {
                    connectorEnd = end;
                }
            }
            if (connectorEnd.multiplicity !== '1') {
                for (end of connector.ends) {
                    macros.accept.add(end.port);
                }
            } else {
                for (end of connector.ends) {
                    if (end.port.name !== port.name) {
                        macros.accept.add(end.port);
                    }
                }
            }
            if (connectorEnd.type === 'Trigger') {
                option.push('');
            } else {
                var triggerExists = false;
                for (end of connector.ends) {
                    if (end.type === 'Trigger') {
                        triggerExists = true;
                    }
                }
                for (end of connector.ends) {
                    if (triggerExists === false) {
                        if (end.port.name !== port.name || parseInt(end.multiplicity) > 1 ) {
                            reqCause = [];
                            for (i = 0; i < parseInt(end.multiplicity); i++) {
                                reqCause.push(end.port);
                            }
                            option.push(reqCause);
                        }
                    } else {
                        if (end.type === 'Trigger' && (end.port.name !== port.name || end.multiplicity !== 1 )) {
                            reqCause = [];
                            for (i = 0; i < parseInt(end.multiplicity); i++) {
                                reqCause.push(end.port);
                            }
                            option.push(reqCause);
                        }
                    }
                }
            }
            macros.require.add(option);
        }
        return macros;
    };

    ArchitectureSpecGenerator.prototype.generateArchitectureModel = function (nodes) {
        var self = this,
        path, node, end, port, child, connector,
        srcConnectorEnd, dstConnectorEnd,
                subConnectors = [],
                architectureModel = {
                    ports: [],
                    connectors: [],
                    connectorEnds: []
                };

        for (path in nodes) {
            node = nodes[path];
            if (self.isMetaTypeOf(node, self.META.ComponentType)) {
                for (child of self.core.getChildrenPaths(node)) {
                    if (self.isMetaTypeOf(nodes[child], self.META.EnforceableTransition)) {
                        nodes[child].componentType = path;
                    }
                }
            } else if (self.isMetaTypeOf(node, self.META.EnforceableTransition)) {
                port = node;
                architectureModel.ports.push(port);
                port.name = self.core.getAttribute(node, 'name');
            } else if (self.isMetaTypeOf(node, self.META.Connector)) {
                /* If the connector is binary */
                if (self.getMetaType(nodes[self.core.getPointerPath(node, 'dst')]) !== self.META.Connector) {
                    connector = node;
                    architectureModel.connectors.push(node);
                    srcConnectorEnd = nodes[self.core.getPointerPath(node, 'src')];
                    dstConnectorEnd = nodes[self.core.getPointerPath(node, 'dst')];
                    srcConnectorEnd.connector = node;
                    dstConnectorEnd.connector = node;
                    connector.ends = [srcConnectorEnd, dstConnectorEnd];
                /* If it is part of an n-ary connector */
                } else {
                    subConnectors.push(node);
                }
            } else if (self.isMetaTypeOf(node, self.META.Connection) && self.getMetaType(node) !== node) {
                var gmeEnd = nodes[self.core.getPointerPath(node, 'src')];
                if (self.getMetaType(gmeEnd) !== self.META.Connector) {
                    end = gmeEnd;
                    architectureModel.connectorEnds.push(end);
                    port = nodes[self.core.getPointerPath(node, 'dst')];
                    end.port = port;
                    if (!port.hasOwnProperty('connectorEnds')) {
                        port.connectorEnds = [];
                    }
                    port.connectorEnds.push(end);
                    end.type = self.core.getAttribute(gmeEnd, 'name');
                    end.degree = self.core.getAttribute(gmeEnd, 'degree');
                    end.multiplicity = self.core.getAttribute(gmeEnd, 'multiplicity');
                }
                //TODO: add also export ports for hierarchical connector motifs
            }
        }
        architectureModel = self.connectorToEnds (subConnectors, architectureModel, nodes);
        return self.portToEnds(architectureModel);
    };

    ArchitectureSpecGenerator.prototype.connectorToEnds = function (subConnectors, architectureModel, nodes) {
        var subPart, node, auxNode, end, connector,
            self = this;

        for (subPart of subConnectors) {
            node = nodes[self.core.getPointerPath(subPart, 'dst')];
            auxNode = nodes[self.core.getPointerPath(node, 'src')];
            end = nodes[self.core.getPointerPath(subPart, 'src')];
            if (architectureModel.connectors.includes(node)) {
                node.ends.push(end);
                end.connector = node;
            } else if (architectureModel.connectorEnds.includes(auxNode)) {
                for (connector in architectureModel.connectors) {
                    if (connector.ends.includes(auxNode)) {
                        connector.ends.push(end);
                        end.connector = connector;
                    }

                }
            }
        }
        return architectureModel;
    };

    ArchitectureSpecGenerator.prototype.portToEnds = function (architectureModel) {
        var port, end,
        self = this;

        for (port of architectureModel.ports) {
            port.connectors = new Set();
            if (port.connectorEnds !== undefined) {
                for (end of port.connectorEnds) {
                    if (end.hasOwnProperty('connector')) {
                        port.connectors.add(end.connector);
                    }
                }
            } else {
                self.logger.warn('Port ' + self.core.getAttribute(port, 'name') + ' is not connected to any end.');
            }
        }
        return architectureModel;
    };

    ArchitectureSpecGenerator.prototype.hasViolations = function (nodes) {
        var violations = [],
        self = this,
        nodePath,
        node,
        zeroEnforceableTransitions = true;

        for (nodePath in nodes) {
            node = nodes[nodePath];
            if (this.isMetaTypeOf(node, this.META.EnforceableTransition)) {
                zeroEnforceableTransitions = false;
            } else if (this.isMetaTypeOf(node, this.META.Connector)) {
                if (self.core.getPointerPath(node, 'dst') === null) {
                    violations.push({
                        node: node,
                        message: 'Dst of connector [' + nodePath + '] is null.'
                    });
                }
                if (self.core.getPointerPath(node, 'src') === null) {
                    violations.push({
                        node: node,
                        message: 'Src of connector [' + nodePath + '] is null.'
                    });
                }
            } else if (this.isMetaTypeOf(node, this.META.Connection)) {
                if (self.core.getPointerPath(node, 'dst') === null) {
                    violations.push({
                        node: node,
                        message: 'Dst of connection [' + nodePath + '] is null.'
                    });
                }
                if (self.core.getPointerPath(node, 'src') === null) {
                    violations.push({
                        node: node,
                        message: 'Src of connection [' + nodePath + '] is null.'
                    });
                }
            } else if (this.isMetaTypeOf(node, this.META.Trigger) || this.isMetaTypeOf(node, this.META.Synchron)) {
                var isConnected = false;
                for (var path in nodes) {
                    if (this.isMetaTypeOf(nodes[path], this.META.Connection) ) {
                        if (self.core.getPointerPath(nodes[path], 'src') === nodePath) {
                            isConnected = true;
                        }
                    }
                }
                if (!isConnected) {
                    violations.push({
                        node: node,
                        message: 'ConnectorEnd [' + nodePath + '] is not connected to any port.'
                    });
                }
            } else {
                //TODO: Check multiplicity, degree of connector ends
                //this.logger.info('Found unexpected type, no checking performed ...');
            }
        }
        if (zeroEnforceableTransitions) {
            violations.push({
                message: 'No Enforceable Transitions in the entire project, cannot generate Architecture specification.'
            });
        }
        return violations;
    };

    return ArchitectureSpecGenerator;
});
