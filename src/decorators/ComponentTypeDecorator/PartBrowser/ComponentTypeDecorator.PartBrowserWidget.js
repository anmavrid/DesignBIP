/*globals define, _, DEBUG, $*/
/*jshint browser: true*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */


define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/PartBrowser/PartBrowserWidget.DecoratorBase',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!../DiagramDesigner/ComponentTypeDecorator.DiagramDesignerWidget.html',
    'css!../DiagramDesigner/ComponentTypeDecorator.DiagramDesignerWidget.css',
    'css!./ComponentTypeDecorator.PartBrowserWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             PartBrowserWidgetDecoratorBase,
             DiagramDesignerWidgetConstants,
             ComponentTypeDecoratorDiagramDesignerWidgetTemplate) {

    'use strict';

    var ComponentTypeDecoratorPartBrowserWidget,
        DECORATOR_ID = 'ComponentTypeDecoratorPartBrowserWidget';

    ComponentTypeDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        PartBrowserWidgetDecoratorBase.apply(this, [opts]);

        this.logger.debug('ComponentTypeDecoratorPartBrowserWidget ctor');
    };

    _.extend(ComponentTypeDecoratorPartBrowserWidget.prototype, PartBrowserWidgetDecoratorBase.prototype);
    ComponentTypeDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    ComponentTypeDecoratorPartBrowserWidget.prototype.$DOMBase = (function () {
        var el = $(ComponentTypeDecoratorDiagramDesignerWidgetTemplate);
        //use the same HTML template as the ComponentTypeDecorator.DiagramDesignerWidget
        //but remove the connector DOM elements since they are not needed in the PartBrowser
        el.find('.' + DiagramDesignerWidgetConstants.CONNECTOR_CLASS).remove();
        return el;
    })();

    ComponentTypeDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        this.$el = this.$DOMBase.clone();

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');

        this._renderContent();
    };

    ComponentTypeDecoratorPartBrowserWidget.prototype.afterAppend = function () {
    };

    ComponentTypeDecoratorPartBrowserWidget.prototype._renderContent = function () {
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

    ComponentTypeDecoratorPartBrowserWidget.prototype.update = function () {
        this._renderContent();
    };

    return ComponentTypeDecoratorPartBrowserWidget;
});