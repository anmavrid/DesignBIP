/*globals define, _, $*/
/*jshint browser: true*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */


define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/PartBrowser/PartBrowserWidget.DecoratorBase',
    '../Core/BIPStateDecorator.Core',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!../DiagramDesigner/BIPStateDecorator.DiagramDesignerWidget.html',
    'css!../DiagramDesigner/BIPStateDecorator.DiagramDesignerWidget.css',
    'css!./BIPStateDecorator.PartBrowserWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             PartBrowserWidgetDecoratorBase,
             BIPStateDecoratorCore,
             DiagramDesignerWidgetConstants,
             BIPStateDecoratorDiagramDesignerWidgetTemplate) {

    'use strict';

    var BIPStateDecoratorPartBrowserWidget,
        __parent__ = PartBrowserWidgetDecoratorBase,
        DECORATOR_ID = 'BIPStateDecoratorPartBrowserWidget';

    BIPStateDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        PartBrowserWidgetDecoratorBase.apply(this, [opts]);
        BIPStateDecoratorCore.apply(this, [opts]);

        this.logger.debug('BIPStateDecoratorPartBrowserWidget ctor');
    };

    _.extend(BIPStateDecoratorPartBrowserWidget.prototype, __parent__.prototype);
    _.extend(BIPStateDecoratorPartBrowserWidget.prototype, BIPStateDecoratorCore.prototype);
    BIPStateDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    BIPStateDecoratorPartBrowserWidget.prototype.$DOMBase = (function () {
        var el = $(BIPStateDecoratorDiagramDesignerWidgetTemplate);
        //use the same HTML template as the BIPStateDecorator.DiagramDesignerWidget
        //but remove the connector DOM elements since they are not needed in the PartBrowser
        el.find('.' + DiagramDesignerWidgetConstants.CONNECTOR_CLASS).remove();
        return el;
    })();

    BIPStateDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        this.$el = this.$DOMBase.clone();

        this._renderContent();
    };

    BIPStateDecoratorPartBrowserWidget.prototype.afterAppend = function () {
    };

    BIPStateDecoratorPartBrowserWidget.prototype._renderContent = function () {
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

    BIPStateDecoratorPartBrowserWidget.prototype.update = function () {
        this._renderContent();
    };

    return BIPStateDecoratorPartBrowserWidget;
});