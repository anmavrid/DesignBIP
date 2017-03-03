/*globals define, _, DEBUG, $*/
/*jshint browser: true*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */


define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/PartBrowser/PartBrowserWidget.DecoratorBase',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!../DiagramDesigner/BIPConnectorEndDecorator.DiagramDesignerWidget.html',
    'css!../DiagramDesigner/BIPConnectorEndDecorator.DiagramDesignerWidget.css',
    'css!./BIPConnectorEndDecorator.PartBrowserWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             PartBrowserWidgetDecoratorBase,
             DiagramDesignerWidgetConstants,
             BIPConnectorEndDecoratorDiagramDesignerWidgetTemplate) {

    'use strict';

    var BIPConnectorEndDecoratorPartBrowserWidget,
        DECORATOR_ID = 'BIPConnectorEndDecoratorPartBrowserWidget';

    BIPConnectorEndDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        PartBrowserWidgetDecoratorBase.apply(this, [opts]);

        this.logger.debug('BIPConnectorEndDecoratorPartBrowserWidget ctor');
    };

    _.extend(BIPConnectorEndDecoratorPartBrowserWidget.prototype, PartBrowserWidgetDecoratorBase.prototype);
    BIPConnectorEndDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    BIPConnectorEndDecoratorPartBrowserWidget.prototype.$DOMBase = (function () {
        var el = $(BIPConnectorEndDecoratorDiagramDesignerWidgetTemplate);
        //use the same HTML template as the BIPConnectorEndDecorator.DiagramDesignerWidget
        //but remove the connector DOM elements since they are not needed in the PartBrowser
        el.find('.' + DiagramDesignerWidgetConstants.CONNECTOR_CLASS).remove();
        return el;
    })();

    BIPConnectorEndDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        this.$el = this.$DOMBase.clone();

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');

        this._renderContent();
    };

    BIPConnectorEndDecoratorPartBrowserWidget.prototype.afterAppend = function () {
    };

    BIPConnectorEndDecoratorPartBrowserWidget.prototype._renderContent = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        //render GME-ID in the DOM, for debugging
        if (DEBUG) {
            this.$el.attr({'data-id': this._metaInfo[CONSTANTS.GME_ID]});
        }

        if (nodeObj) {
            this.skinParts.$name.text(nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '');
        }
    };

    BIPConnectorEndDecoratorPartBrowserWidget.prototype.update = function () {
        this._renderContent();
    };

    return BIPConnectorEndDecoratorPartBrowserWidget;
});