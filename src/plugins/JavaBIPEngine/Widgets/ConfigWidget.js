/*globals, define, $, WebGMEGlobal*/
/**
* Example of custom plugin configuration. Typically a dialog would show up here.
* @author pmeijer / https://github.com/pmeijer
*/

define(['js/Dialogs/PluginConfig/PluginConfigDialog'],
function (PluginConfigDialog) {
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
    var self = this,
    activeNodeId = WebGMEGlobal.State.getActiveObject(),
    core,
    cardinalities = [];

    self._client.getCoreInstance(null, function (err, result) {
        var childrenPaths, nextChildID,
            noParameters = true;

        var getParameters = function (err, child) {
            var metaNode = core.getMetaType(child),
                name = core.getAttribute(metaNode, 'name'),
                cardinality;
            if (name !== 'ComponentType'|| name !== 'CompoundType') {
                cardinality = core.getAttribute(child, 'cardinality');
                if (/^[a-z]$/.test(cardinality) && !cardinalities.includes(cardinality)) {
                    cardinalities.push(cardinality);
                    noParameters = false;
                    if (cardinalities.length>1) {
                        //create shallow copy of pluginMetadata.configStructure[0]
                        pluginMetadata.configStructure.push(Object.assign({}, pluginMetadata.configStructure[1]));
                        pluginMetadata.configStructure[cardinalities.length].displayName = cardinality;
                        pluginMetadata.configStructure[cardinalities.length].name = cardinality;
                    } else {
                        pluginMetadata.configStructure[1].displayName = cardinality;
                        pluginMetadata.configStructure[1].name = cardinality;
                    }
                }
            }
            nextChildID++;
            if (nextChildID < childrenPaths.length) {
                core.loadByPath(result.rootNode, childrenPaths[nextChildID], getParameters);
            } else {
                if (noParameters === true) {
                    pluginMetadata.configStructure.splice(1, 1);
                }
                self.pluginConfigDialog.show(globalConfigStructure, pluginMetadata, prevPluginConfig, function (newGlobal, newPluginConfig, store) {
                    //newPluginConfig = pluginMetadata.configStructure;
                    callback(newGlobal, newPluginConfig, store);
                });
                pluginMetadata.configStructure.splice(2, pluginMetadata.configStructure.length - 1);

            }
        };
        //TODO: Use the traverse function from core api instead
        core = result.core;
        core.loadByPath(result.rootNode, activeNodeId, function (err, node) {
            childrenPaths = core.getChildrenPaths(node);
            nextChildID = 0;
            core.loadByPath(result.rootNode, childrenPaths[nextChildID], getParameters);
        });
    });
};

return ConfigWidget;
});
