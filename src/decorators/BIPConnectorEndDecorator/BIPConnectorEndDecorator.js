/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/BIPConnectorEndDecorator.DiagramDesignerWidget',
    './PartBrowser/BIPConnectorEndDecorator.PartBrowserWidget'
], function (DecoratorBase, BIPConnectorEndDecoratorDiagramDesignerWidget, BIPConnectorEndDecoratorPartBrowserWidget) {

    'use strict';

    var BIPConnectorEndDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'BIPConnectorEndDecorator';

    BIPConnectorEndDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('BIPConnectorEndDecorator ctor');
    };

    _.extend(BIPConnectorEndDecorator.prototype, __parent_proto__);
    BIPConnectorEndDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    BIPConnectorEndDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: BIPConnectorEndDecoratorDiagramDesignerWidget,
            PartBrowser: BIPConnectorEndDecoratorPartBrowserWidget
        };
    };

    return BIPConnectorEndDecorator;
});