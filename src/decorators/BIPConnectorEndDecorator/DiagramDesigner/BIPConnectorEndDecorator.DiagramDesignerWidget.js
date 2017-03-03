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

    BIPConnectorEndDecorator = function (options) {
        var opts = _.extend({}, options);

        DiagramDesignerWidgetDecoratorBase.apply(this, [opts]);
        BIPConnectorEndDecoratorCore.apply(this, [opts]);

        this.name = '';

        this.logger.debug('BIPConnectorEndDecorator ctor');
    };

    _.extend(BIPConnectorEndDecorator.prototype, DiagramDesignerWidgetDecoratorBase.prototype);
    _.extend(BIPConnectorEndDecorator.prototype, BIPConnectorEndDecoratorCore.prototype);

    BIPConnectorEndDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    BIPConnectorEndDecorator.prototype.$DOMBase = $(BIPConnectorEndDecoratorTemplate);

    BIPConnectorEndDecorator.prototype.on_addTo = function () {
        var self = this;

        this._renderNameAndCardinality();

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
        DiagramDesignerWidgetDecoratorBase.prototype.on_addTo.apply(this, arguments);
    };

    BIPConnectorEndDecorator.prototype._renderNameAndCardinality = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            metaNode;

        //render GME-ID in the DOM, for debugging
        this.$el.attr({'data-id': this._metaInfo[CONSTANTS.GME_ID]});

        if (nodeObj) {
            this.name = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';
            metaNode = client.getNode(nodeObj.getMetaTypeId());
            if (metaNode) {
                this.metaTypeName = metaNode.getAttribute('name');
            }
        }

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');
        this.skinParts.$name.text(this.name);
        this.updateSvg();

        if (this.metaTypeName === 'Join') {
            this.$el.addClass('join');
        } else {
            this.$el.removeClass('join');
        }
    };

    BIPConnectorEndDecorator.prototype.update = function () {
        this.updateSvg();
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