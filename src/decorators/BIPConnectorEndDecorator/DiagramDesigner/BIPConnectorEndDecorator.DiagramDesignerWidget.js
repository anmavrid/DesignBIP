/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.DecoratorBase',
    '../Core/BIPConnectorEndDecorator.Core',
    'text!./BIPConnectorEndDecorator.DiagramDesignerWidget.html',
    'css!./BIPConnectorEndDecorator.DiagramDesignerWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             DiagramDesignerWidgetDecoratorBase,
             BIPConnectorEndDecoratorCore,
             BIPConnectorEndDecoratorTemplate) {

    'use strict';

    var BIPConnectorEndDecorator,
        DECORATOR_ID = 'BIPConnectorEndDecorator';

    nodePropertyNames = JSON.parse(JSON.stringify(nodePropertyNames));
    nodePropertyNames.Attributes.degree = 'Degree';
    nodePropertyNames.Attributes.multiplicity = 'Multiplicity';

    BIPConnectorEndDecorator = function (options) {
        var opts = _.extend({}, options);

        DiagramDesignerWidgetDecoratorBase.apply(this, [opts]);
        BIPConnectorEndDecoratorCore.apply(this, [opts]);

        this.name = '';
        this.skinParts.$nullConnector = null;

        this.logger.debug('BIPConnectorEndDecorator ctor');
    };

    _.extend(BIPConnectorEndDecorator.prototype, DiagramDesignerWidgetDecoratorBase.prototype);
    _.extend(BIPConnectorEndDecorator.prototype, BIPConnectorEndDecoratorCore.prototype);

    BIPConnectorEndDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    BIPConnectorEndDecorator.prototype.$DOMBase = $(BIPConnectorEndDecoratorTemplate);

    BIPConnectorEndDecorator.prototype.on_addTo = function (objDesc) {
        this.skinParts.$nullConnector = this.$el.find('.null-connector');
        this.skinParts.$name = this.$el.find('.name');

        this._render(objDesc || {});
        //let the parent decorator class do its job first
        DiagramDesignerWidgetDecoratorBase.prototype.on_addTo.apply(this, arguments);
    };

    BIPConnectorEndDecorator.prototype.update = function (objDesc) {
        this._render(objDesc || {});
    };

    BIPConnectorEndDecorator.prototype._render = function (objDesc) {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            hasConnectors = false,
            connections,
            metaNode;

        if (nodeObj) {
            this.name = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';
            metaNode = client.getNode(nodeObj.getMetaTypeId());
            if (metaNode) {
                this.metaTypeName = metaNode.getAttribute('name');
            }
        }

        this.skinParts.$name.text(this.name);
        this.skinParts.$nullConnector.removeClass('right left');
        this.$el.removeClass('join invalid-meta-type');

        switch (this.metaTypeName) {
            case 'Synchron':
            case 'Trigger':
                this.updateSvg({
                    multiplicity: nodeObj.getAttribute(nodePropertyNames.Attributes.multiplicity) || '?',
                    degree: nodeObj.getAttribute(nodePropertyNames.Attributes.degree) || '?'
                });

                if (typeof objDesc.relativeOrientation === 'string') {
                    // The connector end is associated with a componentType.

                    // Check if it is a null-connector.
                    connections = nodeObj.getCollectionPaths('src').concat(nodeObj.getCollectionPaths('dst'));
                    connections.forEach(function (connId) {
                        var connNode = client.getNode(connId),
                            connMetaNode;

                        if (connNode) {
                            connMetaNode = client.getNode(connNode.getMetaTypeId());
                            if (connMetaNode && connMetaNode.getAttribute('name') === 'Connector') {
                                // It has a connector and is not a null.
                                hasConnectors = true;
                            }
                        }
                    });

                    if (hasConnectors === false) {
                        this.skinParts.$nullConnector.addClass(objDesc.relativeOrientation);
                    }

                    if (this.metaTypeName === 'Trigger' && objDesc.relativeOrientation === 'left') {
                        this.skinParts.$svgContainer.addClass('show-left');
                        this.skinParts.$svgContainer.find('text').attr('x', '35');
                    }
                }
                break;
            case 'Join':
                this.$el.addClass('join');
                this.updateSvg();
                break;
            case 'ExportPort':
                this.updateSvg();
                break;
            default:
                this.updateSvg();
                this.$el.addClass('invalid-meta-type');
                break;
        }

        // console.log('In ConnEndDec', this.hostDesignerItem.positionX, this.hostDesignerItem.positionY);
    };

    BIPConnectorEndDecorator.prototype.getConnectionAreas = function (id /*, isEnd, connectionMetaInfo*/) {
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

    /**************** EDIT NODE TITLE ************************/

    BIPConnectorEndDecorator.prototype._onNodeTitleChanged = function (oldValue, newValue) {
        var client = this._control._client;

        client.setAttribute(this._metaInfo[CONSTANTS.GME_ID], nodePropertyNames.Attributes.name, newValue);
    };

    /**************** END OF - EDIT NODE TITLE ************************/

    BIPConnectorEndDecorator.prototype.doSearch = function (searchDesc) {
        var searchText = searchDesc.toString();
        if (this.name && this.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            return true;
        }

        return false;
    };

    return BIPConnectorEndDecorator;
});