/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 1.7.0 from webgme on Mon Mar 20 2017 21:44:14 GMT-0500 (CDT).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
     'plugin/JavaBIPEngine/JavaBIPEngine/ArithmeticExpressionParser'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase,
    ArithmeticExpressionParser) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of JavaBIPEngine.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin JavaBIPEngine.
     * @constructor
     */
    var JavaBIPEngine = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    };

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructue etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    JavaBIPEngine.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    JavaBIPEngine.prototype = Object.create(PluginBase.prototype);
    JavaBIPEngine.prototype.constructor = JavaBIPEngine;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    JavaBIPEngine.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this;
        var architectureModel = {};

        self.loadNodeMap(self.activeNode)
                .then(function (nodes) {
                    self.logger.debug(Object.keys(nodes));

                    var violations = self.hasViolations(nodes);
                    if (violations.length > 0) {
                        violations.forEach(function (violation) {
                            self.createMessage(violation.node, violation.message, 'error');
                        });
                        throw new Error('Model has ' + violations.length + '  violation(s), see messages for details');
                    }
                    architectureModel = self.getArchitectureModel(nodes);
                    var inconsistencies = self.checkConsistency(architectureModel, nodes);
                    if (inconsistencies.length === 0) {
                        self.startJavaBIPEngine(architectureModel);
                    } else {
                        inconsistencies.forEach(function (inconsistency) {
                            self.createMessage(inconsistency.node, inconsistency.message, 'error');
                        });
                        throw new Error('Model has ' + inconsistencies.length + '  inconsistencies, see messages for details');
                    }
                })
        .then(function () {
                        self.result.setSuccess(true);
                        callback(null, self.result);
                    })
                    .catch(function (err) {
                        self.logger.error(err.stack);
                        // Result success is false at invocation.
                        callback(err, self.result);
                    });
    };

    JavaBIPEngine.prototype.getArchitectureModel = function (nodes) {
        var self = this,
        architectureModel = {
            componentTypes: [],
            ports: [],
            subConnectors: [],
            connectorEnds: [],
            connections: [],
            connectors: []
        };

        for (var path in nodes) {
            var node = nodes[path];
            if (self.isMetaTypeOf(node, self.META.ComponentType)) {
                var cardinality = self.core.getAttribute(node, 'cardinality');
                var component = node;
                architectureModel.componentTypes.push(component);
                for (var child of self.core.getChildrenPaths(node)) {
                    if (self.isMetaTypeOf(nodes[child], self.META.EnforceableTransition)) {
                        var port = nodes[child];
                        architectureModel.ports.push(port);
                        if (/^[a-z]$/.test(cardinality)) {
                            component.cardinalityParameter = cardinality;
                            self.logger.debug('cardinalityParameter ' + component.cardinalityParameter);
                        }
                        while (/^[a-z]$/.test(cardinality) ) {
                            cardinality = 3;
                            //cardinality = prompt('Please enter number of component instances for ' + //self.core.getAttribute(node, 'name') + 'component type');
                        }
                        self.logger.debug('cardinality: ' + cardinality);
                        nodes[child].cardinality = cardinality;
                    }
                }
                component.cardinalityValue = cardinality;
                self.logger.debug('cardinalityValue ' + component.cardinalityValue);

            } else if (self.isMetaTypeOf(node, self.META.Connector)) {
                /* If the connector is binary */
                if (self.getMetaType(nodes[self.core.getPointerPath(node, 'dst')]) !== self.META.Connector) {
                    var connector = node;
                    architectureModel.connectors.push(connector);
                    var srcConnectorEnd = nodes[self.core.getPointerPath(node, 'src')];
                    var dstConnectorEnd = nodes[self.core.getPointerPath(node, 'dst')];
                    srcConnectorEnd.connector = connector;
                    dstConnectorEnd.connector = connector;
                    connector.ends = [srcConnectorEnd, dstConnectorEnd];
                /* If it is part of an n-ary connector */
                } else {
                    architectureModel.subConnectors.push(node);
                }
            } else if (self.isMetaTypeOf(node, self.META.Connection) && self.getMetaType(node) !== node) {
                architectureModel.connections.push(node);
                var gmeEnd = nodes[self.core.getPointerPath(node, 'src')];
                if (self.getMetaType(gmeEnd) !== self.META.Connector) {
                    var connectorEnd = gmeEnd;
                    architectureModel.connectorEnds.push(connectorEnd);
                    connectorEnd.degree = self.core.getAttribute(gmeEnd, 'degree');
                    connectorEnd.multiplicity = self.core.getAttribute(gmeEnd, 'multiplicity');
                }
                //TODO: add export ports for hierarchical connector motifs
            }
        }
        return architectureModel;
      };

    JavaBIPEngine.prototype.checkConsistency = function (architectureModel, nodes) {
        var self = this,
         inconsistencies = [];

        /*1. Checks whether multiplicities are less or equal to corresponding cardinalities
        2. Checks equality of matching factors of the same connector */

        for (var connection of architectureModel.connections) {
            var end = nodes[self.core.getPointerPath(connection, 'src')];
            if (self.getMetaType(end) !== self.META.Connector) {
                end.cardinality = nodes[self.core.getPointerPath(connection, 'dst')].cardinality;
            }
        }
        for (var subpart of architectureModel.subConnectors) {
            var auxNode = nodes[self.core.getPointerPath(subpart, 'dst')];
            var srcAuxNode = nodes[self.core.getPointerPath(auxNode, 'src')];
            var srcEnd = nodes[self.core.getPointerPath(subpart, 'src')];
            if (architectureModel.connectors.includes(auxNode)) {
                auxNode.ends.push(srcEnd);
                srcEnd.connector = auxNode;
            } else if (architectureModel.connectorEnds.includes(srcAuxNode)) {
                for (var existingConnector in architectureModel.connectors) {
                    if (existingConnector.ends.includes(srcAuxNode)) {
                        existingConnector.ends.push(srcEnd);
                        srcEnd.connector = existingConnector;
                    }
                }
            }
        }
        for (var motif of architectureModel.connectors) {
            var matchingFactor = -1;
            for (var end of motif.ends) {
                var degreeExpression = end.degree;
                self.logger.debug('degreeExpression: ' + degreeExpression);
                if (!/^[0-9]+$/.test(end.degree)) {
                    for (var type of architectureModel.componentTypes) {
                        if (type.cardinalityParameter !== undefined && degreeExpression.includes(type.cardinalityParameter)) {
                            degreeExpression = degreeExpression.replace(type.cardinalityParameter, type.cardinalityValue);
                            self.logger.debug('degreeValue ' + degreeExpression);
                        }
                    }
                    end.degree = eval(degreeExpression);
                }
                var multiplicityExpression = end.multiplicity;
                self.logger.debug('multiplicityExpression: ' + multiplicityExpression);
                if (!/^[0-9]+$/.test(end.multiplicity)) {
                    for (var type of architectureModel.componentTypes) {
                        if (type.cardinalityParameter !== undefined && multiplicityExpression.includes(type.cardinalityParameter)) {
                            multiplicityExpression = multiplicityExpression.replace(type.cardinalityParameter, type.cardinalityValue);
                            self.logger.debug('multiplicityValue ' + multiplicityExpression);
                        }
                    }
                    end.multiplicity = eval(multiplicityExpression);
                    if (end.multiplicity > end.cardinality) {
                        inconsistencies.push({
                            node: end,
                            message: 'Multiplicity of connector end [' + this.core.getPath(end) + '] is greater than the cardinality of the corresponding component type'
                        });
                    }
                }
                self.logger.debug('cardinality value: ' + end.cardinality);
                self.logger.debug('matchingFactor new ' + (end.degree * end.cardinality) / end.multiplicity);
                self.logger.debug('matchingFactor old ' + matchingFactor);
                var newMatchingFactor = (end.degree * end.cardinality) / end.multiplicity;
                if (/^[0-9]+$/.test(newMatchingFactor)) {
                    if (matchingFactor === -1) {
                        matchingFactor = newMatchingFactor;
                    } else if (matchingFactor !== newMatchingFactor) {
                        inconsistencies.push({
                            node: motif,
                            message: 'Matching factors (cardinality * degree / multiplicity) of ends in connector motif [' + this.core.getPath(motif) + '] are not equal'
                        });
                        break;
                    }
                } else {
                    inconsistencies.push({
                        node: end,
                        message: 'Matching factor (cardinality * degree / multiplicity) [' + newMatchingFactor +'] of connector end [' + this.core.getPath(end) + '] is not a non-negative integer/'
                    });
                }
            }
        }
        return inconsistencies;
    };

    JavaBIPEngine.prototype.startJavaBIPEngine = function (architectureModel) {
        for (var type of architectureModel.componentTypes) {
        }
    };

    JavaBIPEngine.prototype.hasViolations = function (nodes) {
        var violations = [],
        cardinalities = [],
        connectorEnds = [],
        self = this,
        nodePath,
        node;

        /* Check that multiplicities, degrees are valid arithmetic expressions of cardinalities */
        for (nodePath in nodes) {
            node = nodes[nodePath];
            if (self.isMetaTypeOf(node, this.META.ComponentType)) {
                // Checks cardinality whether it is non zero positive integer or a lower-case character
                if (/^[a-z]|[1-9][0-9]*$/.test(self.core.getAttribute(node, 'cardinality'))) {
                    cardinalities.push(self.core.getAttribute(node, 'cardinality'));
                } else {
                    violations.push({
                        node: node,
                        message: 'Cardinality [' + this.core.getAttribute(node, 'cardinality') + '] of component type [' + this.core.getAttribute(node, 'name') + '] is not a natural non-zero number or a character'
                    });
                }
            } else if (self.isMetaTypeOf(node, this.META.Synchron) || self.isMetaTypeOf(node, this.META.Trigger)) {
                connectorEnds.push(node);
            }
        }
        var regExpArray = ['^[', '+*\\-\\\\', '\(\)', '0-9'];

        for (var c of cardinalities) {
            if (/^[a-z]$/.test(c)) {
                regExpArray.push(c);
            }
        }
        regExpArray.push.apply(regExpArray, [']', '+$']);
        var cardinalityRegEx = new RegExp(regExpArray.join(''), 'g');
        self.logger.debug(cardinalityRegEx);

        for (var end of connectorEnds) {
            // Checks multiplicities and degrees
            var multiplicity = self.core.getAttribute(end, 'multiplicity');
            var degree = self.core.getAttribute(end, 'degree');
            try {
                ArithmeticExpressionParser.parse(multiplicity);
            } catch (e) {
                violations.push({
                    node: end,
                    message: 'Multiplicity [' + multiplicity + '] of component end [' + this.core.getPath(end) + '] is not a valid arithmetic expression with integers and lower-case variables: ' + e
                });
            }
            try {
                ArithmeticExpressionParser.parse(degree);
            } catch (e) {
                violations.push({
                    node: end,
                    message: 'Degree [' + degree + '] of component end [' + this.core.getPath(end) + '] is not a valid arithmetic expression with integers and lower-case variables: ' + e
                });
            }
            cardinalityRegEx.lastIndex = 0;
            if (!(cardinalityRegEx.test(multiplicity))) {
                violations.push({
                    node: end,
                    message: 'Multiplicity [' + multiplicity + '] of component end [' + this.core.getPath(end) + '] is not a natural number or an arithmetic expression of cardinality parameters'
                });
            }
            cardinalityRegEx.lastIndex = 0;
            if (!cardinalityRegEx.test(degree)) {
                violations.push({
                        node: end,
                        message: 'Degree [' + degree + '] of component end [' + this.core.getPath(end) + '] is not a natural number or an arithmetic expression of cardinality parameters'
                    });
            }
        }
        return violations;
    };
    return JavaBIPEngine;
});
