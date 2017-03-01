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
    'text!./ComponentTypeDecorator.DiagramDesignerWidget.html',
    'css!./ComponentTypeDecorator.DiagramDesignerWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             DecoratorBase,
             PointerAndSetHelpers,
             GMEConcepts,
             ComponentTypeDecoratorTemplate) {

    'use strict';

    var ComponentTypeDecorator,
        DECORATOR_ID = 'ComponentTypeDecorator';

    ComponentTypeDecorator = function (options) {
        var opts = _.extend({}, options);

        DecoratorBase.apply(this, [opts]);

        this.name = '';

        this.logger.debug('ComponentTypeDecorator ctor');
    };

    _.extend(ComponentTypeDecorator.prototype, DecoratorBase.prototype);
    ComponentTypeDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBaseWithDragPointerHelpers MEMBERS **************************/

    ComponentTypeDecorator.prototype.$DOMBase = $(ComponentTypeDecoratorTemplate);

    ComponentTypeDecorator.prototype.on_addTo = function () {
        var self = this,
            ports;

        this._renderName();

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
        ports = this.listPorts();

        Object.keys(ports).forEach(function (id) {
            self.$el.append($('<div/>', {class: 'port', text: ports[id].name + ' :: ' + ports[id].n}));
        });
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

    ComponentTypeDecorator.prototype.update = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            newName = '';

        if (nodeObj) {
            newName = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';

            if (this.name !== newName) {
                this.name = newName;
                this.skinParts.$name.text(this.name);
            }
        }

        this.listPorts();
    };

    ComponentTypeDecorator.prototype.listPorts = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            childrenIds = nodeObj.getChildrenIds(),
            result = {};

        childrenIds.forEach(function (childId) {
            var childNode = client.getNode(childId);
            if (childNode) {
                if (GMEConcepts.isPort(childId)) {
                    console.log('Found port:', childNode.getAttribute('name'));
                    result[childId] = {
                        id: childId,
                        name: childNode.getAttribute('name'),
                        n: 0
                    };

                    childNode.getCollectionPaths('dst').forEach(function (connectionId) {
                        var connNode = client.getNode(connectionId);

                        if (connNode) {
                            console.log('Found Connection: ', connectionId, 'src:', connNode.getPointerId('src'));
                        } else {
                            console.warn('connection not available', connectionId);
                        }

                        result[childId].n += 1;
                    });
                }
            } else {
                console.warn('Child not available', childId);
            }
        });

        return result;
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

    return ComponentTypeDecorator;
});