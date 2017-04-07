/*globals define, _, $*/
/*jshint browser: true*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */


// TODO: Make svgs for each type of state.
define([
    'text!./svgs/state.svg',
    'text!./svgs/state.svg'
], function (STATE_SVG,
             INIT_STATE_SVG) {

    'use strict';
    var META_TO_TEMPLATE = {
        State: STATE_SVG,
        InitState: INIT_STATE_SVG
    };

    function BIPStateDecoratorCore() {
        this.skinParts.$svg = null;
        this.skinParts.$svgContainer = null;
        this.prevMetaTypeName = null;
        this.metaTypeName = null;
    }

    BIPStateDecoratorCore.prototype.updateSvg = function () {
        var template = META_TO_TEMPLATE[this.metaTypeName] || STATE_SVG; // TODO: Make a fall back svg.

        if (this.prevMetaTypeName !== this.metaTypeName) {
            this.skinParts.$svgContainer = this.$el.find('.svg-container');
            this.skinParts.$svgContainer.empty();

            this.skinParts.$svg = $(template);
            this.skinParts.$name = this.skinParts.$svg.find('.name');
            this.skinParts.$svgContainer.append(this.skinParts.$svg);
        }

        if (this.name) {
            // TODO: Find the threshold and how to cut it when it exceeds.
            if (this.name.length < 8) {
                this.skinParts.$name.text(this.name);
            } else {
                this.skinParts.$name.text(this.name.substring(0, 5).concat('...'));

                //TODO: If we need to show a pop-over (for showing the full name or some other data).
                this.skinParts.$svgContainer.popover({
                    delay: {
                        show: 150,
                        hide: 0
                    },
                    animation: false,
                    trigger: 'hover',
                    content: this.name
                });

            }
        }

        // Store the current one as previous for next iteration.
        this.prevMetaTypeName = this.metaTypeName;

         // If state is InitialState then, the border color is red
        if (this.metaTypeName === "InitialState") {
            this.skinParts.$svg.find('circle').css('stroke', 'red');

        }

    };

    return BIPStateDecoratorCore;
});