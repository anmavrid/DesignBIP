/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/BIPStateDecorator.DiagramDesignerWidget',
    './PartBrowser/BIPStateDecorator.PartBrowserWidget'
], function (DecoratorBase, BIPStateDecoratorDiagramDesignerWidget, BIPStateDecoratorPartBrowserWidget) {

    'use strict';

    var BIPStateDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'BIPStateDecorator';

    BIPStateDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('BIPStateDecorator ctor');
    };

    _.extend(BIPStateDecorator.prototype, __parent_proto__);
    BIPStateDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    BIPStateDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: BIPStateDecoratorDiagramDesignerWidget,
            PartBrowser: BIPStateDecoratorPartBrowserWidget
        };
    };

    return BIPStateDecorator;
});