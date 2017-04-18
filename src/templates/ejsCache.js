/**
 * @author kecso / https://github.com/kecso
 */
define([
    'common/util/ejs',
    'text!./cTypeClassInitializations.ejs',
    'text!./cTypeClassStart.ejs',
    'text!./cTypeClassEnd.ejs',
    'text!./cTypeConstantImports.ejs',
    'text!./cTypeGuards.ejs',
    'text!./cTypePortsAnnotations.ejs',
    'text!./cTypeSingleGuard.ejs',
    'text!./cTypeSingleGuardAnnotation.ejs',
    'text!./cTypeSingleTransition.ejs',
    'text!./cTypeSingleTransitionAnnotation.ejs',
    'text!./cTypeTransitions.ejs',
    'text!./cTypeUserConstructors.ejs',
    'text!./cTypeUserDefinitions.ejs',
    'text!./cTypeUserImports.ejs',
    'text!./cTypeComplete.ejs',
    'text!./guardExpression.ejs'
], function (ejs,
             classInitializations,
             classStart,
             classEnd,
             constantImports,
             guards,
             portsAnnotations,
             singleGuard,
             singleGuardAnnotation,
             singleTransition,
             singleTransitionAnnotation,
             transitions,
             userConstructors,
             userDefinitions,
             userImports,
             complete,
             guardExpression) {

    return {
        componentType: {
            classInitializations: classInitializations,
            classStart: classStart,
            classEnd: classEnd,
            constantImports: constantImports,
            guards: guards,
            portsAnnotations: portsAnnotations,
            singleGuard: singleGuard,
            singleGuardAnnotation: singleGuardAnnotation,
            singleTransition: singleTransition,
            singleTransitionAnnotation: singleTransitionAnnotation,
            transitions: transitions,
            userConstructors: userConstructors,
            userDefinitions: userDefinitions,
            userImports: userImports,
            complete: ejs.render(complete, {
                classInitializations: classInitializations,
                classStart: classStart,
                classEnd: classEnd,
                constantImports: constantImports,
                guards: guards,
                portsAnnotations: portsAnnotations,
                transitions: transitions,
                userConstructors: userConstructors,
                userDefinitions: userDefinitions,
                userImports: userImports
            })
        },
        guardExpression: guardExpression
    };
});