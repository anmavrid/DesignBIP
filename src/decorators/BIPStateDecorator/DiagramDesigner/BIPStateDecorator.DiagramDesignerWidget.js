/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.DecoratorBase',
    '../Core/BIPStateDecorator.Core',
    'text!./BIPStateDecorator.DiagramDesignerWidget.html',
    'css!./BIPStateDecorator.DiagramDesignerWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             DiagramDesignerWidgetDecoratorBase,
             BIPStateDecoratorCore,
             BIPStateDecoratorTemplate) {

    'use strict';

    var BIPStateDecorator,
        DECORATOR_ID = 'BIPStateDecorator';

    BIPStateDecorator = function (options) {
        var opts = _.extend({}, options);

        DiagramDesignerWidgetDecoratorBase.apply(this, [opts]);
        BIPStateDecoratorCore.apply(this, [opts]);

        this.name = '';

        this.logger.debug('BIPStateDecorator ctor');
    };

    _.extend(BIPStateDecorator.prototype, DiagramDesignerWidgetDecoratorBase.prototype);
    _.extend(BIPStateDecorator.prototype, BIPStateDecoratorCore.prototype);
    BIPStateDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    BIPStateDecorator.prototype.$DOMBase = $(BIPStateDecoratorTemplate);

    BIPStateDecorator.prototype.on_addTo = function () {

        this._render();

        DiagramDesignerWidgetDecoratorBase.prototype.on_addTo.apply(this, arguments);
    };

    BIPStateDecorator.prototype.update = function () {
        this._render();
    };

    BIPStateDecorator.prototype._render = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            metaNode;

        if (nodeObj) {
            this.name = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';
            metaNode = client.getNode(nodeObj.getMetaTypeId());
            if (metaNode) {
                this.metaTypeName = metaNode.getAttribute('name');
            }
        }

        this.updateSvg();
    };

    BIPStateDecorator.prototype.getConnectionAreas = function (id /*, isEnd, connectionMetaInfo*/) {
        var result = [],
            edge = 10,
            LEN = 20;

        // This is where the connections will be connected too. (Right click to see the green boxes).
        // TODO: Add more areas around the circle..
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

    BIPStateDecorator.prototype._onNodeTitleChanged = function (oldValue, newValue) {
        var client = this._control._client;

        client.setAttribute(this._metaInfo[CONSTANTS.GME_ID], nodePropertyNames.Attributes.name, newValue);
    };

    /**************** END OF - EDIT NODE TITLE ************************/

    BIPStateDecorator.prototype.doSearch = function (searchDesc) {
        var searchText = searchDesc.toString();
        if (this.name && this.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            return true;
        }

        return false;
    };

    return BIPStateDecorator;
});