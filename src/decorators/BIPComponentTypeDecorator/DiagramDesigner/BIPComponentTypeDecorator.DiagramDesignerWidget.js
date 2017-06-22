/*globals define, _, $, console*/
/*jshint browser: true, camelcase: false*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Constants',
    'js/NodePropertyNames',
    '../Core/BIPComponentTypeDecorator.Core',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.DecoratorBase',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.DecoratorBaseWithDragPointerHelpers',
    'js/Utils/GMEConcepts',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!./BIPComponentTypeDecorator.DiagramDesignerWidget.html',
    'css!./BIPComponentTypeDecorator.DiagramDesignerWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             BIPComponentTypeDecoratorCore,
             DecoratorBase,
             PointerAndSetHelpers,
             GMEConcepts,
             DD_CONSTANTS,
             BIPComponentTypeDecoratorTemplate
) {

    'use strict';

    var BIPComponentTypeDecorator,
        DECORATOR_ID = 'BIPComponentTypeDecorator',
        DECORATOR_WIDTH = 164,
        PORTS_TOP_MARGIN = 47,
        COMPOUND_PORTS_TOP_MARGIN = 29,
        PORT_HEIGHT = 30,
        CONN_HEIGHT = 20,
        CONN_MARGIN = 5,
        PORT_MARGIN = 4,
        CONN_AREA_WIDTH = 15,
        CONN_END_WIDTH = 20,
        CONN_END_X_MARGIN = 1;

    nodePropertyNames = JSON.parse(JSON.stringify(nodePropertyNames));
    nodePropertyNames.Attributes.cardinality = 'cardinality';

    BIPComponentTypeDecorator = function (options) {
        var opts = _.extend({}, options);

        DecoratorBase.apply(this, [opts]);
        BIPComponentTypeDecoratorCore.apply(this, [opts]);

        this.name = '';
        this.cardinality = 'n';
        this.isCompound = false;
        this.portsInfo = {};
        this.registeredPorts = {};
        this.orderedPortsId = [];
        this.position = {
            x: 100,
            y: 100
        };

        this.skinParts.$name = this.$el.find('.name');
        this.skinParts.$cardinality = this.$el.find('.cardinality');
        this.skinParts.$portsLHS = this.$el.find('.lhs');
        this.skinParts.$portsRHS = this.$el.find('.rhs');

        this.logger.debug('BIPComponentTypeDecorator ctor');
    };

    _.extend(BIPComponentTypeDecorator.prototype, DecoratorBase.prototype);
    _.extend(BIPComponentTypeDecorator.prototype, BIPComponentTypeDecoratorCore.prototype);
    BIPComponentTypeDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBaseWithDragPointerHelpers MEMBERS **************************/

    BIPComponentTypeDecorator.prototype.$DOMBase = $(BIPComponentTypeDecoratorTemplate);

    BIPComponentTypeDecorator.prototype.on_addTo = function () {
        var self = this;

        this._renderOwnProperties();

        // set title editable on double-click
        this.skinParts.$name.on('dblclick.editOnDblClick', null, function (event) {
            if (self.hostDesignerItem.canvas.getIsReadOnlyMode() !== true) {
                $(this).editInPlace({
                    class: '',
                    onChange: function (oldValue, newValue) {
                        self._onNodeTitleChanged(oldValue, newValue);
                    }
                });

                event.stopPropagation();
                event.preventDefault();
            }
        });

        this.skinParts.$cardinality.on('dblclick.editOnDblClick', null, function (event) {
            if (self.hostDesignerItem.canvas.getIsReadOnlyMode() !== true) {
                $(this).editInPlace({
                    class: '',
                    onChange: function (oldValue, newValue) {
                        self._onCardinalityChanged(oldValue, newValue);
                    }
                });

                event.stopPropagation();
                event.preventDefault();
            }
        });

        this.skinParts.$cardinality.popover({
            delay: {
                show: 150,
                hide: 0
            },
            animation: false,
            trigger: 'hover',
            title: '',
            content: 'Cardinality: ' + this.cardinality
        });

        //let the parent decorator class do its job first
        DecoratorBase.prototype.on_addTo.apply(this, arguments);
        this._renderPorts();
    };

    BIPComponentTypeDecorator.prototype.update = function () {
        this._renderOwnProperties();

        // FIXME: This might be slow for larger models..
        this.skinParts.$portsLHS.empty();
        this.skinParts.$portsRHS.empty();

        this._renderPorts();
    };

    BIPComponentTypeDecorator.prototype._renderOwnProperties = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        //render GME-ID in the DOM, for debugging
        this.$el.attr({'data-id': this._metaInfo[CONSTANTS.GME_ID]});

        if (nodeObj) {
            this.name = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';
            this.cardinality = nodeObj.getAttribute(nodePropertyNames.Attributes.cardinality) || '';
            //this.position = nodeObj.getEditableRegistry('position');
            // Use hostDesignerItem's position instead.
            this.position.x = this.hostDesignerItem.positionX;
            this.position.y = this.hostDesignerItem.positionY;
            this.isCompound = this._isOfMetaTypeName(nodeObj.getMetaTypeId(), 'CompoundType');
        }

        //find name placeholder
        this.skinParts.$name.text(this.name);
        this.$el.removeClass('compound-type');

        if (this.isCompound) {
            this.$el.addClass('compound-type');
        }

        this.skinParts.$cardinality.text(this.cardinality);
        this._updateColors();
    };

    BIPComponentTypeDecorator.prototype._renderPorts = function () {
        var self = this;

        this._retrievePortsInfo();

        this.orderedPortsId.forEach(function (portId) {
            var info = self.portsInfo[portId],
                height = self.portsInfo[portId].position.height,

                portEl = $('<div/>', {
                    class: 'port',
                })
                    .css('height', height + PORT_MARGIN),

                connectorEl = $('<div/>', {
                    class: DD_CONSTANTS.CONNECTOR_CLASS + ' trans-connector',
                    text: self.portsInfo[portId].name
                }).attr({
                    id: portId,
                    'data-id': portId
                })
                    .css('height', height)
                    .css('font-weight', 'normal');

            portEl.append(connectorEl);

            self.portsInfo[portId].$el = portEl;

            if (info.position.x === 'left') {
                self.skinParts.$portsLHS.append(portEl);
            } else {
                self.skinParts.$portsRHS.append(portEl);
            }

            self.hostDesignerItem.registerConnectors(connectorEl, portId);

            // The port was not registered before
            if (self.registeredPorts.hasOwnProperty(portId) === false) {
                self.hostDesignerItem.registerSubcomponent(portId, {GME_ID: portId});
                self.registeredPorts[portId] = true;
            }
        });

        // Unregister removed ports
        Object.keys(self.registeredPorts).forEach(function (portId) {
            if (self.portsInfo.hasOwnProperty(portId) === false) {
                self.hostDesignerItem.unregisterSubcomponent(portId);
            }
        });
    };

    BIPComponentTypeDecorator.prototype._retrievePortsInfo = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            childrenIds = nodeObj.getChildrenIds();

        this.portsInfo = {};

        childrenIds.forEach(function (enfTransId) {
            var enfTransNode = client.getNode(enfTransId);
            if (enfTransNode) {
                if (GMEConcepts.isPort(enfTransId) &&
                    self._isOfMetaTypeName(enfTransNode.getMetaTypeId(), ['EnforceableTransition', 'ExportPort'])) {

                    //console.log('Found EnforceableTransition:', enfTransNode.getAttribute('name'));

                    self.portsInfo[enfTransId] = {
                        id: enfTransId,
                        name: enfTransNode.getAttribute('name'),
                        position: {
                            x: 'left',
                            y: 0,
                            height: 0
                        },
                        connArea: {
                            x1: 0,
                            x2: 0,
                            y1: 0,
                            y2: 0
                        },
                        $el: null,
                        connEnds: {}
                    };

                    enfTransNode.getCollectionPaths('dst').forEach(function (connectionId) {
                        var connNode = client.getNode(connectionId),
                            connEndNode;

                        if (connNode && connNode.getPointerId('src')) {
                            connEndNode = client.getNode(connNode.getPointerId('src'));
                            if (self._isOfMetaTypeName(connEndNode.getMetaTypeId(), 'ConnectorEnd') &&
                                connEndNode.getParentId() === nodeObj.getParentId()) {
                                self.portsInfo[enfTransId].connEnds[connEndNode.getId()] = {
                                    id: connEndNode.getId(),
                                    name: connEndNode.getAttribute('name'),
                                    pos: connEndNode.getEditableRegistry('position'),
                                    dispPos: connEndNode.getEditableRegistry('position')
                                };
                            }

                        } else {
                            console.warn('connection not available', connectionId);
                        }
                    });
                }
            } else {
                console.warn('Child not available', enfTransId);
            }
        });

        //console.log(JSON.stringify(this.portsInfo, null, 2));
        this._orderPortsInfoAndCalcPositions();
    };

    BIPComponentTypeDecorator.prototype._orderPortsInfoAndCalcPositions = function () {
        var self = this,
            portId,
            weightedPosX,
            weightedPosY,
            x,
            y,
            connEndId,
            relY,
            lhsOrdered = [],
            rhsOrdered = [];

        function yAxisSorter(a, b) {
            if (a.y === b.y) {
                return 0;
            } else if (a.y === null || a.y < b.y) {
                return -1;
            } else if (b.y === null || b.y < a.y) {
                return 1;
            }
        }

        function calcConnEndPositions(heightPortInfo) {
            var connEndIds,
                i;

            function connEndsSorter(id1, id2) {
                var a = self.portsInfo[portId].connEnds[id1].pos,
                    b = self.portsInfo[portId].connEnds[id2].pos;

                return yAxisSorter(a, b);
            }

            portId = heightPortInfo.id;
            self.orderedPortsId.push(portId);

            connEndIds = Object.keys(self.portsInfo[portId].connEnds);
            connEndIds.sort(connEndsSorter);

            self.portsInfo[portId].position.height = 0;
            if (connEndIds.length === 0) {
                relY += (PORT_HEIGHT + PORT_MARGIN);
                self.portsInfo[portId].position.height = PORT_HEIGHT;
            } else {
                for (i = 0; i < connEndIds.length; i += 1) {

                    connEndId = connEndIds[i];
                    self.portsInfo[portId].connEnds[connEndId].dispPos.y = relY + self.position.y;
                    if (self.portsInfo[portId].position.x === 'left') {
                        self.portsInfo[portId].connEnds[connEndId].dispPos.x =
                            self.position.x - CONN_END_WIDTH - CONN_END_X_MARGIN;
                    } else {
                        self.portsInfo[portId].connEnds[connEndId].dispPos.x =
                            self.position.x + DECORATOR_WIDTH + CONN_END_X_MARGIN;
                    }

                    relY += (CONN_HEIGHT + CONN_MARGIN);
                    self.portsInfo[portId].position.height += (CONN_HEIGHT + CONN_MARGIN);
                }

                relY += CONN_MARGIN + PORT_MARGIN;
                self.portsInfo[portId].position.height += CONN_MARGIN;
            }


            self.portsInfo[portId].connArea.y1 = relY - self.portsInfo[portId].position.height / 2 - CONN_AREA_WIDTH;
            self.portsInfo[portId].connArea.y2 = relY - self.portsInfo[portId].position.height / 2;
        }

        this.orderedPortsId = [];

        for (portId in this.portsInfo) {
            weightedPosX = null;
            weightedPosY = null;
            for (connEndId in this.portsInfo[portId].connEnds) {
                x = this.portsInfo[portId].connEnds[connEndId].pos.x;
                y = this.portsInfo[portId].connEnds[connEndId].pos.y;
                weightedPosX = typeof weightedPosX === 'number' ? Math.floor((weightedPosX + x) / 2) : x;
                weightedPosY = typeof weightedPosY === 'number' ? Math.floor((weightedPosY + y) / 2) : y;
            }

            if (typeof weightedPosX === 'number' && weightedPosX > this.position.x + DECORATOR_WIDTH / 2) {
                this.portsInfo[portId].position.x = 'right';
                rhsOrdered.push({
                    id: portId,
                    y: weightedPosY
                });

                this.portsInfo[portId].connArea.x1 = DECORATOR_WIDTH - CONN_AREA_WIDTH;
                this.portsInfo[portId].connArea.x2 = DECORATOR_WIDTH;
            } else {
                this.portsInfo[portId].position.x = 'left';
                lhsOrdered.push({
                    id: portId,
                    y: weightedPosY
                });

                this.portsInfo[portId].connArea.x1 = 0;
                this.portsInfo[portId].connArea.x2 = CONN_AREA_WIDTH;
            }
        }

        // Sort the ports based on y-position
        rhsOrdered.sort(yAxisSorter);
        lhsOrdered.sort(yAxisSorter);

        // Calculate the display-positions for the connector-ends.
        relY = PORTS_TOP_MARGIN;
        lhsOrdered.forEach(calcConnEndPositions);

        relY = PORTS_TOP_MARGIN;
        rhsOrdered.forEach(calcConnEndPositions);
    };

    BIPComponentTypeDecorator.prototype._onNodeTitleChanged = function (oldValue, newValue) {
        var client = this._control._client;

        client.setAttribute(this._metaInfo[CONSTANTS.GME_ID], nodePropertyNames.Attributes.name, newValue);
    };

    BIPComponentTypeDecorator.prototype._onCardinalityChanged = function (oldValue, newValue) {
        var client = this._control._client;

        client.setAttribute(this._metaInfo[CONSTANTS.GME_ID], nodePropertyNames.Attributes.cardinality, newValue);
    };

    BIPComponentTypeDecorator.prototype._isOfMetaTypeName = function (metaNodeId, metaTypeNames) {
        var metaNode = this._control._client.getNode(metaNodeId),
            baseId;

        metaTypeNames = metaTypeNames instanceof Array ? metaTypeNames : [metaTypeNames];

        while (metaNode) {
            if (metaTypeNames.indexOf(metaNode.getAttribute('name')) > -1) {
                return true;
            }

            baseId = metaNode.getBaseId();
            if (!baseId) {
                return false;
            }

            metaNode = this._control._client.getNode(baseId);
        }
    };

    // #### Public API functions
    /**
     * Called by the Visualizer when requesting the position of the connectorEnds.
     * @param portId
     * @param connectorEndId
     * @returns {*}
     */
    BIPComponentTypeDecorator.prototype.getConnectorEndPosition = function (portId, connectorEndId) {
        // console.log('From ComponentType:', this.portsInfo[portId].connEnds[connectorEndId].dispPos.x,
        //     this.portsInfo[portId].connEnds[connectorEndId].dispPos.y);
        if (this.portsInfo[portId] && this.portsInfo[portId].connEnds[connectorEndId]) {
            return {
                y: this.portsInfo[portId].connEnds[connectorEndId].dispPos.y,
                x: this.portsInfo[portId].connEnds[connectorEndId].dispPos.x,
                relativeOrientation: this.portsInfo[portId].position.x
            };
        }
    };

    BIPComponentTypeDecorator.prototype.doSearch = function (searchDesc) {
        var searchText = searchDesc.toString(),
            gmeId = (this._metaInfo && this._metaInfo[CONSTANTS.GME_ID]) || '';

        return (this.name && this.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
            (gmeId.indexOf(searchText) > -1);
    };

    // DiagramDesigner Decorator API

    BIPComponentTypeDecorator.prototype.getConnectionAreas = function (id /*, isEnd, connectionMetaInfo*/) {
        var result = [],
            edge = 10,
            LEN = 20;

        //by default return the bounding box edge's midpoints

        if (id === undefined || id === this.hostDesignerItem.id) {
            //NORTH
            result.push({
                id: '0',
                x1: edge,
                y1: 0,
                x2: this.hostDesignerItem.getWidth() - edge,
                y2: 0,
                angle1: 270,
                angle2: 270,
                len: LEN
            });

            //EAST
            result.push({
                id: '1',
                x1: this.hostDesignerItem.getWidth(),
                y1: edge,
                x2: this.hostDesignerItem.getWidth(),
                y2: this.hostDesignerItem.getHeight() - edge,
                angle1: 0,
                angle2: 0,
                len: LEN
            });

            //SOUTH
            result.push({
                id: '2',
                x1: edge,
                y1: this.hostDesignerItem.getHeight(),
                x2: this.hostDesignerItem.getWidth() - edge,
                y2: this.hostDesignerItem.getHeight(),
                angle1: 90,
                angle2: 90,
                len: LEN
            });

            //WEST
            result.push({
                id: '3',
                x1: 0,
                y1: edge,
                x2: 0,
                y2: this.hostDesignerItem.getHeight() - edge,
                angle1: 180,
                angle2: 180,
                len: LEN
            });
        } else if (this.portsInfo.hasOwnProperty(id)) {
            // Port connection area was asked for.
            result.push({
                id: this.orderedPortsId.indexOf(id),
                x1: this.portsInfo[id].connArea.x1,
                y1: this.portsInfo[id].connArea.y1,
                x2: this.portsInfo[id].connArea.x2,
                y2: this.portsInfo[id].connArea.y2,
                angle1: 0,
                angle2: 0,
                len: LEN
            });
        }

        return result;
    };

    BIPComponentTypeDecorator.prototype.getConnectorMetaInfo = function (/*id*/) {
        //console.log('getConnectorMetaInfo', id);
        return undefined;
    };

    BIPComponentTypeDecorator.prototype.getTerritoryQuery = function () {
        var territoryRule = {},
            gmeID = this._metaInfo[CONSTANTS.GME_ID],
            client = this._control._client,
            nodeObj =  client.getNode(gmeID),
            hasAspect = this._aspect && this._aspect !== CONSTANTS.ASPECT_ALL && nodeObj &&
                nodeObj.getValidAspectNames().indexOf(this._aspect) !== -1;

        if (hasAspect) {
            territoryRule[gmeID] = client.getAspectTerritoryPattern(gmeID, this._aspect);
            territoryRule[gmeID].children = 1;
        } else {
            territoryRule[gmeID] = {children: 1};
        }

        return territoryRule;
    };

    BIPComponentTypeDecorator.prototype.showSourceConnectors = function (/*params*/) {
    };

    BIPComponentTypeDecorator.prototype.hideSourceConnectors = function () {
    };

    BIPComponentTypeDecorator.prototype.showEndConnectors = function (params) {
        //console.log('showEndConnectors', params);
        var self = this;
        if (params) {
            params.connectors.forEach(function (portId) {
                self.portsInfo[portId].$el.find('.trans-connector').addClass('show-connectors');
            });
        }
    };

    BIPComponentTypeDecorator.prototype.hideEndConnectors = function () {
        var self = this;
        if (self.portsInfo) {
            Object.keys(self.portsInfo).forEach(function (portId) {
                self.portsInfo[portId].$el.find('.trans-connector').removeClass('show-connectors');
            });
        }
    };

    return BIPComponentTypeDecorator;
});
