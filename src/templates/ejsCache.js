/**
 * @author kecso / https://github.com/kecso
 */
define([
    'text!./cTypeClassInitializations.ejs',
    'text!./cTypeClassStart.ejs',
    'text!./cTypeConstantImports.ejs',
    'text!./cTypeGuards.ejs',
    'text!./cTypePortsAnnotations.ejs',
    'text!./cTypeSingleGuard.ejs',
    'text!./cTypeSingleGuardAnnotation.ejs',
    'text!./cTypeSingleTransaction.ejs',
    'text!./cTypeSingleTransactionAnnotation.ejs',
    'text!./cTypeTransactions.ejs',
    'text!./cTypeUserConstructors.ejs',
    'text!./cTypeUserDefinitions.ejs',
    'text!./cTypeUserImports.ejs',
], function (classInitializations,
             classStart,
             constantImports,
             guards,
             portsAnnotations,
             singleGuard,
             singleGuardAnnotation,
             singleTransaction,
             singleTransactionAnnotation,
             transactions,
             userConstructors,
             userDefinitions,
             userImports) {
    return {
        classInitializations: classInitializations,
        classStart: classStart,
        constantImports: constantImports,
        guards: guards,
        portsAnnotations: portsAnnotations,
        singleGuard: singleGuard,
        singleGuardAnnotation: singleGuardAnnotation,
        singleTransaction: singleTransaction,
        singleTransactionAnnotation: singleTransactionAnnotation,
        transactions: transactions,
        userConstructors: userConstructors,
        userDefinitions: userDefinitions,
        userImports: userImports
    };
});