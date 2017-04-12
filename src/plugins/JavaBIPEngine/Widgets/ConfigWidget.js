/*globals, define, $, WebGMEGlobal*/
/**
 * Example of custom plugin configuration. Typically a dialog would show up here.
 * @author pmeijer / https://github.com/pmeijer
 */

define(['js/Dialogs/PluginConfig/PluginConfigDialog'], function (PluginConfigDialog) {
    'use strict';

    function ConfigWidget(params) {
        this._client = params.client;
        this._logger = params.logger.fork('ConfigWidget');
        this.pluginConfigDialog = new PluginConfigDialog(params);
    }

    /**
     * Called by the InterpreterManager if pointed to by metadata.configWidget.
     * You can reuse the default config by including it from 'js/Dialogs/PluginConfig/PluginConfigDialog'.
     *
     * @param {object[]} globalConfigStructure - Array of global options descriptions (e.g. runOnServer, namespace)
     * @param {object} pluginMetadata - The metadata.json of the the plugin.
     * @param {object} prevPluginConfig - The config at the previous (could be stored) execution of the plugin.
     * @param {function} callback
     * @param {object|boolean} callback.globalConfig - Set to true to abort execution otherwise resolved global-config.
     * @param {object} callback.pluginConfig - Resolved plugin-config.
     * @param {boolean} callback.storeInUser - If true the pluginConfig will be stored in the user for upcoming execs.
     *
     */
    ConfigWidget.prototype.show = function (globalConfigStructure, pluginMetadata, prevPluginConfig, callback) {
        var pluginConfig = JSON.parse(JSON.stringify(prevPluginConfig)), // Make a copy of the prev config
            globalConfig = {},
            activeNodeId = WebGMEGlobal.State.getActiveObject(),
            activeNode;
        // // We use the default global config here..
        // globalConfigStructure.forEach(function (globalOption) {
        //     globalConfig[globalOption.name] = globalOption.value;
        // });
        //
        // if (typeof activeNodeId === 'string') {
        //     activeNode = this._client.getNode(activeNodeId);
        //     pluginConfig.activeNodeName = activeNode.getAttribute('name');
        // } else {
        //     this._logger.error('No active node...');
        //     callback(true); // abort execution
        //     return;
        // }
        //
        // callback(globalConfig, pluginConfig, false); // Set third argument to true to store config in user.
        this.pluginConfigDialog.show(globalConfigStructure, pluginMetadata, prevPluginConfig, function (newGlobal, newPluginConfig, store) {

            activeNode = this._client.getNode(activeNodeId);
            for (var child of this._client.getChildrenPaths(activeNode)) {
                if (this.isMetaTypeOf(this._client.getNode(child), this.META.ComponentType)) {
                    var cardinality = child.getAttribute('cardinality');
                    if (/^[a-z]$/.test(cardinality)) {
                        this.createMessage(newPluginConfig.value);
                        //pluginConfig.value
                    }
                }
            }

            callback(newGlobal, newPluginConfig, store);
        });
    };

    return ConfigWidget;
});
