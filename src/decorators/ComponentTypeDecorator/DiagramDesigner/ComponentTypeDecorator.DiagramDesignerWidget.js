/*globals define, _, $, console*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.DecoratorBase',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.DecoratorBaseWithDragPointerHelpers',
    'js/Utils/GMEConcepts',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!./ComponentTypeDecorator.DiagramDesignerWidget.html',
    'css!./ComponentTypeDecorator.DiagramDesignerWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             DecoratorBase,
             PointerAndSetHelpers,
             GMEConcepts,
             DD_CONSTANTS,
             ComponentTypeDecoratorTemplate) {

    'use strict';

    var ComponentTypeDecorator,
        DECORATOR_ID = 'ComponentTypeDecorator',
        DECORATOR_WIDTH = 164,
        PORTS_TOP_MARGIN = 10,
        PORT_HEIGHT = 50,
        MULTI_PORT_HEIGHT = 10,
        CONN_END_WIDTH = 20,
        CONN_END_SPACE = 20;

    ComponentTypeDecorator = function (options) {
        var opts = _.extend({}, options);

        DecoratorBase.apply(this, [opts]);

        this.name = '';
        this.portsInfo = {};
        this.orderedPortsId = [];
        this.position = {
            x: 100,
            y: 100
        };

        this.skinParts.$portsLHS = this.$el.find('.lhs');
        this.skinParts.$portsRHS = this.$el.find('.rhs');

        this.logger.debug('ComponentTypeDecorator ctor');
    };

    _.extend(ComponentTypeDecorator.prototype, DecoratorBase.prototype);
    ComponentTypeDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBaseWithDragPointerHelpers MEMBERS **************************/

    ComponentTypeDecorator.prototype.$DOMBase = $(ComponentTypeDecoratorTemplate);

    ComponentTypeDecorator.prototype.on_addTo = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        this._renderName();
        if (nodeObj) {
            this.position = nodeObj.getRegistry('position');
        }

        // set title editable on double-click
        this.skinParts.$name.on('dblclick.editOnDblClick', null, function (event) {
            if (self.hostDesignerItem.canvas.getIsReadOnlyMode() !== true) {
                $(this).editInPlace({
                    class: '',
                    onChange: function (oldValue, newValue) {
                        self._onNodeTitleChanged(oldValue, newValue);
                    }
                });
            }
            event.stopPropagation();
            event.preventDefault();
        });

        //let the parent decorator class do its job first
        DecoratorBase.prototype.on_addTo.apply(this, arguments);
        this.addPortsInfo();
        this._renderPorts();
    };

    ComponentTypeDecorator.prototype._renderName = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        //render GME-ID in the DOM, for debugging
        this.$el.attr({'data-id': this._metaInfo[CONSTANTS.GME_ID]});

        if (nodeObj) {
            this.name = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';
        }

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');
        this.skinParts.$name.text(this.name);
    };

    ComponentTypeDecorator.prototype._renderPorts = function () {
        var self = this;

        this.orderedPortsId.forEach(function (id) {
            var info = self.portsInfo[id],
                portEl = $('<div/>', {
                    class: 'port',
                    text: self.portsInfo[id].name
                });

            portEl.css('height', function () {
                var n = Object.keys(info.connEnds).length;
                if (n === 0) {
                    return PORT_HEIGHT;
                } else {
                    return PORT_HEIGHT * n;
                }
            });

            portEl.append($('<div/>', {
                class: DD_CONSTANTS.CONNECTOR_CLASS + ' trans-connector'
            }));

            if (info.position.x === 'lhs') {
                self.skinParts.$portsLHS.append(portEl);
            } else {
                self.skinParts.$portsRHS.append(portEl);
            }
        });
    };

    ComponentTypeDecorator.prototype.update = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            newName = '';

        if (nodeObj) {
            newName = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';
            this.position = nodeObj.getRegistry('position');
            if (this.name !== newName) {
                this.name = newName;
                this.skinParts.$name.text(this.name);
            }
        }

        this.addPortsInfo();

        // FIXME: This might be slow for larger models..
        this.skinParts.$portsLHS.empty();
        this.skinParts.$portsRHS.empty();
        this._renderPorts();
    };

    ComponentTypeDecorator.prototype.addPortsInfo = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            childrenIds = nodeObj.getChildrenIds();

        this.portsInfo = {};

        childrenIds.forEach(function (enfTransId) {
            var enfTransNode = client.getNode(enfTransId);
            if (enfTransNode) {
                if (GMEConcepts.isPort(enfTransId) &&
                    self.isOfMetaTypeName(enfTransNode.getMetaTypeId(), 'EnforceableTransition')) {

                    //console.log('Found EnforceableTransition:', enfTransNode.getAttribute('name'));

                    self.portsInfo[enfTransId] = {
                        id: enfTransId,
                        name: enfTransNode.getAttribute('name'),
                        position: {
                            x: 'lhs',
                            y: 0
                        },
                        connEnds: {}
                    };

                    enfTransNode.getCollectionPaths('dst').forEach(function (connectionId) {
                        var connNode = client.getNode(connectionId),
                            connEndNode;

                        if (connNode && connNode.getPointerId('src')) {
                            connEndNode = client.getNode(connNode.getPointerId('src'));
                            if (self.isOfMetaTypeName(connEndNode.getMetaTypeId(), 'ConnectorEnd')) {
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

    ComponentTypeDecorator.prototype._orderPortsInfoAndCalcPositions = function () {
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

        function sorter(a, b) {
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

            portId = heightPortInfo.id;
            self.orderedPortsId.push(portId);

            connEndIds = Object.keys(self.portsInfo[portId].connEnds);

            for (i = 0; i < connEndIds.length; i += 1) {
                connEndId = connEndIds[i];
                self.portsInfo[portId].connEnds[connEndId].dispPos.y = relY + self.position.y;
                if (self.portsInfo[portId].position.x === 'lhs') {
                    self.portsInfo[portId].connEnds[connEndId].dispPos.x =
                        self.position.x - CONN_END_SPACE - CONN_END_WIDTH;
                } else {
                    self.portsInfo[portId].connEnds[connEndId].dispPos.x =
                        self.position.x + DECORATOR_WIDTH + CONN_END_SPACE;
                }

                relY += PORT_HEIGHT;
            }

            if (connEndIds.length === 0) {
                relY += PORT_HEIGHT;
            }
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
                this.portsInfo[portId].position.x = 'rhs';
                rhsOrdered.push({
                    id: portId,
                    y: weightedPosY
                });
            } else {
                this.portsInfo[portId].position.x = 'lhs';
                lhsOrdered.push({
                    id: portId,
                    y: weightedPosY
                });
            }
        }

        // Sort the ports based on y-position
        rhsOrdered.sort(sorter);
        lhsOrdered.sort(sorter);

        // Calculate the display-positions for the connector-ends.
        relY = PORTS_TOP_MARGIN;
        lhsOrdered.forEach(calcConnEndPositions);

        relY = PORTS_TOP_MARGIN;
        rhsOrdered.forEach(calcConnEndPositions);
    };

    ComponentTypeDecorator.prototype.getConnectionAreas = function (id /*, isEnd, connectionMetaInfo*/) {
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
        }

        return result;
    };

    ComponentTypeDecorator.prototype._onNodeTitleChanged = function (oldValue, newValue) {
        var client = this._control._client;

        client.setAttribute(this._metaInfo[CONSTANTS.GME_ID], nodePropertyNames.Attributes.name, newValue);
    };

    ComponentTypeDecorator.prototype.doSearch = function (searchDesc) {
        var searchText = searchDesc.toString(),
            gmeId = (this._metaInfo && this._metaInfo[CONSTANTS.GME_ID]) || '';

        return (this.name && this.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
            (gmeId.indexOf(searchText) > -1);
    };

    /**
     * Helper methods to figure out meta-type.
     * @param metaNodeId
     * @param metaTypeName
     * @returns {boolean}
     */
    ComponentTypeDecorator.prototype.isOfMetaTypeName = function (metaNodeId, metaTypeName) {
        var metaNode = this._control._client.getNode(metaNodeId),
            baseId;

        while (metaNode) {
            if (metaNode.getAttribute('name') === metaTypeName) {
                return true;
            }

            baseId = metaNode.getBaseId();
            if (!baseId) {
                return false;
            }

            metaNode = this._control._client.getNode(baseId);
        }
    };

    /**
     * Called by the Visualizer when requesting the position of the connectorEnds.
     * @param portId
     * @param connectorEndId
     * @returns {*}
     */
    ComponentTypeDecorator.prototype.getConnectorEndPosition = function (portId, connectorEndId) {
        //console.log('Requested:', this.portsInfo[portId].connEnds[connectorEndId]);
        if (this.portsInfo[portId] && this.portsInfo[portId].connEnds[connectorEndId]) {
            return this.portsInfo[portId].connEnds[connectorEndId].dispPos;
        }
    };

    ComponentTypeDecorator.prototype.getConnectionAreas = function (id, isEnd, connectionMetaInfo) {
        var result = [];

        //by default return the center point of the item
        //canvas will draw the connection to / from this coordinate
        result.push({
            id: '0',
            x1: this.hostDesignerItem.getWidth() / 2,
            y1: this.hostDesignerItem.getHeight() / 2,
            x2: this.hostDesignerItem.getWidth() / 2,
            y2: this.hostDesignerItem.getHeight() / 2,
            angle1: 270,
            angle2: 270,
            len: 10
        });

        console.log('getConnectionAreas', id, isEnd, connectionMetaInfo);

        return result;
    };

    ComponentTypeDecorator.prototype.getConnectorMetaInfo = function (id) {
        console.log('getConnectorMetaInfo', id);
        return undefined;
    };

    return ComponentTypeDecorator;
});