/*globals define, _, DEBUG, $*/
/*jshint browser: true*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'text!./svgs/export-port.svg',
    'text!./svgs/join.svg',
    'text!./svgs/synchron.svg',
    'text!./svgs/trigger.svg'
], function (EXPORT_PORT_SVG,
             JOIN_SVG,
             SYNCHRON_SVG,
             TRIGGER_SVG) {

    'use strict';
    var META_TO_TEMPLATE = {
        ExportPort: EXPORT_PORT_SVG,
        Join: JOIN_SVG,
        Synchron: SYNCHRON_SVG,
        Trigger: TRIGGER_SVG
    };

    function BIPConnectorEndCore () {
        this.skinParts.$svg = null;
        this.skinParts.$svgContainer = null;
    }

    BIPConnectorEndCore.prototype.updateSvg = function (text) {
        var template = META_TO_TEMPLATE[this.metaTypeName] || EXPORT_PORT_SVG; // TODO: Make a fall back svg.

        this.skinParts.$svg = $(template);
        this.skinParts.$svgContainer = this.$el.find('.svg-container');
        this.skinParts.$svgContainer.empty();
        this.skinParts.$svgContainer.append(this.skinParts.$svg);
    };

    return BIPConnectorEndCore;
});