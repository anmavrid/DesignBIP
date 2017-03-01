/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/ComponentTypeDecorator.DiagramDesignerWidget',
    './PartBrowser/ComponentTypeDecorator.PartBrowserWidget'
], function (DecoratorBase, ComponentTypeDecoratorDiagramDesignerWidget, ComponentTypeDecoratorPartBrowserWidget) {

    'use strict';

    var ComponentTypeDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'ComponentTypeDecorator';

    ComponentTypeDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('ComponentTypeDecorator ctor');
    };

    _.extend(ComponentTypeDecorator.prototype, __parent_proto__);
    ComponentTypeDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    ComponentTypeDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: ComponentTypeDecoratorDiagramDesignerWidget,
            PartBrowser: ComponentTypeDecoratorPartBrowserWidget
        };
    };

    return ComponentTypeDecorator;
});