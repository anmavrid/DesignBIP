/*jshint node: true*/
/**
 * @author pmeijer / https://github.com/pmeijer
 */

module.exports = {
    CodeEditor: {
        theme: 'default',
        keyBinding: 'sublime',
        autoSaveInterval: '2000',
        defaultSyntax: 'Java',
        syntaxToModeMap: {
            Java: {
                name: 'text/x-java'
            }
        },
        attrToSyntaxMap: {
            EnforceableTransition: {
                transitionMethod: 'Java'
            },
            InternalTransition: {
                transitionMethod: 'Java'
            },
            SpontaneousTransition: {
                transitionMethod: 'Java'
            },
            Guard: {
                guardMethod: 'Java'
            },
            ComponentType: {
                constructors: 'Java',
                definitions: 'Java',
                forwards: 'Java'
            }
        }
    }
};
