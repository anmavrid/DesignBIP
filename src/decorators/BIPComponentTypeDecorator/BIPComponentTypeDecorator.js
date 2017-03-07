/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/BIPComponentTypeDecorator.DiagramDesignerWidget',
    './PartBrowser/BIPComponentTypeDecorator.PartBrowserWidget'
], function (DecoratorBase, BIPComponentTypeDecoratorDiagramDesignerWidget, BIPComponentTypeDecoratorPartBrowserWidget) {

    'use strict';

    var BIPComponentTypeDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'BIPComponentTypeDecorator';

    BIPComponentTypeDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('BIPComponentTypeDecorator ctor');
    };

    _.extend(BIPComponentTypeDecorator.prototype, __parent_proto__);
    BIPComponentTypeDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    BIPComponentTypeDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: BIPComponentTypeDecoratorDiagramDesignerWidget,
            PartBrowser: BIPComponentTypeDecoratorPartBrowserWidget
        };
    };

    return BIPComponentTypeDecorator;
});