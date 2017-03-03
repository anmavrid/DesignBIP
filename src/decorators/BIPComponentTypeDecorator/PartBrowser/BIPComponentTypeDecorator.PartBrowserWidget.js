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
    'text!../DiagramDesigner/BIPComponentTypeDecorator.DiagramDesignerWidget.html',
    'css!../DiagramDesigner/BIPComponentTypeDecorator.DiagramDesignerWidget.css',
    'css!./BIPComponentTypeDecorator.PartBrowserWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             PartBrowserWidgetDecoratorBase,
             DiagramDesignerWidgetConstants,
             BIPComponentTypeDecoratorDiagramDesignerWidgetTemplate) {

    'use strict';

    var BIPComponentTypeDecoratorPartBrowserWidget,
        DECORATOR_ID = 'BIPComponentTypeDecoratorPartBrowserWidget';

    BIPComponentTypeDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        PartBrowserWidgetDecoratorBase.apply(this, [opts]);

        this.logger.debug('BIPComponentTypeDecoratorPartBrowserWidget ctor');
    };

    _.extend(BIPComponentTypeDecoratorPartBrowserWidget.prototype, PartBrowserWidgetDecoratorBase.prototype);
    BIPComponentTypeDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    BIPComponentTypeDecoratorPartBrowserWidget.prototype.$DOMBase = (function () {
        var el = $(BIPComponentTypeDecoratorDiagramDesignerWidgetTemplate);
        //use the same HTML template as the BIPComponentTypeDecorator.DiagramDesignerWidget
        //but remove the connector DOM elements since they are not needed in the PartBrowser
        el.find('.' + DiagramDesignerWidgetConstants.CONNECTOR_CLASS).remove();
        return el;
    })();

    BIPComponentTypeDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        this.$el = this.$DOMBase.clone();

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');

        this._renderContent();
    };

    BIPComponentTypeDecoratorPartBrowserWidget.prototype.afterAppend = function () {
    };

    BIPComponentTypeDecoratorPartBrowserWidget.prototype._renderContent = function () {
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

    BIPComponentTypeDecoratorPartBrowserWidget.prototype.update = function () {
        this._renderContent();
    };

    return BIPComponentTypeDecoratorPartBrowserWidget;
});