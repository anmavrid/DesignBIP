/**
 * @author kecso / https://github.com/kecso
 */
define(['q'], function (Q) {

    function _getBasicModel(core, node) {
        return {
            name: core.getAttribute(node, 'name'),
            type: core.getAttribute(core.getMetaType(node), 'name'),
            path: core.getPath(node)
        };
    }

    function _basicModel2TransitionModel(core, node, path2Name, basicModel) {
        basicModel.src = path2Name[core.getPointerPath(node, 'src')];
        basicModel.dst = path2Name[core.getPointerPath(node, 'dst')];
        basicModel.guard = core.getAttribute(node, 'guardName');
        basicModel.transitionMethod = core.getAttribute(node, 'transitionMethod');
    }

    function _basicModel2GuardModel(core, node, basicModel) {
        basicModel.guardMethod = core.getAttribute(node, 'guardMethod');
    }

    function getModelOfComponentType(core, componenTypeNode) {
        var deferred = Q.defer(),
            model = {},
            nameBasedSort = function (nodeA, nodeB) {
                var nameA = core.getAttribute(nodeA, 'name'),
                    nameB = core.getAttribute(nodeB, 'name');
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                }
                return 0;
            };

        model.path = core.getPath(componenTypeNode);
        model.name = core.getAttribute(componenTypeNode, 'name');
        model.cardinality = core.getAttribute(componenTypeNode, 'cardinality');
        model.definitions = core.getAttribute(componenTypeNode, 'definitions');
        model.forwards = core.getAttribute(componenTypeNode, 'forwards');
        model.constructors = core.getAttribute(componenTypeNode, 'constructors');
        model.initial = '';
        model.transitions = [];
        model.states = [];
        model.guards = [];

        core.loadChildren(componenTypeNode)
            .then(function (children) {
                var i, childModel,
                    path2Name = {};

                children.sort(nameBasedSort);

                for (i = 0; i < children.length; i += 1) {
                    path2Name[core.getPath(children[i])] = core.getAttribute(children[i], 'name');
                }

                for (i = 0; i < children.length; i += 1) {
                    childModel = _getBasicModel(core, children[i]);
                    //TODO not the nicest way and not too change-resistant
                    switch (childModel.type) {
                        case 'EnforceableTransition':
                        case 'SpontaneousTransition':
                        case 'InternalTransition':
                            _basicModel2TransitionModel(core, children[i], path2Name, childModel);
                            model.transitions.push(childModel);
                            break;
                        case 'Guard':
                            _basicModel2GuardModel(core, children[i], childModel);
                            model.guards.push(childModel);
                            break;
                        case 'InitialState':
                            model.initial = childModel.name;
                        case 'State':
                            model.states.push(childModel);
                            break;
                    }
                }
                deferred.resolve(model);
            })
            .catch(deferred.reject);

        return deferred.promise;
    }

    return {
        getModelOfComponentType: getModelOfComponentType
    };
});