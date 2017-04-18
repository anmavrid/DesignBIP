/**
 * @author kecso / https://github.com/kecso
 */
/**
 * The body of the code is borrowed from https://github.com/mazko/jsjavaparser
 * Version used: 0.0.2
 */
define([],function(){
    'use strict';
return new function() {
    function peg$subclass(child, parent) {
        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";

        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, peg$SyntaxError);
        }
    }

    peg$subclass(peg$SyntaxError, Error);

    peg$SyntaxError.buildMessage = function (expected, found) {
        var DESCRIBE_EXPECTATION_FNS = {
            literal: function (expectation) {
                return "\"" + literalEscape(expectation.text) + "\"";
            },

            "class": function (expectation) {
                var escapedParts = "",
                    i;

                for (i = 0; i < expectation.parts.length; i++) {
                    escapedParts += expectation.parts[i] instanceof Array
                        ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                        : classEscape(expectation.parts[i]);
                }

                return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
            },

            any: function (expectation) {
                return "any character";
            },

            end: function (expectation) {
                return "end of input";
            },

            other: function (expectation) {
                return expectation.description;
            }
        };

        function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        }

        function literalEscape(s) {
            return s
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\0/g, '\\0')
                .replace(/\t/g, '\\t')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/[\x00-\x0F]/g, function (ch) {
                    return '\\x0' + hex(ch);
                })
                .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
                    return '\\x' + hex(ch);
                });
        }

        function classEscape(s) {
            return s
                .replace(/\\/g, '\\\\')
                .replace(/\]/g, '\\]')
                .replace(/\^/g, '\\^')
                .replace(/-/g, '\\-')
                .replace(/\0/g, '\\0')
                .replace(/\t/g, '\\t')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/[\x00-\x0F]/g, function (ch) {
                    return '\\x0' + hex(ch);
                })
                .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
                    return '\\x' + hex(ch);
                });
        }

        function describeExpectation(expectation) {
            return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
        }

        function describeExpected(expected) {
            var descriptions = new Array(expected.length),
                i, j;

            for (i = 0; i < expected.length; i++) {
                descriptions[i] = describeExpectation(expected[i]);
            }

            descriptions.sort();

            if (descriptions.length > 0) {
                for (i = 1, j = 1; i < descriptions.length; i++) {
                    if (descriptions[i - 1] !== descriptions[i]) {
                        descriptions[j] = descriptions[i];
                        j++;
                    }
                }
                descriptions.length = j;
            }

            switch (descriptions.length) {
                case 1:
                    return descriptions[0];

                case 2:
                    return descriptions[0] + " or " + descriptions[1];

                default:
                    return descriptions.slice(0, -1).join(", ")
                        + ", or "
                        + descriptions[descriptions.length - 1];
            }
        }

        function describeFound(found) {
            return found ? "\"" + literalEscape(found) + "\"" : "end of input";
        }

        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };

    function peg$parse(input, options) {
        options = options !== void 0 ? options : {};

        var peg$FAILED = {},

            peg$startRuleFunctions = {CompilationUnit: peg$parseCompilationUnit},
            peg$startRuleFunction = peg$parseCompilationUnit,

            peg$c0 = function (pack, imports, types) {
                return {
                    node: 'CompilationUnit',
                    types: skipNulls(types),
                    package: pack,
                    imports: skipNulls(imports)
                };
            },
            peg$c1 = function (annot, name) {
                return {
                    node: 'PackageDeclaration',
                    name: name,
                    annotations: annot
                };
            },
            peg$c2 = function (stat, name, asterisk) {
                return {
                    node: 'ImportDeclaration',
                    name: name,
                    static: !!stat,
                    onDemand: !!extractOptional(asterisk, 1)
                };
            },
            peg$c3 = function () {
                return null;
            },
            peg$c4 = function (modifiers, type) {
                return mergeProps(type, {modifiers: modifiers});
            },
            peg$c5 = function (id, gen, ext, impl, body) {
                return {
                    node: 'TypeDeclaration',
                    name: id,
                    superInterfaceTypes: extractOptionalList(impl, 1),
                    superclassType: extractOptional(ext, 1),
                    bodyDeclarations: body,
                    typeParameters: optionalList(gen),
                    interface: false
                };
            },
            peg$c6 = function (decls) {
                return skipNulls(decls);
            },
            peg$c7 = function (modifier, body) {
                return {
                    node: 'Initializer',
                    body: body,
                    modifiers: modifier === null ? [] : [makeModifier('static')]
                };
            },
            peg$c8 = function (modifiers, member) {
                return mergeProps(member, {modifiers: modifiers});
            },
            peg$c9 = function (params, rest) {
                return mergeProps(rest, {
                    node: 'MethodDeclaration',
                    typeParameters: params
                });
            },
            peg$c10 = function (type, id, rest) {
                return mergeProps(rest, {
                    node: 'MethodDeclaration',
                    returnType2: type,
                    name: id,
                    typeParameters: []
                });
            },
            peg$c11 = function (type, decls) {
                return {
                    node: 'FieldDeclaration',
                    fragments: decls,
                    type: type
                };
            },
            peg$c12 = function (id, rest) {
                return mergeProps(rest, {
                    node: 'MethodDeclaration',
                    returnType2: makePrimitive('void'),
                    name: id,
                    constructor: false
                });
            },
            peg$c13 = function (id, rest) {
                return mergeProps(rest, {
                    node: 'MethodDeclaration',
                    name: id,
                    typeParameters: []
                });
            },
            peg$c14 = function () {
                return makePrimitive('void');
            },
            peg$c15 = function (type, id, rest) {
                return mergeProps(rest, {
                    returnType2: type,
                    name: id
                });
            },
            peg$c16 = function (id, rest) {
                return mergeProps(rest, {name: id});
            },
            peg$c17 = function (params, dims, throws) {
                return null;
            },
            peg$c18 = function (params, dims, throws, body) {
                return {
                    parameters: params,
                    thrownExceptions: extractThrowsClassType(extractOptionalList(throws, 1)),
                    extraDimensions: dims.length,
                    body: body,
                    constructor: false
                };
            },
            peg$c19 = function (params, throws) {
                return null;
            },
            peg$c20 = function (params, throws, body) {
                return {
                    parameters: params,
                    thrownExceptions: extractThrowsClassType(extractOptionalList(throws, 1)),
                    body: body,
                    extraDimensions: 0,
                    typeParameters: []
                };
            },
            peg$c21 = function (params, throws, body) {
                return {
                    parameters: params,
                    thrownExceptions: extractThrowsClassType(extractOptionalList(throws, 1)),
                    body: body,
                    returnType2: null,
                    constructor: true,
                    extraDimensions: 0
                };
            },
            peg$c22 = function (id, gen, ext, body) {
                return {
                    node: 'TypeDeclaration',
                    name: id,
                    superInterfaceTypes: extractOptionalList(ext, 1),
                    superclassType: null,
                    bodyDeclarations: body,
                    typeParameters: optionalList(gen),
                    interface: true
                };
            },
            peg$c23 = function (type, id, rest) {
                if (rest.node === 'FieldDeclaration') {
                    rest.fragments[0].name = id;
                    return mergeProps(rest, {type: type});
                } else {
                    return mergeProps(rest, {
                        returnType2: type,
                        name: id,
                        typeParameters: []
                    });
                }
            },
            peg$c24 = function (rest) {
                return {node: 'FieldDeclaration', fragments: rest};
            },
            peg$c25 = function (params, dims, throws) {
                return {
                    node: 'MethodDeclaration',
                    parameters: params,
                    thrownExceptions: extractThrowsClassType(extractOptionalList(throws, 1)),
                    extraDimensions: dims.length,
                    body: null,
                    constructor: false
                };
            },
            peg$c26 = function (params) {
                return makePrimitive('void');
            },
            peg$c27 = function (params, type, id, rest) {
                return mergeProps(rest, {
                    returnType2: type,
                    name: id,
                    typeParameters: params
                });
            },
            peg$c28 = function (params, throws) {
                return {
                    node: 'MethodDeclaration',
                    parameters: params,
                    thrownExceptions: extractThrowsClassType(extractOptionalList(throws, 1)),
                    returnType2: makePrimitive('void'),
                    extraDimensions: 0,
                    typeParameters: [],
                    body: null,
                    constructor: false
                };
            },
            peg$c29 = function (first, rest) {
                return buildList(first, rest, 1);
            },
            peg$c30 = function (dims, init) {
                return {
                    node: 'VariableDeclarationFragment',
                    extraDimensions: dims.length,
                    initializer: init
                };
            },
            peg$c31 = function (name, impl, eb) {
                return mergeProps(eb, {
                    node: 'EnumDeclaration',
                    name: name,
                    superInterfaceTypes: extractOptionalList(impl, 1)
                });
            },
            peg$c32 = function (consts, body) {
                return {
                    enumConstants: optionalList(consts),
                    bodyDeclarations: optionalList(body)
                };
            },
            peg$c33 = function (annot, name, args, cls) {
                return {
                    node: 'EnumConstantDeclaration',
                    anonymousClassDeclaration: cls === null ? null : {
                        node: 'AnonymousClassDeclaration',
                        bodyDeclarations: cls
                    },
                    arguments: optionalList(args),
                    modifiers: annot,
                    name: name
                };
            },
            peg$c34 = function (decl) {
                return decl;
            },
            peg$c35 = function () {
                return makeModifier('final');
            },
            peg$c36 = function (modifiers, type, decls) {
                return {
                    node: 'VariableDeclarationStatement',
                    fragments: decls,
                    modifiers: modifiers,
                    type: type
                };
            },
            peg$c37 = function (name, dims, init) {
                return {
                    node: 'VariableDeclarationFragment',
                    name: name,
                    extraDimensions: dims.length,
                    initializer: extractOptional(init, 1)
                };
            },
            peg$c38 = function (params) {
                return optionalList(params);
            },
            peg$c39 = function (modifiers, type, decl) {
                return mergeProps(decl, {
                    type: type,
                    modifiers: modifiers,
                    varargs: false,
                    initializer: null
                });
            },
            peg$c40 = function (modifiers, type, decl) {
                return mergeProps(decl, {
                    type: type,
                    modifiers: modifiers,
                    varargs: true,
                    initializer: null
                });
            },
            peg$c41 = function (first, rest, last) {
                return buildList(first, rest, 1).concat(extractOptionalList(last, 1));
            },
            peg$c42 = function (last) {
                return [last];
            },
            peg$c43 = function (id, dims) {
                return {
                    node: 'SingleVariableDeclaration',
                    name: id,
                    extraDimensions: dims.length
                };
            },
            peg$c44 = function (statements) {
                return {
                    node: 'Block',
                    statements: statements
                }
            },
            peg$c45 = function (modifiers, decl) {
                return {
                    node: 'TypeDeclarationStatement',
                    declaration: mergeProps(decl, {modifiers: modifiers})
                };
            },
            peg$c46 = function (expr, message) {
                return {
                    node: 'AssertStatement',
                    expression: expr,
                    message: extractOptional(message, 1)
                };
            },
            peg$c47 = function (expr, then, alt) {
                return {
                    node: 'IfStatement',
                    elseStatement: extractOptional(alt, 1),
                    thenStatement: then,
                    expression: expr.expression,
                };
            },
            peg$c48 = function (init, expr, up, body) {
                return {
                    node: 'ForStatement',
                    initializers: optionalList(init),
                    expression: expr,
                    updaters: optionalList(up),
                    body: body
                };
            },
            peg$c49 = function (param, expr, statement) {
                return {
                    node: 'EnhancedForStatement',
                    parameter: param,
                    expression: expr,
                    body: statement
                };
            },
            peg$c50 = function (expr, body) {
                return {
                    node: 'WhileStatement',
                    expression: expr.expression,
                    body: body
                };
            },
            peg$c51 = function (statement, expr) {
                return {
                    node: 'DoStatement',
                    expression: expr.expression,
                    body: statement
                };
            },
            peg$c52 = function (first, rest, body, cat, fin) {
                return mergeProps(makeCatchFinally(cat, fin), {
                    node: 'TryStatement',
                    body: body,
                    resources: buildList(first, rest, 1)
                });
            },
            peg$c53 = function (body, cat, fin) {
                return makeCatchFinally(cat, fin);
            },
            peg$c54 = function (body, fin) {
                return makeCatchFinally([], fin);
            },
            peg$c55 = function (body, rest) {
                return mergeProps(rest, {
                    node: 'TryStatement',
                    body: body,
                    resources: []
                });
            },
            peg$c56 = function (expr, cases) {
                return {node: 'SwitchStatement', statements: cases, expression: expr.expression};
            },
            peg$c57 = function (expr, body) {
                return {node: 'SynchronizedStatement', expression: expr.expression, body: body}
            },
            peg$c58 = function (expr) {
                return {node: 'ReturnStatement', expression: expr}
            },
            peg$c59 = function (expr) {
                return {node: 'ThrowStatement', expression: expr};
            },
            peg$c60 = function (id) {
                return {node: 'BreakStatement', label: id};
            },
            peg$c61 = function (id) {
                return {node: 'ContinueStatement', label: id};
            },
            peg$c62 = function () {
                return {node: 'EmptyStatement'};
            },
            peg$c63 = function (statement) {
                return statement;
            },
            peg$c64 = function (id, statement) {
                return {node: 'LabeledStatement', label: id, body: statement};
            },
            peg$c65 = function (modifiers, type, decl, expr) {
                var fragment = mergeProps(decl, {initializer: expr});
                fragment.node = 'VariableDeclarationFragment';
                return {
                    node: 'VariableDeclarationExpression',
                    modifiers: modifiers,
                    type: type,
                    fragments: [fragment]
                };
            },
            peg$c66 = function (modifiers, first, rest, decl, body) {
                return {
                    node: 'CatchClause',
                    body: body,
                    exception: mergeProps(decl, {
                        modifiers: modifiers,
                        initializer: null,
                        varargs: false,
                        type: rest.length ? {
                            node: 'UnionType',
                            types: buildList(first, rest, 1)
                        } : first
                    })
                };
            },
            peg$c67 = function (block) {
                return block;
            },
            peg$c68 = function (blocks) {
                return [].concat.apply([], blocks);
            },
            peg$c69 = function (expr, blocks) {
                return [{node: 'SwitchCase', expression: expr}].concat(blocks);
            },
            peg$c70 = function (expr) {
                return expr;
            },
            peg$c71 = function (modifiers, type, decls) {
                return [{
                    node: 'VariableDeclarationExpression',
                    modifiers: modifiers,
                    fragments: decls,
                    type: type
                }];
            },
            peg$c72 = function (first, rest) {
                return extractExpressions(buildList(first, rest, 1));
            },
            peg$c73 = function (expr) {
                switch (expr.node) {
                    case 'SuperConstructorInvocation':
                    case 'ConstructorInvocation':
                        return expr;
                    default:
                        return {
                            node: 'ExpressionStatement',
                            expression: expr
                        };
                }
            },
            peg$c74 = function (left, op, right) {
                return {
                    node: 'Assignment',
                    operator: op[0] /* remove ending spaces */,
                    leftHandSide: left,
                    rightHandSide: right
                };
            },
            peg$c75 = function (expr, then, alt) {
                return {
                    node: 'ConditionalExpression',
                    expression: expr,
                    thenExpression: then,
                    elseExpression: alt
                };
            },
            peg$c76 = function (first, rest) {
                return buildInfixExpr(first, rest);
            },
            peg$c77 = function (first, rest) {
                return buildTree(first, rest, function (result, element) {
                    return element[0][0] === 'instanceof' ? {
                        node: 'InstanceofExpression',
                        leftOperand: result,
                        rightOperand: element[1]
                    } : {
                        node: 'InfixExpression',
                        operator: element[0][0], // remove ending Spacing
                        leftOperand: result,
                        rightOperand: element[1]
                    };
                });
            },
            peg$c78 = function (operator, operand) {
                return operand.node === 'NumberLiteral' && operator === '-' &&
                (operand.token === '9223372036854775808L' ||
                operand.token === '9223372036854775808l' ||
                operand.token === '2147483648')
                    ? {node: 'NumberLiteral', token: text()}
                    : {
                        node: 'PrefixExpression',
                        operator: operator,
                        operand: operand
                    };
            },
            peg$c79 = function (expr) {
                return {
                    node: 'CastExpression',
                    type: expr[1],
                    expression: expr[3]
                };
            },
            peg$c80 = function (arg, sel, sels, operator) {
                return operator.length > 1 ? TODO(/* JLS7? */) : {
                    node: 'PostfixExpression',
                    operator: operator[0],
                    operand: buildSelectorTree(arg, sel, sels)
                };
            },
            peg$c81 = function (arg, sel, sels) {
                return buildSelectorTree(arg, sel, sels);
            },
            peg$c82 = function (arg, operator) {
                return operator.length > 1 ? TODO(/* JLS7? */) : {
                    node: 'PostfixExpression',
                    operator: operator[0],
                    operand: arg
                };
            },
            peg$c83 = function (args, args_r) {
                return {node: 'ConstructorInvocation', arguments: args_r, typeArguments: []};
            },
            peg$c84 = function (args, ret) {
                if (ret.typeArguments.length) return TODO(/* Ugly ! */);
                ret.typeArguments = args;
                return ret;
            },
            peg$c85 = function (args) {
                return args === null ? {
                    node: 'ThisExpression',
                    qualifier: null
                } : {
                    node: 'ConstructorInvocation',
                    arguments: args,
                    typeArguments: []
                };
            },
            peg$c86 = function (suffix) {
                return suffix.node === 'SuperConstructorInvocation'
                    ? suffix
                    : mergeProps(suffix, {qualifier: null});
            },
            peg$c87 = function (creator) {
                return creator;
            },
            peg$c88 = function (type, dims) {
                return {
                    node: 'TypeLiteral',
                    type: buildArrayTree(type, dims)
                };
            },
            peg$c89 = function () {
                return {
                    node: 'TypeLiteral',
                    type: makePrimitive('void')
                };
            },
            peg$c90 = function (qual, dims) {
                return {
                    node: 'TypeLiteral',
                    type: buildArrayTree(buildTypeName(qual, null, []), dims)
                };
            },
            peg$c91 = function (qual, expr) {
                return {node: 'ArrayAccess', array: qual, index: expr};
            },
            peg$c92 = function (qual, args) {
                return mergeProps(popQualified(qual), {
                    node: 'MethodInvocation',
                    arguments: args,
                    typeArguments: []
                });
            },
            peg$c93 = function (qual) {
                return {node: 'TypeLiteral', type: buildTypeName(qual, null, [])};
            },
            peg$c94 = function (qual, ret) {
                if (ret.expression) return TODO(/* Ugly ! */);
                ret.expression = qual;
                return ret;
            },
            peg$c95 = function (qual) {
                return {node: 'ThisExpression', qualifier: qual};
            },
            peg$c96 = function (qual, args) {
                return {
                    node: 'SuperConstructorInvocation',
                    arguments: args,
                    expression: qual,
                    typeArguments: []
                };
            },
            peg$c97 = function (qual, args, rest) {
                return mergeProps(rest, {expression: qual, typeArguments: optionalList(args)});
            },
            peg$c98 = function () {
                return [];
            },
            peg$c99 = function (suffix) {
                return suffix;
            },
            peg$c100 = function (id, args) {
                return {node: 'MethodInvocation', arguments: args, name: id, typeArguments: []};
            },
            peg$c101 = function (op) {
                return op[0];
                /* remove ending spaces */
            },
            peg$c102 = function (id) {
                return {node: 'FieldAccess', name: id};
            },
            peg$c103 = function (ret) {
                return ret;
            },
            peg$c104 = function () {
                return TODO(/* Any sample ? */);
            },
            peg$c105 = function (args, ret) {
                return mergeProps(ret, {typeArguments: optionalList(args)});
            },
            peg$c106 = function (expr) {
                return {node: 'ArrayAccess', index: expr};
            },
            peg$c107 = function (args) {
                return {
                    node: 'SuperConstructorInvocation',
                    arguments: args,
                    expression: null,
                    typeArguments: []
                };
            },
            peg$c108 = function (gen, id, args) {
                return args === null ? {
                    node: 'SuperFieldAccess',
                    name: id
                } : {
                    node: 'SuperMethodInvocation',
                    typeArguments: optionalList(gen),
                    name: id,
                    arguments: args
                };
            },
            peg$c109 = "byte",
            peg$c110 = peg$literalExpectation("byte", false),
            peg$c111 = "short",
            peg$c112 = peg$literalExpectation("short", false),
            peg$c113 = "char",
            peg$c114 = peg$literalExpectation("char", false),
            peg$c115 = "int",
            peg$c116 = peg$literalExpectation("int", false),
            peg$c117 = "long",
            peg$c118 = peg$literalExpectation("long", false),
            peg$c119 = "float",
            peg$c120 = peg$literalExpectation("float", false),
            peg$c121 = "double",
            peg$c122 = peg$literalExpectation("double", false),
            peg$c123 = "boolean",
            peg$c124 = peg$literalExpectation("boolean", false),
            peg$c125 = function (type) {
                return makePrimitive(type);
            },
            peg$c126 = function (args) {
                return optionalList(args);
            },
            peg$c127 = function (type, rest) {
                return {
                    node: 'ArrayCreation',
                    type: buildArrayTree(type, rest.extraDims),
                    initializer: rest.init,
                    dimensions: rest.dimms
                };
            },
            peg$c128 = function (args, type, rest) {
                return mergeProps(rest, {
                    node: 'ClassInstanceCreation',
                    type: type,
                    typeArguments: optionalList(args),
                    expression: null
                });
            },
            peg$c129 = function (qual, args, rest) {
                return buildTypeName(qual, args, rest);
            },
            peg$c130 = function (id, args, rest) {
                return mergeProps(rest, {
                    node: 'ClassInstanceCreation',
                    type: buildTypeName(id, args, [])
                });
            },
            peg$c131 = function (args, body) {
                return {
                    arguments: args,
                    anonymousClassDeclaration: body === null ? null : {
                        node: 'AnonymousClassDeclaration',
                        bodyDeclarations: body
                    }
                };
            },
            peg$c132 = function (dims, init) {
                return {extraDims: dims, init: init, dimms: []};
            },
            peg$c133 = function (dimexpr, dims) {
                return {extraDims: dimexpr.concat(dims), init: null, dimms: dimexpr};
            },
            peg$c134 = function (dim) {
                return {extraDims: [dim], init: null, dimms: []};
            },
            peg$c135 = function (init) {
                return {node: 'ArrayInitializer', expressions: optionalList(init)};
            },
            peg$c136 = function (expr) {
                return {node: 'ParenthesizedExpression', expression: expr};
            },
            peg$c137 = function (first, rest) {
                return buildQualified(first, rest, 1);
            },
            peg$c138 = function (exp) {
                return exp;
            },
            peg$c139 = function (type, dims) {
                return buildArrayTree(type, dims);
            },
            peg$c140 = function (bas, dims) {
                return buildArrayTree(bas, dims);
            },
            peg$c141 = function (cls, dims) {
                return buildArrayTree(cls, dims);
            },
            peg$c142 = function () {
                return true;
            },
            peg$c143 = function () {
                return false;
            },
            peg$c144 = function (rest) {
                return {
                    node: 'WildcardType',
                    upperBound: extractOptional(rest, 0, true),
                    bound: extractOptional(rest, 1)
                };
            },
            peg$c145 = function (id, bounds) {
                return {
                    node: 'TypeParameter',
                    name: id,
                    typeBounds: extractOptionalList(bounds, 1)
                }
            },
            peg$c146 = "public",
            peg$c147 = peg$literalExpectation("public", false),
            peg$c148 = "protected",
            peg$c149 = peg$literalExpectation("protected", false),
            peg$c150 = "private",
            peg$c151 = peg$literalExpectation("private", false),
            peg$c152 = "static",
            peg$c153 = peg$literalExpectation("static", false),
            peg$c154 = "abstract",
            peg$c155 = peg$literalExpectation("abstract", false),
            peg$c156 = "final",
            peg$c157 = peg$literalExpectation("final", false),
            peg$c158 = "native",
            peg$c159 = peg$literalExpectation("native", false),
            peg$c160 = "synchronized",
            peg$c161 = peg$literalExpectation("synchronized", false),
            peg$c162 = "transient",
            peg$c163 = peg$literalExpectation("transient", false),
            peg$c164 = "volatile",
            peg$c165 = peg$literalExpectation("volatile", false),
            peg$c166 = "strictfp",
            peg$c167 = peg$literalExpectation("strictfp", false),
            peg$c168 = function (keyword) {
                return makeModifier(keyword);
            },
            peg$c169 = function (id, body) {
                return {
                    node: 'AnnotationTypeDeclaration',
                    name: id,
                    bodyDeclarations: body
                };
            },
            peg$c170 = function (decl) {
                return skipNulls(decl);
            },
            peg$c171 = function (modifiers, rest) {
                return mergeProps(rest, {modifiers: modifiers});
            },
            peg$c172 = function (type, rest) {
                return mergeProps(rest, {type: type});
            },
            peg$c173 = function (id, def) {
                return {
                    node: 'AnnotationTypeMemberDeclaration',
                    name: id,
                    default: def
                };
            },
            peg$c174 = function (fragments) {
                return {node: 'FieldDeclaration', fragments: fragments};
            },
            peg$c175 = function (val) {
                return val;
            },
            peg$c176 = function (id, pairs) {
                return {
                    node: 'NormalAnnotation',
                    typeName: id,
                    values: optionalList(pairs)
                };
            },
            peg$c177 = function (id, value) {
                return {
                    node: 'SingleMemberAnnotation',
                    typeName: id,
                    value: value
                };
            },
            peg$c178 = function (id) {
                return {node: 'MarkerAnnotation', typeName: id};
            },
            peg$c179 = function (name, value) {
                return {
                    node: 'MemberValuePair',
                    name: name,
                    value: value
                };
            },
            peg$c180 = function (values) {
                return {node: 'ArrayInitializer', expressions: optionalList(values)};
            },
            peg$c181 = /^[ \t\r\n\f]/,
            peg$c182 = peg$classExpectation([" ", "\t", "\r", "\n", "\f"], false, false),
            peg$c183 = "/*",
            peg$c184 = peg$literalExpectation("/*", false),
            peg$c185 = "*/",
            peg$c186 = peg$literalExpectation("*/", false),
            peg$c187 = "//",
            peg$c188 = peg$literalExpectation("//", false),
            peg$c189 = /^[\r\n]/,
            peg$c190 = peg$classExpectation(["\r", "\n"], false, false),
            peg$c191 = function (first, rest) {
                return {identifier: first + rest, node: 'SimpleName'};
            },
            peg$c192 = /^[a-z]/,
            peg$c193 = peg$classExpectation([["a", "z"]], false, false),
            peg$c194 = /^[A-Z]/,
            peg$c195 = peg$classExpectation([["A", "Z"]], false, false),
            peg$c196 = /^[_$]/,
            peg$c197 = peg$classExpectation(["_", "$"], false, false),
            peg$c198 = /^[0-9]/,
            peg$c199 = peg$classExpectation([["0", "9"]], false, false),
            peg$c200 = "assert",
            peg$c201 = peg$literalExpectation("assert", false),
            peg$c202 = "break",
            peg$c203 = peg$literalExpectation("break", false),
            peg$c204 = "case",
            peg$c205 = peg$literalExpectation("case", false),
            peg$c206 = "catch",
            peg$c207 = peg$literalExpectation("catch", false),
            peg$c208 = "class",
            peg$c209 = peg$literalExpectation("class", false),
            peg$c210 = "const",
            peg$c211 = peg$literalExpectation("const", false),
            peg$c212 = "continue",
            peg$c213 = peg$literalExpectation("continue", false),
            peg$c214 = "default",
            peg$c215 = peg$literalExpectation("default", false),
            peg$c216 = "do",
            peg$c217 = peg$literalExpectation("do", false),
            peg$c218 = "else",
            peg$c219 = peg$literalExpectation("else", false),
            peg$c220 = "enum",
            peg$c221 = peg$literalExpectation("enum", false),
            peg$c222 = "extends",
            peg$c223 = peg$literalExpectation("extends", false),
            peg$c224 = "false",
            peg$c225 = peg$literalExpectation("false", false),
            peg$c226 = "finally",
            peg$c227 = peg$literalExpectation("finally", false),
            peg$c228 = "for",
            peg$c229 = peg$literalExpectation("for", false),
            peg$c230 = "goto",
            peg$c231 = peg$literalExpectation("goto", false),
            peg$c232 = "if",
            peg$c233 = peg$literalExpectation("if", false),
            peg$c234 = "implements",
            peg$c235 = peg$literalExpectation("implements", false),
            peg$c236 = "import",
            peg$c237 = peg$literalExpectation("import", false),
            peg$c238 = "interface",
            peg$c239 = peg$literalExpectation("interface", false),
            peg$c240 = "instanceof",
            peg$c241 = peg$literalExpectation("instanceof", false),
            peg$c242 = "new",
            peg$c243 = peg$literalExpectation("new", false),
            peg$c244 = "null",
            peg$c245 = peg$literalExpectation("null", false),
            peg$c246 = "package",
            peg$c247 = peg$literalExpectation("package", false),
            peg$c248 = "return",
            peg$c249 = peg$literalExpectation("return", false),
            peg$c250 = "super",
            peg$c251 = peg$literalExpectation("super", false),
            peg$c252 = "switch",
            peg$c253 = peg$literalExpectation("switch", false),
            peg$c254 = "this",
            peg$c255 = peg$literalExpectation("this", false),
            peg$c256 = "throws",
            peg$c257 = peg$literalExpectation("throws", false),
            peg$c258 = "throw",
            peg$c259 = peg$literalExpectation("throw", false),
            peg$c260 = "true",
            peg$c261 = peg$literalExpectation("true", false),
            peg$c262 = "try",
            peg$c263 = peg$literalExpectation("try", false),
            peg$c264 = "void",
            peg$c265 = peg$literalExpectation("void", false),
            peg$c266 = "while",
            peg$c267 = peg$literalExpectation("while", false),
            peg$c268 = function () {
                return {node: 'BooleanLiteral', booleanValue: true};
            },
            peg$c269 = function () {
                return {node: 'BooleanLiteral', booleanValue: false};
            },
            peg$c270 = function () {
                return {node: 'NullLiteral'};
            },
            peg$c271 = function (literal) {
                return literal;
            },
            peg$c272 = /^[lL]/,
            peg$c273 = peg$classExpectation(["l", "L"], false, false),
            peg$c274 = function () {
                return {node: 'NumberLiteral', token: text()};
            },
            peg$c275 = "0",
            peg$c276 = peg$literalExpectation("0", false),
            peg$c277 = /^[1-9]/,
            peg$c278 = peg$classExpectation([["1", "9"]], false, false),
            peg$c279 = /^[_]/,
            peg$c280 = peg$classExpectation(["_"], false, false),
            peg$c281 = "0x",
            peg$c282 = peg$literalExpectation("0x", false),
            peg$c283 = "0X",
            peg$c284 = peg$literalExpectation("0X", false),
            peg$c285 = "0b",
            peg$c286 = peg$literalExpectation("0b", false),
            peg$c287 = "0B",
            peg$c288 = peg$literalExpectation("0B", false),
            peg$c289 = /^[01]/,
            peg$c290 = peg$classExpectation(["0", "1"], false, false),
            peg$c291 = /^[0-7]/,
            peg$c292 = peg$classExpectation([["0", "7"]], false, false),
            peg$c293 = ".",
            peg$c294 = peg$literalExpectation(".", false),
            peg$c295 = /^[fFdD]/,
            peg$c296 = peg$classExpectation(["f", "F", "d", "D"], false, false),
            peg$c297 = /^[eE]/,
            peg$c298 = peg$classExpectation(["e", "E"], false, false),
            peg$c299 = /^[+\-]/,
            peg$c300 = peg$classExpectation(["+", "-"], false, false),
            peg$c301 = /^[pP]/,
            peg$c302 = peg$classExpectation(["p", "P"], false, false),
            peg$c303 = /^[a-f]/,
            peg$c304 = peg$classExpectation([["a", "f"]], false, false),
            peg$c305 = /^[A-F]/,
            peg$c306 = peg$classExpectation([["A", "F"]], false, false),
            peg$c307 = "'",
            peg$c308 = peg$literalExpectation("'", false),
            peg$c309 = /^['\\\n\r]/,
            peg$c310 = peg$classExpectation(["'", "\\", "\n", "\r"], false, false),
            peg$c311 = function () {
                return {node: 'CharacterLiteral', escapedValue: text()};
            },
            peg$c312 = "\"",
            peg$c313 = peg$literalExpectation("\"", false),
            peg$c314 = /^["\\\n\r]/,
            peg$c315 = peg$classExpectation(["\"", "\\", "\n", "\r"], false, false),
            peg$c316 = function () {
                return {node: 'StringLiteral', escapedValue: text()};
            },
            peg$c317 = "\\",
            peg$c318 = peg$literalExpectation("\\", false),
            peg$c319 = /^[btnfr"'\\]/,
            peg$c320 = peg$classExpectation(["b", "t", "n", "f", "r", "\"", "'", "\\"], false, false),
            peg$c321 = /^[0-3]/,
            peg$c322 = peg$classExpectation([["0", "3"]], false, false),
            peg$c323 = "u",
            peg$c324 = peg$literalExpectation("u", false),
            peg$c325 = "@",
            peg$c326 = peg$literalExpectation("@", false),
            peg$c327 = "&",
            peg$c328 = peg$literalExpectation("&", false),
            peg$c329 = /^[=&]/,
            peg$c330 = peg$classExpectation(["=", "&"], false, false),
            peg$c331 = "&&",
            peg$c332 = peg$literalExpectation("&&", false),
            peg$c333 = "&=",
            peg$c334 = peg$literalExpectation("&=", false),
            peg$c335 = "!",
            peg$c336 = peg$literalExpectation("!", false),
            peg$c337 = "=",
            peg$c338 = peg$literalExpectation("=", false),
            peg$c339 = ">>>",
            peg$c340 = peg$literalExpectation(">>>", false),
            peg$c341 = ">>>=",
            peg$c342 = peg$literalExpectation(">>>=", false),
            peg$c343 = ":",
            peg$c344 = peg$literalExpectation(":", false),
            peg$c345 = ",",
            peg$c346 = peg$literalExpectation(",", false),
            peg$c347 = "--",
            peg$c348 = peg$literalExpectation("--", false),
            peg$c349 = "/",
            peg$c350 = peg$literalExpectation("/", false),
            peg$c351 = "/=",
            peg$c352 = peg$literalExpectation("/=", false),
            peg$c353 = "...",
            peg$c354 = peg$literalExpectation("...", false),
            peg$c355 = "==",
            peg$c356 = peg$literalExpectation("==", false),
            peg$c357 = ">=",
            peg$c358 = peg$literalExpectation(">=", false),
            peg$c359 = ">",
            peg$c360 = peg$literalExpectation(">", false),
            peg$c361 = /^[=>]/,
            peg$c362 = peg$classExpectation(["=", ">"], false, false),
            peg$c363 = "^",
            peg$c364 = peg$literalExpectation("^", false),
            peg$c365 = "^=",
            peg$c366 = peg$literalExpectation("^=", false),
            peg$c367 = "++",
            peg$c368 = peg$literalExpectation("++", false),
            peg$c369 = "[",
            peg$c370 = peg$literalExpectation("[", false),
            peg$c371 = "<=",
            peg$c372 = peg$literalExpectation("<=", false),
            peg$c373 = "(",
            peg$c374 = peg$literalExpectation("(", false),
            peg$c375 = "<",
            peg$c376 = peg$literalExpectation("<", false),
            peg$c377 = /^[=<]/,
            peg$c378 = peg$classExpectation(["=", "<"], false, false),
            peg$c379 = "{",
            peg$c380 = peg$literalExpectation("{", false),
            peg$c381 = "-",
            peg$c382 = peg$literalExpectation("-", false),
            peg$c383 = /^[=\-]/,
            peg$c384 = peg$classExpectation(["=", "-"], false, false),
            peg$c385 = "-=",
            peg$c386 = peg$literalExpectation("-=", false),
            peg$c387 = "%",
            peg$c388 = peg$literalExpectation("%", false),
            peg$c389 = "%=",
            peg$c390 = peg$literalExpectation("%=", false),
            peg$c391 = "!=",
            peg$c392 = peg$literalExpectation("!=", false),
            peg$c393 = "|",
            peg$c394 = peg$literalExpectation("|", false),
            peg$c395 = /^[=|]/,
            peg$c396 = peg$classExpectation(["=", "|"], false, false),
            peg$c397 = "|=",
            peg$c398 = peg$literalExpectation("|=", false),
            peg$c399 = "||",
            peg$c400 = peg$literalExpectation("||", false),
            peg$c401 = "+",
            peg$c402 = peg$literalExpectation("+", false),
            peg$c403 = /^[=+]/,
            peg$c404 = peg$classExpectation(["=", "+"], false, false),
            peg$c405 = "+=",
            peg$c406 = peg$literalExpectation("+=", false),
            peg$c407 = "?",
            peg$c408 = peg$literalExpectation("?", false),
            peg$c409 = "]",
            peg$c410 = peg$literalExpectation("]", false),
            peg$c411 = ")",
            peg$c412 = peg$literalExpectation(")", false),
            peg$c413 = "}",
            peg$c414 = peg$literalExpectation("}", false),
            peg$c415 = ";",
            peg$c416 = peg$literalExpectation(";", false),
            peg$c417 = "<<",
            peg$c418 = peg$literalExpectation("<<", false),
            peg$c419 = "<<=",
            peg$c420 = peg$literalExpectation("<<=", false),
            peg$c421 = ">>",
            peg$c422 = peg$literalExpectation(">>", false),
            peg$c423 = ">>=",
            peg$c424 = peg$literalExpectation(">>=", false),
            peg$c425 = "*",
            peg$c426 = peg$literalExpectation("*", false),
            peg$c427 = "*=",
            peg$c428 = peg$literalExpectation("*=", false),
            peg$c429 = "~",
            peg$c430 = peg$literalExpectation("~", false),
            peg$c431 = peg$anyExpectation(),

            peg$currPos = 0,
            peg$savedPos = 0,
            peg$posDetailsCache = [{line: 1, column: 1}],
            peg$maxFailPos = 0,
            peg$maxFailExpected = [],
            peg$silentFails = 0,

            peg$result;

        if ("startRule" in options) {
            if (!(options.startRule in peg$startRuleFunctions)) {
                throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
            }

            peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }

        function text() {
            return input.substring(peg$savedPos, peg$currPos);
        }

        function location() {
            return peg$computeLocation(peg$savedPos, peg$currPos);
        }

        function expected(description, location) {
            location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

            throw peg$buildStructuredError(
                [peg$otherExpectation(description)],
                input.substring(peg$savedPos, peg$currPos),
                location
            );
        }

        function error(message, location) {
            location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

            throw peg$buildSimpleError(message, location);
        }

        function peg$literalExpectation(text, ignoreCase) {
            return {type: "literal", text: text, ignoreCase: ignoreCase};
        }

        function peg$classExpectation(parts, inverted, ignoreCase) {
            return {type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase};
        }

        function peg$anyExpectation() {
            return {type: "any"};
        }

        function peg$endExpectation() {
            return {type: "end"};
        }

        function peg$otherExpectation(description) {
            return {type: "other", description: description};
        }

        function peg$computePosDetails(pos) {
            var details = peg$posDetailsCache[pos], p;

            if (details) {
                return details;
            } else {
                p = pos - 1;
                while (!peg$posDetailsCache[p]) {
                    p--;
                }

                details = peg$posDetailsCache[p];
                details = {
                    line: details.line,
                    column: details.column
                };

                while (p < pos) {
                    if (input.charCodeAt(p) === 10) {
                        details.line++;
                        details.column = 1;
                    } else {
                        details.column++;
                    }

                    p++;
                }

                peg$posDetailsCache[pos] = details;
                return details;
            }
        }

        function peg$computeLocation(startPos, endPos) {
            var startPosDetails = peg$computePosDetails(startPos),
                endPosDetails = peg$computePosDetails(endPos);

            return {
                start: {
                    offset: startPos,
                    line: startPosDetails.line,
                    column: startPosDetails.column
                },
                end: {
                    offset: endPos,
                    line: endPosDetails.line,
                    column: endPosDetails.column
                }
            };
        }

        function peg$fail(expected) {
            if (peg$currPos < peg$maxFailPos) {
                return;
            }

            if (peg$currPos > peg$maxFailPos) {
                peg$maxFailPos = peg$currPos;
                peg$maxFailExpected = [];
            }

            peg$maxFailExpected.push(expected);
        }

        function peg$buildSimpleError(message, location) {
            return new peg$SyntaxError(message, null, null, location);
        }

        function peg$buildStructuredError(expected, found, location) {
            return new peg$SyntaxError(
                peg$SyntaxError.buildMessage(expected, found),
                expected,
                found,
                location
            );
        }

        function peg$parseCompilationUnit() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseSpacing();
            if (s1 !== peg$FAILED) {
                s2 = peg$parsePackageDeclaration();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$parseImportDeclaration();
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$parseImportDeclaration();
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = [];
                        s5 = peg$parseTypeDeclaration();
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            s5 = peg$parseTypeDeclaration();
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseEOT();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c0(s2, s3, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parsePackageDeclaration() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseAnnotation();
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseAnnotation();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parsePACKAGE();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseQualifiedIdentifier();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseSEMI();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c1(s1, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseImportDeclaration() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            s1 = peg$parseIMPORT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSTATIC();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseQualifiedIdentifier();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseDOT();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseSTAR();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseSEMI();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c2(s2, s3, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseSEMI();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c3();
                }
                s0 = s1;
            }

            return s0;
        }

        function peg$parseTypeDeclaration() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseModifier();
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseModifier();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseClassDeclaration();
                if (s2 === peg$FAILED) {
                    s2 = peg$parseEnumDeclaration();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseInterfaceDeclaration();
                        if (s2 === peg$FAILED) {
                            s2 = peg$parseAnnotationTypeDeclaration();
                        }
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c4(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseSEMI();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c3();
                }
                s0 = s1;
            }

            return s0;
        }

        function peg$parseClassDeclaration() {
            var s0, s1, s2, s3, s4, s5, s6, s7;

            s0 = peg$currPos;
            s1 = peg$parseCLASS();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseTypeParameters();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseEXTENDS();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseClassType();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$currPos;
                            s6 = peg$parseIMPLEMENTS();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseClassTypeList();
                                if (s7 !== peg$FAILED) {
                                    s6 = [s6, s7];
                                    s5 = s6;
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseClassBody();
                                if (s6 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c5(s2, s3, s4, s5, s6);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseClassBody() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseLWING();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseClassBodyDeclaration();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseClassBodyDeclaration();
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRWING();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c6(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseClassBodyDeclaration() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseSEMI();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c3();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseSTATIC();
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseBlock();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c7(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = [];
                    s2 = peg$parseModifier();
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        s2 = peg$parseModifier();
                    }
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseMemberDecl();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c8(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }

            return s0;
        }

        function peg$parseMemberDecl() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseTypeParameters();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseGenericMethodOrConstructorRest();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c9(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseType();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseIdentifier();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseMethodDeclaratorRest();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c10(s1, s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseType();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseVariableDeclarators();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseSEMI();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c11(s1, s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseVOID();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseIdentifier();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseVoidMethodDeclaratorRest();
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c12(s2, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseIdentifier();
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parseConstructorDeclaratorRest();
                                if (s2 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c13(s1, s2);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseInterfaceDeclaration();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseClassDeclaration();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseEnumDeclaration();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parseAnnotationTypeDeclaration();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseGenericMethodOrConstructorRest() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseType();
            if (s1 === peg$FAILED) {
                s1 = peg$currPos;
                s2 = peg$parseVOID();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s1;
                    s2 = peg$c14();
                }
                s1 = s2;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseMethodDeclaratorRest();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c15(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseIdentifier();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseConstructorDeclaratorRest();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c16(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseMethodDeclaratorRest() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseFormalParameters();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDim();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseDim();
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseTHROWS();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseClassTypeList();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseBlock();
                        if (s4 === peg$FAILED) {
                            s4 = peg$currPos;
                            s5 = peg$parseSEMI();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s4;
                                s5 = peg$c17(s1, s2, s3);
                            }
                            s4 = s5;
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c18(s1, s2, s3, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseVoidMethodDeclaratorRest() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseFormalParameters();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseTHROWS();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseClassTypeList();
                    if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseBlock();
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$parseSEMI();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s3;
                            s4 = peg$c19(s1, s2);
                        }
                        s3 = s4;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c20(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseConstructorDeclaratorRest() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseFormalParameters();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseTHROWS();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseClassTypeList();
                    if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseBlock();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c21(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseInterfaceDeclaration() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            s1 = peg$parseINTERFACE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseTypeParameters();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$currPos;
                        s5 = peg$parseEXTENDS();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseClassTypeList();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseInterfaceBody();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c22(s2, s3, s4, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseInterfaceBody() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseLWING();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseInterfaceBodyDeclaration();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseInterfaceBodyDeclaration();
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRWING();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c6(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseInterfaceBodyDeclaration() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseModifier();
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseModifier();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseInterfaceMemberDecl();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c8(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseSEMI();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c3();
                }
                s0 = s1;
            }

            return s0;
        }

        function peg$parseInterfaceMemberDecl() {
            var s0, s1, s2, s3;

            s0 = peg$parseInterfaceMethodOrFieldDecl();
            if (s0 === peg$FAILED) {
                s0 = peg$parseInterfaceGenericMethodDecl();
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseVOID();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseIdentifier();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseVoidInterfaceMethodDeclaratorRest();
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c16(s2, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseInterfaceDeclaration();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseAnnotationTypeDeclaration();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseClassDeclaration();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseEnumDeclaration();
                                }
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseInterfaceMethodOrFieldDecl() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseType();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseInterfaceMethodOrFieldRest();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c23(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseInterfaceMethodOrFieldRest() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseConstantDeclaratorsRest();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSEMI();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c24(s1);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseInterfaceMethodDeclaratorRest();
            }

            return s0;
        }

        function peg$parseInterfaceMethodDeclaratorRest() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseFormalParameters();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDim();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseDim();
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseTHROWS();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseClassTypeList();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseSEMI();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c25(s1, s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseInterfaceGenericMethodDecl() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseTypeParameters();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseType();
                if (s2 === peg$FAILED) {
                    s2 = peg$currPos;
                    s3 = peg$parseVOID();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c26(s1);
                    }
                    s2 = s3;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseIdentifier();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseInterfaceMethodDeclaratorRest();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c27(s1, s2, s3, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseVoidInterfaceMethodDeclaratorRest() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseFormalParameters();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseTHROWS();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseClassTypeList();
                    if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSEMI();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c28(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseConstantDeclaratorsRest() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseConstantDeclaratorRest();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseConstantDeclarator();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseConstantDeclarator();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseConstantDeclarator() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseConstantDeclaratorRest();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c16(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseConstantDeclaratorRest() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseDim();
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseDim();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseEQU();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseVariableInitializer();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c30(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEnumDeclaration() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseENUM();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseIMPLEMENTS();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseClassTypeList();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseEnumBody();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c31(s2, s3, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEnumBody() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseLWING();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseEnumConstants();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseCOMMA();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseEnumBodyDeclarations();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseRWING();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c32(s2, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEnumConstants() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseEnumConstant();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseEnumConstant();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseEnumConstant();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEnumConstant() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseAnnotation();
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseAnnotation();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseArguments();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseClassBody();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c33(s1, s2, s3, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEnumBodyDeclarations() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseSEMI();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseClassBodyDeclaration();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseClassBodyDeclaration();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c34(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLocalVariableDeclarationStatement() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$currPos;
            s3 = peg$parseFINAL();
            if (s3 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c35();
            }
            s2 = s3;
            if (s2 === peg$FAILED) {
                s2 = peg$parseAnnotation();
            }
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$currPos;
                s3 = peg$parseFINAL();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c35();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                    s2 = peg$parseAnnotation();
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseType();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseVariableDeclarators();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseSEMI();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c36(s1, s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseVariableDeclarators() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseVariableDeclarator();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseVariableDeclarator();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseVariableDeclarator();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseVariableDeclarator() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDim();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseDim();
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseEQU();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseVariableInitializer();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c37(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFormalParameters() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseLPAR();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseFormalParameterList();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRPAR();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c38(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFormalParameter() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$currPos;
            s3 = peg$parseFINAL();
            if (s3 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c35();
            }
            s2 = s3;
            if (s2 === peg$FAILED) {
                s2 = peg$parseAnnotation();
            }
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$currPos;
                s3 = peg$parseFINAL();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c35();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                    s2 = peg$parseAnnotation();
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseType();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseVariableDeclaratorId();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c39(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLastFormalParameter() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$currPos;
            s3 = peg$parseFINAL();
            if (s3 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c35();
            }
            s2 = s3;
            if (s2 === peg$FAILED) {
                s2 = peg$parseAnnotation();
            }
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$currPos;
                s3 = peg$parseFINAL();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c35();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                    s2 = peg$parseAnnotation();
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseType();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseELLIPSIS();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseVariableDeclaratorId();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c40(s1, s2, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFormalParameterList() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseFormalParameter();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseFormalParameter();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseFormalParameter();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseLastFormalParameter();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c41(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseLastFormalParameter();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c42(s1);
                }
                s0 = s1;
            }

            return s0;
        }

        function peg$parseVariableDeclaratorId() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDim();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseDim();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c43(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBlock() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseLWING();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseBlockStatements();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRWING();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c44(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBlockStatements() {
            var s0, s1;

            s0 = [];
            s1 = peg$parseBlockStatement();
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$parseBlockStatement();
            }

            return s0;
        }

        function peg$parseBlockStatement() {
            var s0, s1, s2;

            s0 = peg$parseLocalVariableDeclarationStatement();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = [];
                s2 = peg$parseModifier();
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parseModifier();
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseClassDeclaration();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseEnumDeclaration();
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c45(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$parseStatement();
                }
            }

            return s0;
        }

        function peg$parseStatement() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

            s0 = peg$parseBlock();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseASSERT();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseExpression();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$parseCOLON();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseExpression();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseSEMI();
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c46(s2, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseIF();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseParExpression();
                        if (s2 !== peg$FAILED) {
                            s3 = peg$parseStatement();
                            if (s3 !== peg$FAILED) {
                                s4 = peg$currPos;
                                s5 = peg$parseELSE();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parseStatement();
                                    if (s6 !== peg$FAILED) {
                                        s5 = [s5, s6];
                                        s4 = s5;
                                    } else {
                                        peg$currPos = s4;
                                        s4 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                                if (s4 === peg$FAILED) {
                                    s4 = null;
                                }
                                if (s4 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c47(s2, s3, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseFOR();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseLPAR();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseForInit();
                                if (s3 === peg$FAILED) {
                                    s3 = null;
                                }
                                if (s3 !== peg$FAILED) {
                                    s4 = peg$parseSEMI();
                                    if (s4 !== peg$FAILED) {
                                        s5 = peg$parseExpression();
                                        if (s5 === peg$FAILED) {
                                            s5 = null;
                                        }
                                        if (s5 !== peg$FAILED) {
                                            s6 = peg$parseSEMI();
                                            if (s6 !== peg$FAILED) {
                                                s7 = peg$parseForUpdate();
                                                if (s7 === peg$FAILED) {
                                                    s7 = null;
                                                }
                                                if (s7 !== peg$FAILED) {
                                                    s8 = peg$parseRPAR();
                                                    if (s8 !== peg$FAILED) {
                                                        s9 = peg$parseStatement();
                                                        if (s9 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c48(s3, s5, s7, s9);
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseFOR();
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parseLPAR();
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parseFormalParameter();
                                    if (s3 !== peg$FAILED) {
                                        s4 = peg$parseCOLON();
                                        if (s4 !== peg$FAILED) {
                                            s5 = peg$parseExpression();
                                            if (s5 !== peg$FAILED) {
                                                s6 = peg$parseRPAR();
                                                if (s6 !== peg$FAILED) {
                                                    s7 = peg$parseStatement();
                                                    if (s7 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c49(s3, s5, s7);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                s1 = peg$parseWHILE();
                                if (s1 !== peg$FAILED) {
                                    s2 = peg$parseParExpression();
                                    if (s2 !== peg$FAILED) {
                                        s3 = peg$parseStatement();
                                        if (s3 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c50(s2, s3);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    s1 = peg$parseDO();
                                    if (s1 !== peg$FAILED) {
                                        s2 = peg$parseStatement();
                                        if (s2 !== peg$FAILED) {
                                            s3 = peg$parseWHILE();
                                            if (s3 !== peg$FAILED) {
                                                s4 = peg$parseParExpression();
                                                if (s4 !== peg$FAILED) {
                                                    s5 = peg$parseSEMI();
                                                    if (s5 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c51(s2, s4);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        s1 = peg$parseTRY();
                                        if (s1 !== peg$FAILED) {
                                            s2 = peg$parseLPAR();
                                            if (s2 !== peg$FAILED) {
                                                s3 = peg$parseResource();
                                                if (s3 !== peg$FAILED) {
                                                    s4 = [];
                                                    s5 = peg$currPos;
                                                    s6 = peg$parseSEMI();
                                                    if (s6 !== peg$FAILED) {
                                                        s7 = peg$parseResource();
                                                        if (s7 !== peg$FAILED) {
                                                            s6 = [s6, s7];
                                                            s5 = s6;
                                                        } else {
                                                            peg$currPos = s5;
                                                            s5 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s5;
                                                        s5 = peg$FAILED;
                                                    }
                                                    while (s5 !== peg$FAILED) {
                                                        s4.push(s5);
                                                        s5 = peg$currPos;
                                                        s6 = peg$parseSEMI();
                                                        if (s6 !== peg$FAILED) {
                                                            s7 = peg$parseResource();
                                                            if (s7 !== peg$FAILED) {
                                                                s6 = [s6, s7];
                                                                s5 = s6;
                                                            } else {
                                                                peg$currPos = s5;
                                                                s5 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s5;
                                                            s5 = peg$FAILED;
                                                        }
                                                    }
                                                    if (s4 !== peg$FAILED) {
                                                        s5 = peg$parseSEMI();
                                                        if (s5 === peg$FAILED) {
                                                            s5 = null;
                                                        }
                                                        if (s5 !== peg$FAILED) {
                                                            s6 = peg$parseRPAR();
                                                            if (s6 !== peg$FAILED) {
                                                                s7 = peg$parseBlock();
                                                                if (s7 !== peg$FAILED) {
                                                                    s8 = [];
                                                                    s9 = peg$parseCatch();
                                                                    while (s9 !== peg$FAILED) {
                                                                        s8.push(s9);
                                                                        s9 = peg$parseCatch();
                                                                    }
                                                                    if (s8 !== peg$FAILED) {
                                                                        s9 = peg$parseFinally();
                                                                        if (s9 === peg$FAILED) {
                                                                            s9 = null;
                                                                        }
                                                                        if (s9 !== peg$FAILED) {
                                                                            peg$savedPos = s0;
                                                                            s1 = peg$c52(s3, s4, s7, s8, s9);
                                                                            s0 = s1;
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            s1 = peg$parseTRY();
                                            if (s1 !== peg$FAILED) {
                                                s2 = peg$parseBlock();
                                                if (s2 !== peg$FAILED) {
                                                    s3 = peg$currPos;
                                                    s4 = [];
                                                    s5 = peg$parseCatch();
                                                    if (s5 !== peg$FAILED) {
                                                        while (s5 !== peg$FAILED) {
                                                            s4.push(s5);
                                                            s5 = peg$parseCatch();
                                                        }
                                                    } else {
                                                        s4 = peg$FAILED;
                                                    }
                                                    if (s4 !== peg$FAILED) {
                                                        s5 = peg$parseFinally();
                                                        if (s5 === peg$FAILED) {
                                                            s5 = null;
                                                        }
                                                        if (s5 !== peg$FAILED) {
                                                            peg$savedPos = s3;
                                                            s4 = peg$c53(s2, s4, s5);
                                                            s3 = s4;
                                                        } else {
                                                            peg$currPos = s3;
                                                            s3 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s3;
                                                        s3 = peg$FAILED;
                                                    }
                                                    if (s3 === peg$FAILED) {
                                                        s3 = peg$currPos;
                                                        s4 = peg$parseFinally();
                                                        if (s4 !== peg$FAILED) {
                                                            peg$savedPos = s3;
                                                            s4 = peg$c54(s2, s4);
                                                        }
                                                        s3 = s4;
                                                    }
                                                    if (s3 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c55(s2, s3);
                                                        s0 = s1;
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                s1 = peg$parseSWITCH();
                                                if (s1 !== peg$FAILED) {
                                                    s2 = peg$parseParExpression();
                                                    if (s2 !== peg$FAILED) {
                                                        s3 = peg$parseLWING();
                                                        if (s3 !== peg$FAILED) {
                                                            s4 = peg$parseSwitchBlockStatementGroups();
                                                            if (s4 !== peg$FAILED) {
                                                                s5 = peg$parseRWING();
                                                                if (s5 !== peg$FAILED) {
                                                                    peg$savedPos = s0;
                                                                    s1 = peg$c56(s2, s4);
                                                                    s0 = s1;
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                                if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    s1 = peg$parseSYNCHRONIZED();
                                                    if (s1 !== peg$FAILED) {
                                                        s2 = peg$parseParExpression();
                                                        if (s2 !== peg$FAILED) {
                                                            s3 = peg$parseBlock();
                                                            if (s3 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c57(s2, s3);
                                                                s0 = s1;
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                        s0 = peg$currPos;
                                                        s1 = peg$parseRETURN();
                                                        if (s1 !== peg$FAILED) {
                                                            s2 = peg$parseExpression();
                                                            if (s2 === peg$FAILED) {
                                                                s2 = null;
                                                            }
                                                            if (s2 !== peg$FAILED) {
                                                                s3 = peg$parseSEMI();
                                                                if (s3 !== peg$FAILED) {
                                                                    peg$savedPos = s0;
                                                                    s1 = peg$c58(s2);
                                                                    s0 = s1;
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                            s0 = peg$currPos;
                                                            s1 = peg$parseTHROW();
                                                            if (s1 !== peg$FAILED) {
                                                                s2 = peg$parseExpression();
                                                                if (s2 !== peg$FAILED) {
                                                                    s3 = peg$parseSEMI();
                                                                    if (s3 !== peg$FAILED) {
                                                                        peg$savedPos = s0;
                                                                        s1 = peg$c59(s2);
                                                                        s0 = s1;
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                                s0 = peg$currPos;
                                                                s1 = peg$parseBREAK();
                                                                if (s1 !== peg$FAILED) {
                                                                    s2 = peg$parseIdentifier();
                                                                    if (s2 === peg$FAILED) {
                                                                        s2 = null;
                                                                    }
                                                                    if (s2 !== peg$FAILED) {
                                                                        s3 = peg$parseSEMI();
                                                                        if (s3 !== peg$FAILED) {
                                                                            peg$savedPos = s0;
                                                                            s1 = peg$c60(s2);
                                                                            s0 = s1;
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                    s0 = peg$currPos;
                                                                    s1 = peg$parseCONTINUE();
                                                                    if (s1 !== peg$FAILED) {
                                                                        s2 = peg$parseIdentifier();
                                                                        if (s2 === peg$FAILED) {
                                                                            s2 = null;
                                                                        }
                                                                        if (s2 !== peg$FAILED) {
                                                                            s3 = peg$parseSEMI();
                                                                            if (s3 !== peg$FAILED) {
                                                                                peg$savedPos = s0;
                                                                                s1 = peg$c61(s2);
                                                                                s0 = s1;
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                        } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                        s0 = peg$currPos;
                                                                        s1 = peg$parseSEMI();
                                                                        if (s1 !== peg$FAILED) {
                                                                            peg$savedPos = s0;
                                                                            s1 = peg$c62();
                                                                        }
                                                                        s0 = s1;
                                                                        if (s0 === peg$FAILED) {
                                                                            s0 = peg$currPos;
                                                                            s1 = peg$parseStatementExpression();
                                                                            if (s1 !== peg$FAILED) {
                                                                                s2 = peg$parseSEMI();
                                                                                if (s2 !== peg$FAILED) {
                                                                                    peg$savedPos = s0;
                                                                                    s1 = peg$c63(s1);
                                                                                    s0 = s1;
                                                                                } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                                s0 = peg$currPos;
                                                                                s1 = peg$parseIdentifier();
                                                                                if (s1 !== peg$FAILED) {
                                                                                    s2 = peg$parseCOLON();
                                                                                    if (s2 !== peg$FAILED) {
                                                                                        s3 = peg$parseStatement();
                                                                                        if (s3 !== peg$FAILED) {
                                                                                            peg$savedPos = s0;
                                                                                            s1 = peg$c64(s1, s3);
                                                                                            s0 = s1;
                                                                                        } else {
                                                                                            peg$currPos = s0;
                                                                                            s0 = peg$FAILED;
                                                                                        }
                                                                                    } else {
                                                                                        peg$currPos = s0;
                                                                                        s0 = peg$FAILED;
                                                                                    }
                                                                                } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseResource() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$currPos;
            s3 = peg$parseFINAL();
            if (s3 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c35();
            }
            s2 = s3;
            if (s2 === peg$FAILED) {
                s2 = peg$parseAnnotation();
            }
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$currPos;
                s3 = peg$parseFINAL();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c35();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                    s2 = peg$parseAnnotation();
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseType();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseVariableDeclaratorId();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseEQU();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseExpression();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c65(s1, s2, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCatch() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;

            s0 = peg$currPos;
            s1 = peg$parseCATCH();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseLPAR();
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = peg$parseFINAL();
                    if (s5 !== peg$FAILED) {
                        peg$savedPos = s4;
                        s5 = peg$c35();
                    }
                    s4 = s5;
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseAnnotation();
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = peg$parseFINAL();
                        if (s5 !== peg$FAILED) {
                            peg$savedPos = s4;
                            s5 = peg$c35();
                        }
                        s4 = s5;
                        if (s4 === peg$FAILED) {
                            s4 = peg$parseAnnotation();
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseType();
                        if (s4 !== peg$FAILED) {
                            s5 = [];
                            s6 = peg$currPos;
                            s7 = peg$parseOR();
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parseType();
                                if (s8 !== peg$FAILED) {
                                    s7 = [s7, s8];
                                    s6 = s7;
                                } else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                            }
                            while (s6 !== peg$FAILED) {
                                s5.push(s6);
                                s6 = peg$currPos;
                                s7 = peg$parseOR();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parseType();
                                    if (s8 !== peg$FAILED) {
                                        s7 = [s7, s8];
                                        s6 = s7;
                                    } else {
                                        peg$currPos = s6;
                                        s6 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parseVariableDeclaratorId();
                                if (s6 !== peg$FAILED) {
                                    s7 = peg$parseRPAR();
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parseBlock();
                                        if (s8 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c66(s3, s4, s5, s6, s8);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFinally() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseFINALLY();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseBlock();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c67(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSwitchBlockStatementGroups() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseSwitchBlockStatementGroup();
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseSwitchBlockStatementGroup();
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c68(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseSwitchBlockStatementGroup() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseSwitchLabel();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseBlockStatements();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c69(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSwitchLabel() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseCASE();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseExpression();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseCOLON();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c70(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseCASE();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseIdentifier();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseCOLON();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c70(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseDEFAULT();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseCOLON();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c3();
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
            }

            return s0;
        }

        function peg$parseForInit() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$currPos;
            s3 = peg$parseFINAL();
            if (s3 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c35();
            }
            s2 = s3;
            if (s2 === peg$FAILED) {
                s2 = peg$parseAnnotation();
            }
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$currPos;
                s3 = peg$parseFINAL();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c35();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                    s2 = peg$parseAnnotation();
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseType();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseVariableDeclarators();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c71(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseStatementExpression();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseStatementExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = peg$parseCOMMA();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseStatementExpression();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c72(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseForUpdate() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseStatementExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseStatementExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseStatementExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c72(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseStatementExpression() {
            var s0, s1;

            s0 = peg$currPos;
            s1 = peg$parseExpression();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c73(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseExpression() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseConditionalExpression();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseAssignmentOperator();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseExpression();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c74(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseConditionalExpression();
            }

            return s0;
        }

        function peg$parseAssignmentOperator() {
            var s0;

            s0 = peg$parseEQU();
            if (s0 === peg$FAILED) {
                s0 = peg$parsePLUSEQU();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseMINUSEQU();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseSTAREQU();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseDIVEQU();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseANDEQU();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseOREQU();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseHATEQU();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parseMODEQU();
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$parseSLEQU();
                                                if (s0 === peg$FAILED) {
                                                    s0 = peg$parseSREQU();
                                                    if (s0 === peg$FAILED) {
                                                        s0 = peg$parseBSREQU();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseConditionalExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseConditionalOrExpression();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseQUERY();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseExpression();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseCOLON();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseConditionalExpression();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c75(s1, s3, s5);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseConditionalOrExpression();
            }

            return s0;
        }

        function peg$parseConditionalOrExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseConditionalAndExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseOROR();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseConditionalAndExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseOROR();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseConditionalAndExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseConditionalAndExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseInclusiveOrExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseANDAND();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseInclusiveOrExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseANDAND();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseInclusiveOrExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseInclusiveOrExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseExclusiveOrExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseOR();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseExclusiveOrExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseOR();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseExclusiveOrExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseExclusiveOrExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseAndExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseHAT();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseAndExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseHAT();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseAndExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAndExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseEqualityExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseAND();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseEqualityExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseAND();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseEqualityExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEqualityExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseRelationalExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseEQUAL();
                if (s4 === peg$FAILED) {
                    s4 = peg$parseNOTEQUAL();
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseRelationalExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseEQUAL();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseNOTEQUAL();
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseRelationalExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseRelationalExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseShiftExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseLE();
                if (s4 === peg$FAILED) {
                    s4 = peg$parseGE();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseLT();
                        if (s4 === peg$FAILED) {
                            s4 = peg$parseGT();
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseShiftExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseINSTANCEOF();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseReferenceType();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseLE();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseGE();
                        if (s4 === peg$FAILED) {
                            s4 = peg$parseLT();
                            if (s4 === peg$FAILED) {
                                s4 = peg$parseGT();
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseShiftExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$parseINSTANCEOF();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseReferenceType();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c77(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseShiftExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseAdditiveExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseSL();
                if (s4 === peg$FAILED) {
                    s4 = peg$parseSR();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseBSR();
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseAdditiveExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseSL();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseSR();
                        if (s4 === peg$FAILED) {
                            s4 = peg$parseBSR();
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseAdditiveExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAdditiveExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseMultiplicativeExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parsePLUS();
                if (s4 === peg$FAILED) {
                    s4 = peg$parseMINUS();
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseMultiplicativeExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parsePLUS();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseMINUS();
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseMultiplicativeExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseMultiplicativeExpression() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseUnaryExpression();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseSTAR();
                if (s4 === peg$FAILED) {
                    s4 = peg$parseDIV();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseMOD();
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseUnaryExpression();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseSTAR();
                    if (s4 === peg$FAILED) {
                        s4 = peg$parseDIV();
                        if (s4 === peg$FAILED) {
                            s4 = peg$parseMOD();
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseUnaryExpression();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c76(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseUnaryExpression() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parsePrefixOp();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseUnaryExpression();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c78(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseUnaryExpressionNotPlusMinus();
            }

            return s0;
        }

        function peg$parseUnaryExpressionNotPlusMinus() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseCastExpression();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c79(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsePrimary();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseSelector();
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        s4 = peg$parseSelector();
                        while (s4 !== peg$FAILED) {
                            s3.push(s4);
                            s4 = peg$parseSelector();
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = [];
                            s5 = peg$parsePostfixOp();
                            if (s5 !== peg$FAILED) {
                                while (s5 !== peg$FAILED) {
                                    s4.push(s5);
                                    s5 = peg$parsePostfixOp();
                                }
                            } else {
                                s4 = peg$FAILED;
                            }
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c80(s1, s2, s3, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsePrimary();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseSelector();
                        if (s2 !== peg$FAILED) {
                            s3 = [];
                            s4 = peg$parseSelector();
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                s4 = peg$parseSelector();
                            }
                            if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c81(s1, s2, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parsePrimary();
                        if (s1 !== peg$FAILED) {
                            s2 = [];
                            s3 = peg$parsePostfixOp();
                            if (s3 !== peg$FAILED) {
                                while (s3 !== peg$FAILED) {
                                    s2.push(s3);
                                    s3 = peg$parsePostfixOp();
                                }
                            } else {
                                s2 = peg$FAILED;
                            }
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c82(s1, s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$parsePrimary();
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseCastExpression() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseLPAR();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseBasicType();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRPAR();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseUnaryExpression();
                        if (s4 !== peg$FAILED) {
                            s1 = [s1, s2, s3, s4];
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseLPAR();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseReferenceType();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseRPAR();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseUnaryExpressionNotPlusMinus();
                            if (s4 !== peg$FAILED) {
                                s1 = [s1, s2, s3, s4];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parsePrimary() {
            var s0, s1, s2, s3, s4;

            s0 = peg$parseParExpression();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseNonWildcardTypeArguments();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseExplicitGenericInvocationSuffix();
                    if (s2 === peg$FAILED) {
                        s2 = peg$currPos;
                        s3 = peg$parseTHIS();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseArguments();
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s2;
                                s3 = peg$c83(s1, s4);
                                s2 = s3;
                            } else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c84(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseTHIS();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseArguments();
                        if (s2 === peg$FAILED) {
                            s2 = null;
                        }
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c85(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseSUPER();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseSuperSuffix();
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c86(s2);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseLiteral();
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                s1 = peg$parseNEW();
                                if (s1 !== peg$FAILED) {
                                    s2 = peg$parseCreator();
                                    if (s2 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c87(s2);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseQualifiedIdentifierSuffix();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseQualifiedIdentifier();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            s1 = peg$parseBasicType();
                                            if (s1 !== peg$FAILED) {
                                                s2 = [];
                                                s3 = peg$parseDim();
                                                while (s3 !== peg$FAILED) {
                                                    s2.push(s3);
                                                    s3 = peg$parseDim();
                                                }
                                                if (s2 !== peg$FAILED) {
                                                    s3 = peg$parseDOT();
                                                    if (s3 !== peg$FAILED) {
                                                        s4 = peg$parseCLASS();
                                                        if (s4 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c88(s1, s2);
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                s1 = peg$parseVOID();
                                                if (s1 !== peg$FAILED) {
                                                    s2 = peg$parseDOT();
                                                    if (s2 !== peg$FAILED) {
                                                        s3 = peg$parseCLASS();
                                                        if (s3 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c89();
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseQualifiedIdentifierSuffix() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseQualifiedIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDim();
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseDim();
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDOT();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseCLASS();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c90(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseQualifiedIdentifier();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseLBRK();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseExpression();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseRBRK();
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c91(s1, s3);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseQualifiedIdentifier();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseArguments();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c92(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseQualifiedIdentifier();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseDOT();
                            if (s2 !== peg$FAILED) {
                                s3 = peg$parseCLASS();
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c93(s1);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseQualifiedIdentifier();
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parseDOT();
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parseExplicitGenericInvocation();
                                    if (s3 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c94(s1, s3);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                s1 = peg$parseQualifiedIdentifier();
                                if (s1 !== peg$FAILED) {
                                    s2 = peg$parseDOT();
                                    if (s2 !== peg$FAILED) {
                                        s3 = peg$parseTHIS();
                                        if (s3 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c95(s1);
                                            s0 = s1;
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    s1 = peg$parseQualifiedIdentifier();
                                    if (s1 !== peg$FAILED) {
                                        s2 = peg$parseDOT();
                                        if (s2 !== peg$FAILED) {
                                            s3 = peg$parseSUPER();
                                            if (s3 !== peg$FAILED) {
                                                s4 = peg$parseArguments();
                                                if (s4 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c96(s1, s4);
                                                    s0 = s1;
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        s1 = peg$parseQualifiedIdentifier();
                                        if (s1 !== peg$FAILED) {
                                            s2 = peg$parseDOT();
                                            if (s2 !== peg$FAILED) {
                                                s3 = peg$parseNEW();
                                                if (s3 !== peg$FAILED) {
                                                    s4 = peg$parseNonWildcardTypeArguments();
                                                    if (s4 === peg$FAILED) {
                                                        s4 = null;
                                                    }
                                                    if (s4 !== peg$FAILED) {
                                                        s5 = peg$parseInnerCreator();
                                                        if (s5 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c97(s1, s4, s5);
                                                            s0 = s1;
                                                        } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseExplicitGenericInvocation() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseNonWildcardTypeArguments();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseExplicitGenericInvocationSuffix();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c84(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseNonWildcardTypeArguments() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            s1 = peg$parseLPOINT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseReferenceType();
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseReferenceType();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseReferenceType();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRPOINT();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c29(s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTypeArgumentsOrDiamond() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseLPOINT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseRPOINT();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c98();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseTypeArguments();
            }

            return s0;
        }

        function peg$parseNonWildcardTypeArgumentsOrDiamond() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseLPOINT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseRPOINT();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseNonWildcardTypeArguments();
            }

            return s0;
        }

        function peg$parseExplicitGenericInvocationSuffix() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseSUPER();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSuperSuffix();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c99(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseIdentifier();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseArguments();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c100(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parsePrefixOp() {
            var s0, s1;

            s0 = peg$currPos;
            s1 = peg$parseINC();
            if (s1 === peg$FAILED) {
                s1 = peg$parseDEC();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseBANG();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseTILDA();
                        if (s1 === peg$FAILED) {
                            s1 = peg$parsePLUS();
                            if (s1 === peg$FAILED) {
                                s1 = peg$parseMINUS();
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c101(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsePostfixOp() {
            var s0, s1;

            s0 = peg$currPos;
            s1 = peg$parseINC();
            if (s1 === peg$FAILED) {
                s1 = peg$parseDEC();
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c101(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseSelector() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseDOT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseArguments();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c100(s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseDOT();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseIdentifier();
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c102(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseDOT();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseExplicitGenericInvocation();
                        if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c103(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseDOT();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseTHIS();
                            if (s2 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c104();
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parseDOT();
                            if (s1 !== peg$FAILED) {
                                s2 = peg$parseSUPER();
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$parseSuperSuffix();
                                    if (s3 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c99(s3);
                                        s0 = s1;
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                s1 = peg$parseDOT();
                                if (s1 !== peg$FAILED) {
                                    s2 = peg$parseNEW();
                                    if (s2 !== peg$FAILED) {
                                        s3 = peg$parseNonWildcardTypeArguments();
                                        if (s3 === peg$FAILED) {
                                            s3 = null;
                                        }
                                        if (s3 !== peg$FAILED) {
                                            s4 = peg$parseInnerCreator();
                                            if (s4 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c105(s3, s4);
                                                s0 = s1;
                                            } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                                if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    s1 = peg$parseDimExpr();
                                    if (s1 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c106(s1);
                                    }
                                    s0 = s1;
                                }
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseSuperSuffix() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseArguments();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c107(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseDOT();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseNonWildcardTypeArguments();
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseIdentifier();
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parseArguments();
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c108(s2, s3, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseBasicType() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c109) {
                s1 = peg$c109;
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c110);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 5) === peg$c111) {
                    s1 = peg$c111;
                    peg$currPos += 5;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c112);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 4) === peg$c113) {
                        s1 = peg$c113;
                        peg$currPos += 4;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c114);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c115) {
                            s1 = peg$c115;
                            peg$currPos += 3;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c116);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c117) {
                                s1 = peg$c117;
                                peg$currPos += 4;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c118);
                                }
                            }
                            if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 5) === peg$c119) {
                                    s1 = peg$c119;
                                    peg$currPos += 5;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c120);
                                    }
                                }
                                if (s1 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 6) === peg$c121) {
                                        s1 = peg$c121;
                                        peg$currPos += 6;
                                    } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c122);
                                        }
                                    }
                                    if (s1 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 7) === peg$c123) {
                                            s1 = peg$c123;
                                            peg$currPos += 7;
                                        } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c124);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c125(s1);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseArguments() {
            var s0, s1, s2, s3, s4, s5, s6, s7;

            s0 = peg$currPos;
            s1 = peg$parseLPAR();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseExpression();
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$currPos;
                    s6 = peg$parseCOMMA();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseExpression();
                        if (s7 !== peg$FAILED) {
                            s6 = [s6, s7];
                            s5 = s6;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$currPos;
                        s6 = peg$parseCOMMA();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseExpression();
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c29(s3, s4);
                        s2 = s3;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRPAR();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c126(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCreator() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseBasicType();
            if (s1 === peg$FAILED) {
                s1 = peg$parseCreatedName();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseArrayCreatorRest();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c127(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseNonWildcardTypeArguments();
                if (s1 === peg$FAILED) {
                    s1 = null;
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseCreatedName();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseClassCreatorRest();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c128(s1, s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseCreatedName() {
            var s0, s1, s2, s3, s4, s5, s6, s7;

            s0 = peg$currPos;
            s1 = peg$parseQualifiedIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseTypeArgumentsOrDiamond();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = peg$parseDOT();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseIdentifier();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseTypeArgumentsOrDiamond();
                            if (s7 === peg$FAILED) {
                                s7 = null;
                            }
                            if (s7 !== peg$FAILED) {
                                s5 = [s5, s6, s7];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = peg$parseDOT();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseIdentifier();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseTypeArgumentsOrDiamond();
                                if (s7 === peg$FAILED) {
                                    s7 = null;
                                }
                                if (s7 !== peg$FAILED) {
                                    s5 = [s5, s6, s7];
                                    s4 = s5;
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c129(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseInnerCreator() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseNonWildcardTypeArgumentsOrDiamond();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseClassCreatorRest();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c130(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseClassCreatorRest() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseArguments();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseClassBody();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c131(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseArrayCreatorRest() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseDim();
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parseDim();
                }
            } else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseArrayInitializer();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c132(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = [];
                s2 = peg$parseDimExpr();
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        s2 = peg$parseDimExpr();
                    }
                } else {
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseDim();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseDim();
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c133(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseDim();
                    if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c134(s1);
                    }
                    s0 = s1;
                }
            }

            return s0;
        }

        function peg$parseArrayInitializer() {
            var s0, s1, s2, s3, s4, s5, s6, s7;

            s0 = peg$currPos;
            s1 = peg$parseLWING();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseVariableInitializer();
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$currPos;
                    s6 = peg$parseCOMMA();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseVariableInitializer();
                        if (s7 !== peg$FAILED) {
                            s6 = [s6, s7];
                            s5 = s6;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$currPos;
                        s6 = peg$parseCOMMA();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseVariableInitializer();
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c29(s3, s4);
                        s2 = s3;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseCOMMA();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRWING();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c135(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseVariableInitializer() {
            var s0;

            s0 = peg$parseArrayInitializer();
            if (s0 === peg$FAILED) {
                s0 = peg$parseExpression();
            }

            return s0;
        }

        function peg$parseParExpression() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseLPAR();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseExpression();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRPAR();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c136(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseQualifiedIdentifier() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseDOT();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseIdentifier();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseDOT();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseIdentifier();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c137(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDim() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseLBRK();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseRBRK();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDimExpr() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseLBRK();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseExpression();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRBRK();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c138(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseType() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseBasicType();
            if (s1 === peg$FAILED) {
                s1 = peg$parseClassType();
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDim();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseDim();
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c139(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseReferenceType() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseBasicType();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseDim();
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseDim();
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c140(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseClassType();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseDim();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseDim();
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c141(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseClassType() {
            var s0, s1, s2, s3, s4, s5, s6, s7;

            s0 = peg$currPos;
            s1 = peg$parseQualifiedIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseTypeArguments();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = peg$parseDOT();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseIdentifier();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseTypeArguments();
                            if (s7 === peg$FAILED) {
                                s7 = null;
                            }
                            if (s7 !== peg$FAILED) {
                                s5 = [s5, s6, s7];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = peg$parseDOT();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseIdentifier();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseTypeArguments();
                                if (s7 === peg$FAILED) {
                                    s7 = null;
                                }
                                if (s7 !== peg$FAILED) {
                                    s5 = [s5, s6, s7];
                                    s4 = s5;
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c129(s1, s2, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseClassTypeList() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseClassType();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseClassType();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseClassType();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTypeArguments() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            s1 = peg$parseLPOINT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseTypeArgument();
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseTypeArgument();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseTypeArgument();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRPOINT();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c29(s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTypeArgument() {
            var s0, s1, s2, s3, s4;

            s0 = peg$parseReferenceType();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseQUERY();
                if (s1 !== peg$FAILED) {
                    s2 = peg$currPos;
                    s3 = peg$currPos;
                    s4 = peg$parseEXTENDS();
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s3;
                        s4 = peg$c142();
                    }
                    s3 = s4;
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$parseSUPER();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s3;
                            s4 = peg$c143();
                        }
                        s3 = s4;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseReferenceType();
                        if (s4 !== peg$FAILED) {
                            s3 = [s3, s4];
                            s2 = s3;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c144(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseTypeParameters() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            s1 = peg$parseLPOINT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseTypeParameter();
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = peg$parseCOMMA();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseTypeParameter();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = peg$parseCOMMA();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseTypeParameter();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRPOINT();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c29(s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTypeParameter() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseEXTENDS();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseBound();
                    if (s4 !== peg$FAILED) {
                        s3 = [s3, s4];
                        s2 = s3;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c145(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBound() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseClassType();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseAND();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseClassType();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseAND();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseClassType();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseModifier() {
            var s0, s1, s2, s3;

            s0 = peg$parseAnnotation();
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 6) === peg$c146) {
                    s1 = peg$c146;
                    peg$currPos += 6;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c147);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 9) === peg$c148) {
                        s1 = peg$c148;
                        peg$currPos += 9;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c149);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 7) === peg$c150) {
                            s1 = peg$c150;
                            peg$currPos += 7;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c151);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c152) {
                                s1 = peg$c152;
                                peg$currPos += 6;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c153);
                                }
                            }
                            if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 8) === peg$c154) {
                                    s1 = peg$c154;
                                    peg$currPos += 8;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c155);
                                    }
                                }
                                if (s1 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 5) === peg$c156) {
                                        s1 = peg$c156;
                                        peg$currPos += 5;
                                    } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c157);
                                        }
                                    }
                                    if (s1 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 6) === peg$c158) {
                                            s1 = peg$c158;
                                            peg$currPos += 6;
                                        } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c159);
                                            }
                                        }
                                        if (s1 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 12) === peg$c160) {
                                                s1 = peg$c160;
                                                peg$currPos += 12;
                                            } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c161);
                                                }
                                            }
                                            if (s1 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 9) === peg$c162) {
                                                    s1 = peg$c162;
                                                    peg$currPos += 9;
                                                } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c163);
                                                    }
                                                }
                                                if (s1 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 8) === peg$c164) {
                                                        s1 = peg$c164;
                                                        peg$currPos += 8;
                                                    } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c165);
                                                        }
                                                    }
                                                    if (s1 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 8) === peg$c166) {
                                                            s1 = peg$c166;
                                                            peg$currPos += 8;
                                                        } else {
                                                            s1 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c167);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$currPos;
                    peg$silentFails++;
                    s3 = peg$parseLetterOrDigit();
                    peg$silentFails--;
                    if (s3 === peg$FAILED) {
                        s2 = void 0;
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseSpacing();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c168(s1);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseAnnotationTypeDeclaration() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseAT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseINTERFACE();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseIdentifier();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseAnnotationTypeBody();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c169(s3, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAnnotationTypeBody() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseLWING();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseAnnotationTypeElementDeclaration();
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseAnnotationTypeElementDeclaration();
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRWING();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c170(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAnnotationTypeElementDeclaration() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parseModifier();
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parseModifier();
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseAnnotationTypeElementRest();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c171(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseSEMI();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c3();
                }
                s0 = s1;
            }

            return s0;
        }

        function peg$parseAnnotationTypeElementRest() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseType();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseAnnotationMethodOrConstantRest();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSEMI();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c172(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$parseClassDeclaration();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseEnumDeclaration();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseInterfaceDeclaration();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseAnnotationTypeDeclaration();
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseAnnotationMethodOrConstantRest() {
            var s0;

            s0 = peg$parseAnnotationMethodRest();
            if (s0 === peg$FAILED) {
                s0 = peg$parseAnnotationConstantRest();
            }

            return s0;
        }

        function peg$parseAnnotationMethodRest() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseLPAR();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseRPAR();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseDefaultValue();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c173(s1, s4);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAnnotationConstantRest() {
            var s0, s1;

            s0 = peg$currPos;
            s1 = peg$parseVariableDeclarators();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c174(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseDefaultValue() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseDEFAULT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseElementValue();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c175(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAnnotation() {
            var s0;

            s0 = peg$parseNormalAnnotation();
            if (s0 === peg$FAILED) {
                s0 = peg$parseSingleElementAnnotation();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseMarkerAnnotation();
                }
            }

            return s0;
        }

        function peg$parseNormalAnnotation() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseAT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseQualifiedIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAR();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseElementValuePairs();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseRPAR();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c176(s2, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSingleElementAnnotation() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseAT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseQualifiedIdentifier();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseLPAR();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseElementValue();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseRPAR();
                            if (s5 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c177(s2, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseMarkerAnnotation() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseAT();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseQualifiedIdentifier();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c178(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseElementValuePairs() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseElementValuePair();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseElementValuePair();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseElementValuePair();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseElementValuePair() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseIdentifier();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseEQU();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseElementValue();
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c179(s1, s3);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseElementValue() {
            var s0;

            s0 = peg$parseConditionalExpression();
            if (s0 === peg$FAILED) {
                s0 = peg$parseAnnotation();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseElementValueArrayInitializer();
                }
            }

            return s0;
        }

        function peg$parseElementValueArrayInitializer() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseLWING();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseElementValues();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseCOMMA();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseRWING();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c180(s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseElementValues() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseElementValue();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = peg$parseCOMMA();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseElementValue();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = peg$parseCOMMA();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseElementValue();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c29(s1, s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSpacing() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = [];
            s1 = [];
            if (peg$c181.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c182);
                }
            }
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    if (peg$c181.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c182);
                        }
                    }
                }
            } else {
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c183) {
                    s2 = peg$c183;
                    peg$currPos += 2;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c184);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = peg$currPos;
                    peg$silentFails++;
                    if (input.substr(peg$currPos, 2) === peg$c185) {
                        s6 = peg$c185;
                        peg$currPos += 2;
                    } else {
                        s6 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c186);
                        }
                    }
                    peg$silentFails--;
                    if (s6 === peg$FAILED) {
                        s5 = void 0;
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = peg$currPos;
                        peg$silentFails++;
                        if (input.substr(peg$currPos, 2) === peg$c185) {
                            s6 = peg$c185;
                            peg$currPos += 2;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c186);
                            }
                        }
                        peg$silentFails--;
                        if (s6 === peg$FAILED) {
                            s5 = void 0;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c185) {
                            s4 = peg$c185;
                            peg$currPos += 2;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c186);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            s2 = [s2, s3, s4];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 === peg$FAILED) {
                    s1 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c187) {
                        s2 = peg$c187;
                        peg$currPos += 2;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c188);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        s4 = peg$currPos;
                        s5 = peg$currPos;
                        peg$silentFails++;
                        if (peg$c189.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c190);
                            }
                        }
                        peg$silentFails--;
                        if (s6 === peg$FAILED) {
                            s5 = void 0;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        while (s4 !== peg$FAILED) {
                            s3.push(s4);
                            s4 = peg$currPos;
                            s5 = peg$currPos;
                            peg$silentFails++;
                            if (peg$c189.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c190);
                                }
                            }
                            peg$silentFails--;
                            if (s6 === peg$FAILED) {
                                s5 = void 0;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            if (peg$c189.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c190);
                                }
                            }
                            if (s4 !== peg$FAILED) {
                                s2 = [s2, s3, s4];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                }
            }
            while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = [];
                if (peg$c181.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c182);
                    }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c181.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c182);
                            }
                        }
                    }
                } else {
                    s1 = peg$FAILED;
                }
                if (s1 === peg$FAILED) {
                    s1 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c183) {
                        s2 = peg$c183;
                        peg$currPos += 2;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c184);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = [];
                        s4 = peg$currPos;
                        s5 = peg$currPos;
                        peg$silentFails++;
                        if (input.substr(peg$currPos, 2) === peg$c185) {
                            s6 = peg$c185;
                            peg$currPos += 2;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c186);
                            }
                        }
                        peg$silentFails--;
                        if (s6 === peg$FAILED) {
                            s5 = void 0;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        while (s4 !== peg$FAILED) {
                            s3.push(s4);
                            s4 = peg$currPos;
                            s5 = peg$currPos;
                            peg$silentFails++;
                            if (input.substr(peg$currPos, 2) === peg$c185) {
                                s6 = peg$c185;
                                peg$currPos += 2;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c186);
                                }
                            }
                            peg$silentFails--;
                            if (s6 === peg$FAILED) {
                                s5 = void 0;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c185) {
                                s4 = peg$c185;
                                peg$currPos += 2;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c186);
                                }
                            }
                            if (s4 !== peg$FAILED) {
                                s2 = [s2, s3, s4];
                                s1 = s2;
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                    if (s1 === peg$FAILED) {
                        s1 = peg$currPos;
                        if (input.substr(peg$currPos, 2) === peg$c187) {
                            s2 = peg$c187;
                            peg$currPos += 2;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c188);
                            }
                        }
                        if (s2 !== peg$FAILED) {
                            s3 = [];
                            s4 = peg$currPos;
                            s5 = peg$currPos;
                            peg$silentFails++;
                            if (peg$c189.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c190);
                                }
                            }
                            peg$silentFails--;
                            if (s6 === peg$FAILED) {
                                s5 = void 0;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    s5 = [s5, s6];
                                    s4 = s5;
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                            while (s4 !== peg$FAILED) {
                                s3.push(s4);
                                s4 = peg$currPos;
                                s5 = peg$currPos;
                                peg$silentFails++;
                                if (peg$c189.test(input.charAt(peg$currPos))) {
                                    s6 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s6 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c190);
                                    }
                                }
                                peg$silentFails--;
                                if (s6 === peg$FAILED) {
                                    s5 = void 0;
                                } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                }
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 !== peg$FAILED) {
                                        s5 = [s5, s6];
                                        s4 = s5;
                                    } else {
                                        peg$currPos = s4;
                                        s4 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s4;
                                    s4 = peg$FAILED;
                                }
                            }
                            if (s3 !== peg$FAILED) {
                                if (peg$c189.test(input.charAt(peg$currPos))) {
                                    s4 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c190);
                                    }
                                }
                                if (s4 !== peg$FAILED) {
                                    s2 = [s2, s3, s4];
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseIdentifier() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$currPos;
            peg$silentFails++;
            s2 = peg$parseKeyword();
            peg$silentFails--;
            if (s2 === peg$FAILED) {
                s1 = void 0;
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseLetter();
                if (s2 !== peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = [];
                    s5 = peg$parseLetterOrDigit();
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$parseLetterOrDigit();
                    }
                    if (s4 !== peg$FAILED) {
                        s3 = input.substring(s3, peg$currPos);
                    } else {
                        s3 = s4;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseSpacing();
                        if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c191(s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLetter() {
            var s0;

            if (peg$c192.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c193);
                }
            }
            if (s0 === peg$FAILED) {
                if (peg$c194.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c195);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (peg$c196.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c197);
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseLetterOrDigit() {
            var s0;

            if (peg$c192.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c193);
                }
            }
            if (s0 === peg$FAILED) {
                if (peg$c194.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c195);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (peg$c198.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c199);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (peg$c196.test(input.charAt(peg$currPos))) {
                            s0 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c197);
                            }
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseKeyword() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8) === peg$c154) {
                s1 = peg$c154;
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c155);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c200) {
                    s1 = peg$c200;
                    peg$currPos += 6;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c201);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 7) === peg$c123) {
                        s1 = peg$c123;
                        peg$currPos += 7;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c124);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 5) === peg$c202) {
                            s1 = peg$c202;
                            peg$currPos += 5;
                        } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c203);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c109) {
                                s1 = peg$c109;
                                peg$currPos += 4;
                            } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c110);
                                }
                            }
                            if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 4) === peg$c204) {
                                    s1 = peg$c204;
                                    peg$currPos += 4;
                                } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c205);
                                    }
                                }
                                if (s1 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 5) === peg$c206) {
                                        s1 = peg$c206;
                                        peg$currPos += 5;
                                    } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c207);
                                        }
                                    }
                                    if (s1 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 4) === peg$c113) {
                                            s1 = peg$c113;
                                            peg$currPos += 4;
                                        } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c114);
                                            }
                                        }
                                        if (s1 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 5) === peg$c208) {
                                                s1 = peg$c208;
                                                peg$currPos += 5;
                                            } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c209);
                                                }
                                            }
                                            if (s1 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 5) === peg$c210) {
                                                    s1 = peg$c210;
                                                    peg$currPos += 5;
                                                } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c211);
                                                    }
                                                }
                                                if (s1 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 8) === peg$c212) {
                                                        s1 = peg$c212;
                                                        peg$currPos += 8;
                                                    } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c213);
                                                        }
                                                    }
                                                    if (s1 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 7) === peg$c214) {
                                                            s1 = peg$c214;
                                                            peg$currPos += 7;
                                                        } else {
                                                            s1 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c215);
                                                            }
                                                        }
                                                        if (s1 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 6) === peg$c121) {
                                                                s1 = peg$c121;
                                                                peg$currPos += 6;
                                                            } else {
                                                                s1 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c122);
                                                                }
                                                            }
                                                            if (s1 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 2) === peg$c216) {
                                                                    s1 = peg$c216;
                                                                    peg$currPos += 2;
                                                                } else {
                                                                    s1 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c217);
                                                                    }
                                                                }
                                                                if (s1 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 4) === peg$c218) {
                                                                        s1 = peg$c218;
                                                                        peg$currPos += 4;
                                                                    } else {
                                                                        s1 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                            peg$fail(peg$c219);
                                                                        }
                                                                    }
                                                                    if (s1 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 4) === peg$c220) {
                                                                            s1 = peg$c220;
                                                                            peg$currPos += 4;
                                                                        } else {
                                                                            s1 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                                peg$fail(peg$c221);
                                                                            }
                                                                        }
                                                                        if (s1 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 7) === peg$c222) {
                                                                                s1 = peg$c222;
                                                                                peg$currPos += 7;
                                                                            } else {
                                                                                s1 = peg$FAILED;
                                                                                if (peg$silentFails === 0) {
                                                                                    peg$fail(peg$c223);
                                                                                }
                                                                            }
                                                                            if (s1 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 5) === peg$c224) {
                                                                                    s1 = peg$c224;
                                                                                    peg$currPos += 5;
                                                                                } else {
                                                                                    s1 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$c225);
                                                                                    }
                                                                                }
                                                                                if (s1 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 7) === peg$c226) {
                                                                                        s1 = peg$c226;
                                                                                        peg$currPos += 7;
                                                                                    } else {
                                                                                        s1 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) {
                                                                                            peg$fail(peg$c227);
                                                                                        }
                                                                                    }
                                                                                    if (s1 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 5) === peg$c156) {
                                                                                            s1 = peg$c156;
                                                                                            peg$currPos += 5;
                                                                                        } else {
                                                                                            s1 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) {
                                                                                                peg$fail(peg$c157);
                                                                                            }
                                                                                        }
                                                                                        if (s1 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 5) === peg$c119) {
                                                                                                s1 = peg$c119;
                                                                                                peg$currPos += 5;
                                                                                            } else {
                                                                                                s1 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) {
                                                                                                    peg$fail(peg$c120);
                                                                                                }
                                                                                            }
                                                                                            if (s1 === peg$FAILED) {
                                                                                                if (input.substr(peg$currPos, 3) === peg$c228) {
                                                                                                    s1 = peg$c228;
                                                                                                    peg$currPos += 3;
                                                                                                } else {
                                                                                                    s1 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) {
                                                                                                        peg$fail(peg$c229);
                                                                                                    }
                                                                                                }
                                                                                                if (s1 === peg$FAILED) {
                                                                                                    if (input.substr(peg$currPos, 4) === peg$c230) {
                                                                                                        s1 = peg$c230;
                                                                                                        peg$currPos += 4;
                                                                                                    } else {
                                                                                                        s1 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) {
                                                                                                            peg$fail(peg$c231);
                                                                                                        }
                                                                                                    }
                                                                                                    if (s1 === peg$FAILED) {
                                                                                                        if (input.substr(peg$currPos, 2) === peg$c232) {
                                                                                                            s1 = peg$c232;
                                                                                                            peg$currPos += 2;
                                                                                                        } else {
                                                                                                            s1 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) {
                                                                                                                peg$fail(peg$c233);
                                                                                                            }
                                                                                                        }
                                                                                                        if (s1 === peg$FAILED) {
                                                                                                            if (input.substr(peg$currPos, 10) === peg$c234) {
                                                                                                                s1 = peg$c234;
                                                                                                                peg$currPos += 10;
                                                                                                            } else {
                                                                                                                s1 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) {
                                                                                                                    peg$fail(peg$c235);
                                                                                                                }
                                                                                                            }
                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                if (input.substr(peg$currPos, 6) === peg$c236) {
                                                                                                                    s1 = peg$c236;
                                                                                                                    peg$currPos += 6;
                                                                                                                } else {
                                                                                                                    s1 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                        peg$fail(peg$c237);
                                                                                                                    }
                                                                                                                }
                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                    if (input.substr(peg$currPos, 9) === peg$c238) {
                                                                                                                        s1 = peg$c238;
                                                                                                                        peg$currPos += 9;
                                                                                                                    } else {
                                                                                                                        s1 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                            peg$fail(peg$c239);
                                                                                                                        }
                                                                                                                    }
                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                        if (input.substr(peg$currPos, 3) === peg$c115) {
                                                                                                                            s1 = peg$c115;
                                                                                                                            peg$currPos += 3;
                                                                                                                        } else {
                                                                                                                            s1 = peg$FAILED;
                                                                                                                            if (peg$silentFails === 0) {
                                                                                                                                peg$fail(peg$c116);
                                                                                                                            }
                                                                                                                        }
                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                            if (input.substr(peg$currPos, 10) === peg$c240) {
                                                                                                                                s1 = peg$c240;
                                                                                                                                peg$currPos += 10;
                                                                                                                            } else {
                                                                                                                                s1 = peg$FAILED;
                                                                                                                                if (peg$silentFails === 0) {
                                                                                                                                    peg$fail(peg$c241);
                                                                                                                                }
                                                                                                                            }
                                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                                if (input.substr(peg$currPos, 4) === peg$c117) {
                                                                                                                                    s1 = peg$c117;
                                                                                                                                    peg$currPos += 4;
                                                                                                                                } else {
                                                                                                                                    s1 = peg$FAILED;
                                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                                        peg$fail(peg$c118);
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                                    if (input.substr(peg$currPos, 6) === peg$c158) {
                                                                                                                                        s1 = peg$c158;
                                                                                                                                        peg$currPos += 6;
                                                                                                                                    } else {
                                                                                                                                        s1 = peg$FAILED;
                                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                                            peg$fail(peg$c159);
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                                        if (input.substr(peg$currPos, 3) === peg$c242) {
                                                                                                                                            s1 = peg$c242;
                                                                                                                                            peg$currPos += 3;
                                                                                                                                        } else {
                                                                                                                                            s1 = peg$FAILED;
                                                                                                                                            if (peg$silentFails === 0) {
                                                                                                                                                peg$fail(peg$c243);
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                                            if (input.substr(peg$currPos, 4) === peg$c244) {
                                                                                                                                                s1 = peg$c244;
                                                                                                                                                peg$currPos += 4;
                                                                                                                                            } else {
                                                                                                                                                s1 = peg$FAILED;
                                                                                                                                                if (peg$silentFails === 0) {
                                                                                                                                                    peg$fail(peg$c245);
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                                                if (input.substr(peg$currPos, 7) === peg$c246) {
                                                                                                                                                    s1 = peg$c246;
                                                                                                                                                    peg$currPos += 7;
                                                                                                                                                } else {
                                                                                                                                                    s1 = peg$FAILED;
                                                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                                                        peg$fail(peg$c247);
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                                                    if (input.substr(peg$currPos, 7) === peg$c150) {
                                                                                                                                                        s1 = peg$c150;
                                                                                                                                                        peg$currPos += 7;
                                                                                                                                                    } else {
                                                                                                                                                        s1 = peg$FAILED;
                                                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                                                            peg$fail(peg$c151);
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                                                        if (input.substr(peg$currPos, 9) === peg$c148) {
                                                                                                                                                            s1 = peg$c148;
                                                                                                                                                            peg$currPos += 9;
                                                                                                                                                        } else {
                                                                                                                                                            s1 = peg$FAILED;
                                                                                                                                                            if (peg$silentFails === 0) {
                                                                                                                                                                peg$fail(peg$c149);
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                                                            if (input.substr(peg$currPos, 6) === peg$c146) {
                                                                                                                                                                s1 = peg$c146;
                                                                                                                                                                peg$currPos += 6;
                                                                                                                                                            } else {
                                                                                                                                                                s1 = peg$FAILED;
                                                                                                                                                                if (peg$silentFails === 0) {
                                                                                                                                                                    peg$fail(peg$c147);
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                                                                if (input.substr(peg$currPos, 6) === peg$c248) {
                                                                                                                                                                    s1 = peg$c248;
                                                                                                                                                                    peg$currPos += 6;
                                                                                                                                                                } else {
                                                                                                                                                                    s1 = peg$FAILED;
                                                                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                                                                        peg$fail(peg$c249);
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                                                                    if (input.substr(peg$currPos, 5) === peg$c111) {
                                                                                                                                                                        s1 = peg$c111;
                                                                                                                                                                        peg$currPos += 5;
                                                                                                                                                                    } else {
                                                                                                                                                                        s1 = peg$FAILED;
                                                                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                                                                            peg$fail(peg$c112);
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                                                                        if (input.substr(peg$currPos, 6) === peg$c152) {
                                                                                                                                                                            s1 = peg$c152;
                                                                                                                                                                            peg$currPos += 6;
                                                                                                                                                                        } else {
                                                                                                                                                                            s1 = peg$FAILED;
                                                                                                                                                                            if (peg$silentFails === 0) {
                                                                                                                                                                                peg$fail(peg$c153);
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                                                                            if (input.substr(peg$currPos, 8) === peg$c166) {
                                                                                                                                                                                s1 = peg$c166;
                                                                                                                                                                                peg$currPos += 8;
                                                                                                                                                                            } else {
                                                                                                                                                                                s1 = peg$FAILED;
                                                                                                                                                                                if (peg$silentFails === 0) {
                                                                                                                                                                                    peg$fail(peg$c167);
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                                                                                if (input.substr(peg$currPos, 5) === peg$c250) {
                                                                                                                                                                                    s1 = peg$c250;
                                                                                                                                                                                    peg$currPos += 5;
                                                                                                                                                                                } else {
                                                                                                                                                                                    s1 = peg$FAILED;
                                                                                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                                                                                        peg$fail(peg$c251);
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                                                                                    if (input.substr(peg$currPos, 6) === peg$c252) {
                                                                                                                                                                                        s1 = peg$c252;
                                                                                                                                                                                        peg$currPos += 6;
                                                                                                                                                                                    } else {
                                                                                                                                                                                        s1 = peg$FAILED;
                                                                                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                                                                                            peg$fail(peg$c253);
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                                                                                        if (input.substr(peg$currPos, 12) === peg$c160) {
                                                                                                                                                                                            s1 = peg$c160;
                                                                                                                                                                                            peg$currPos += 12;
                                                                                                                                                                                        } else {
                                                                                                                                                                                            s1 = peg$FAILED;
                                                                                                                                                                                            if (peg$silentFails === 0) {
                                                                                                                                                                                                peg$fail(peg$c161);
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                                                                                            if (input.substr(peg$currPos, 4) === peg$c254) {
                                                                                                                                                                                                s1 = peg$c254;
                                                                                                                                                                                                peg$currPos += 4;
                                                                                                                                                                                            } else {
                                                                                                                                                                                                s1 = peg$FAILED;
                                                                                                                                                                                                if (peg$silentFails === 0) {
                                                                                                                                                                                                    peg$fail(peg$c255);
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                                                                                                if (input.substr(peg$currPos, 6) === peg$c256) {
                                                                                                                                                                                                    s1 = peg$c256;
                                                                                                                                                                                                    peg$currPos += 6;
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    s1 = peg$FAILED;
                                                                                                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                                                                                                        peg$fail(peg$c257);
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                                                                                                    if (input.substr(peg$currPos, 5) === peg$c258) {
                                                                                                                                                                                                        s1 = peg$c258;
                                                                                                                                                                                                        peg$currPos += 5;
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        s1 = peg$FAILED;
                                                                                                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                                                                                                            peg$fail(peg$c259);
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                                                                                                        if (input.substr(peg$currPos, 9) === peg$c162) {
                                                                                                                                                                                                            s1 = peg$c162;
                                                                                                                                                                                                            peg$currPos += 9;
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                            s1 = peg$FAILED;
                                                                                                                                                                                                            if (peg$silentFails === 0) {
                                                                                                                                                                                                                peg$fail(peg$c163);
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                                                                                                            if (input.substr(peg$currPos, 4) === peg$c260) {
                                                                                                                                                                                                                s1 = peg$c260;
                                                                                                                                                                                                                peg$currPos += 4;
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                s1 = peg$FAILED;
                                                                                                                                                                                                                if (peg$silentFails === 0) {
                                                                                                                                                                                                                    peg$fail(peg$c261);
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                                                                                                                if (input.substr(peg$currPos, 3) === peg$c262) {
                                                                                                                                                                                                                    s1 = peg$c262;
                                                                                                                                                                                                                    peg$currPos += 3;
                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                    s1 = peg$FAILED;
                                                                                                                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                                                                                                                        peg$fail(peg$c263);
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                                                                                                                    if (input.substr(peg$currPos, 4) === peg$c264) {
                                                                                                                                                                                                                        s1 = peg$c264;
                                                                                                                                                                                                                        peg$currPos += 4;
                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                        s1 = peg$FAILED;
                                                                                                                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                                                                                                                            peg$fail(peg$c265);
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                                                                                                                        if (input.substr(peg$currPos, 8) === peg$c164) {
                                                                                                                                                                                                                            s1 = peg$c164;
                                                                                                                                                                                                                            peg$currPos += 8;
                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                            s1 = peg$FAILED;
                                                                                                                                                                                                                            if (peg$silentFails === 0) {
                                                                                                                                                                                                                                peg$fail(peg$c165);
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                                                                                                                            if (input.substr(peg$currPos, 5) === peg$c266) {
                                                                                                                                                                                                                                s1 = peg$c266;
                                                                                                                                                                                                                                peg$currPos += 5;
                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                s1 = peg$FAILED;
                                                                                                                                                                                                                                if (peg$silentFails === 0) {
                                                                                                                                                                                                                                    peg$fail(peg$c267);
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseASSERT() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c200) {
                s1 = peg$c200;
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c201);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBREAK() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c202) {
                s1 = peg$c202;
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c203);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCASE() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c204) {
                s1 = peg$c204;
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c205);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCATCH() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c206) {
                s1 = peg$c206;
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c207);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCLASS() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c208) {
                s1 = peg$c208;
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c209);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCONTINUE() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 8) === peg$c212) {
                s1 = peg$c212;
                peg$currPos += 8;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c213);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDEFAULT() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c214) {
                s1 = peg$c214;
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c215);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDO() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c216) {
                s1 = peg$c216;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c217);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseELSE() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c218) {
                s1 = peg$c218;
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c219);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseENUM() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c220) {
                s1 = peg$c220;
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c221);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEXTENDS() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c222) {
                s1 = peg$c222;
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c223);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFINALLY() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c226) {
                s1 = peg$c226;
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c227);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFINAL() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c156) {
                s1 = peg$c156;
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c157);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFOR() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c228) {
                s1 = peg$c228;
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c229);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseIF() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c232) {
                s1 = peg$c232;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c233);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseIMPLEMENTS() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 10) === peg$c234) {
                s1 = peg$c234;
                peg$currPos += 10;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c235);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseIMPORT() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c236) {
                s1 = peg$c236;
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c237);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseINTERFACE() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9) === peg$c238) {
                s1 = peg$c238;
                peg$currPos += 9;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c239);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseINSTANCEOF() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 10) === peg$c240) {
                s1 = peg$c240;
                peg$currPos += 10;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c241);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseNEW() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c242) {
                s1 = peg$c242;
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c243);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parsePACKAGE() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c246) {
                s1 = peg$c246;
                peg$currPos += 7;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c247);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseRETURN() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c248) {
                s1 = peg$c248;
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c249);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSTATIC() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c152) {
                s1 = peg$c152;
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c153);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSUPER() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c250) {
                s1 = peg$c250;
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c251);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSWITCH() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c252) {
                s1 = peg$c252;
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c253);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSYNCHRONIZED() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 12) === peg$c160) {
                s1 = peg$c160;
                peg$currPos += 12;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c161);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTHIS() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c254) {
                s1 = peg$c254;
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c255);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTHROWS() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c256) {
                s1 = peg$c256;
                peg$currPos += 6;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c257);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTHROW() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c258) {
                s1 = peg$c258;
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c259);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTRY() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c262) {
                s1 = peg$c262;
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c263);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseVOID() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c264) {
                s1 = peg$c264;
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c265);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseWHILE() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 5) === peg$c266) {
                s1 = peg$c266;
                peg$currPos += 5;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c267);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                s3 = peg$parseLetterOrDigit();
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLiteral() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$parseFloatLiteral();
            if (s1 === peg$FAILED) {
                s1 = peg$parseIntegerLiteral();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseCharLiteral();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseStringLiteral();
                        if (s1 === peg$FAILED) {
                            s1 = peg$currPos;
                            if (input.substr(peg$currPos, 4) === peg$c260) {
                                s2 = peg$c260;
                                peg$currPos += 4;
                            } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c261);
                                }
                            }
                            if (s2 !== peg$FAILED) {
                                s3 = peg$currPos;
                                peg$silentFails++;
                                s4 = peg$parseLetterOrDigit();
                                peg$silentFails--;
                                if (s4 === peg$FAILED) {
                                    s3 = void 0;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                                if (s3 !== peg$FAILED) {
                                    peg$savedPos = s1;
                                    s2 = peg$c268();
                                    s1 = s2;
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                            if (s1 === peg$FAILED) {
                                s1 = peg$currPos;
                                if (input.substr(peg$currPos, 5) === peg$c224) {
                                    s2 = peg$c224;
                                    peg$currPos += 5;
                                } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c225);
                                    }
                                }
                                if (s2 !== peg$FAILED) {
                                    s3 = peg$currPos;
                                    peg$silentFails++;
                                    s4 = peg$parseLetterOrDigit();
                                    peg$silentFails--;
                                    if (s4 === peg$FAILED) {
                                        s3 = void 0;
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                    if (s3 !== peg$FAILED) {
                                        peg$savedPos = s1;
                                        s2 = peg$c269();
                                        s1 = s2;
                                    } else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                                if (s1 === peg$FAILED) {
                                    s1 = peg$currPos;
                                    if (input.substr(peg$currPos, 4) === peg$c244) {
                                        s2 = peg$c244;
                                        peg$currPos += 4;
                                    } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c245);
                                        }
                                    }
                                    if (s2 !== peg$FAILED) {
                                        s3 = peg$currPos;
                                        peg$silentFails++;
                                        s4 = peg$parseLetterOrDigit();
                                        peg$silentFails--;
                                        if (s4 === peg$FAILED) {
                                            s3 = void 0;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                        if (s3 !== peg$FAILED) {
                                            peg$savedPos = s1;
                                            s2 = peg$c270();
                                            s1 = s2;
                                        } else {
                                            peg$currPos = s1;
                                            s1 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c271(s1);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseIntegerLiteral() {
            var s0, s1, s2;

            s0 = peg$currPos;
            s1 = peg$parseHexNumeral();
            if (s1 === peg$FAILED) {
                s1 = peg$parseBinaryNumeral();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseOctalNumeral();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseDecimalNumeral();
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c272.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c273);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c274();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDecimalNumeral() {
            var s0, s1, s2, s3, s4, s5;

            if (input.charCodeAt(peg$currPos) === 48) {
                s0 = peg$c275;
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c276);
                }
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (peg$c277.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c278);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$currPos;
                    s4 = [];
                    if (peg$c279.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c280);
                        }
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c279.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c280);
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (peg$c198.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c199);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = [];
                        if (peg$c279.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c280);
                            }
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            if (peg$c279.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c280);
                                }
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            if (peg$c198.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c199);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseHexNumeral() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c281) {
                s1 = peg$c281;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c282);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c283) {
                    s1 = peg$c283;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c284);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseHexDigits();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBinaryNumeral() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c285) {
                s1 = peg$c285;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c286);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c287) {
                    s1 = peg$c287;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c288);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c289.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c290);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$currPos;
                    s5 = [];
                    if (peg$c279.test(input.charAt(peg$currPos))) {
                        s6 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s6 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c280);
                        }
                    }
                    while (s6 !== peg$FAILED) {
                        s5.push(s6);
                        if (peg$c279.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c280);
                            }
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        if (peg$c289.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c290);
                            }
                        }
                        if (s6 !== peg$FAILED) {
                            s5 = [s5, s6];
                            s4 = s5;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$currPos;
                        s5 = [];
                        if (peg$c279.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c280);
                            }
                        }
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            if (peg$c279.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c280);
                                }
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            if (peg$c289.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c290);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s5 = [s5, s6];
                                s4 = s5;
                            } else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseOctalNumeral() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 48) {
                s1 = peg$c275;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c276);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = [];
                if (peg$c279.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c280);
                    }
                }
                while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    if (peg$c279.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c280);
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    if (peg$c291.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c292);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 !== peg$FAILED) {
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$currPos;
                        s4 = [];
                        if (peg$c279.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c280);
                            }
                        }
                        while (s5 !== peg$FAILED) {
                            s4.push(s5);
                            if (peg$c279.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c280);
                                }
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            if (peg$c291.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c292);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                } else {
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseFloatLiteral() {
            var s0, s1;

            s0 = peg$currPos;
            s1 = peg$parseHexFloat();
            if (s1 === peg$FAILED) {
                s1 = peg$parseDecimalFloat();
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c274();
            }
            s0 = s1;

            return s0;
        }

        function peg$parseDecimalFloat() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseDigits();
            if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 46) {
                    s2 = peg$c293;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c294);
                    }
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDigits();
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseExponent();
                        if (s4 === peg$FAILED) {
                            s4 = null;
                        }
                        if (s4 !== peg$FAILED) {
                            if (peg$c295.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c296);
                                }
                            }
                            if (s5 === peg$FAILED) {
                                s5 = null;
                            }
                            if (s5 !== peg$FAILED) {
                                s1 = [s1, s2, s3, s4, s5];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 46) {
                    s1 = peg$c293;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c294);
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseDigits();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseExponent();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            if (peg$c295.test(input.charAt(peg$currPos))) {
                                s4 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c296);
                                }
                            }
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                s1 = [s1, s2, s3, s4];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseDigits();
                    if (s1 !== peg$FAILED) {
                        s2 = peg$parseExponent();
                        if (s2 !== peg$FAILED) {
                            if (peg$c295.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c296);
                                }
                            }
                            if (s3 === peg$FAILED) {
                                s3 = null;
                            }
                            if (s3 !== peg$FAILED) {
                                s1 = [s1, s2, s3];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseDigits();
                        if (s1 !== peg$FAILED) {
                            s2 = peg$parseExponent();
                            if (s2 === peg$FAILED) {
                                s2 = null;
                            }
                            if (s2 !== peg$FAILED) {
                                if (peg$c295.test(input.charAt(peg$currPos))) {
                                    s3 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s3 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c296);
                                    }
                                }
                                if (s3 !== peg$FAILED) {
                                    s1 = [s1, s2, s3];
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseExponent() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (peg$c297.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c298);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c299.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c300);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDigits();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseHexFloat() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$parseHexSignificand();
            if (s1 !== peg$FAILED) {
                s2 = peg$parseBinaryExponent();
                if (s2 !== peg$FAILED) {
                    if (peg$c295.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c296);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseHexSignificand() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c281) {
                s1 = peg$c281;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c282);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c283) {
                    s1 = peg$c283;
                    peg$currPos += 2;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c284);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseHexDigits();
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s3 = peg$c293;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c294);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseHexDigits();
                        if (s4 !== peg$FAILED) {
                            s1 = [s1, s2, s3, s4];
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseHexNumeral();
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 46) {
                        s2 = peg$c293;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c294);
                        }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }

            return s0;
        }

        function peg$parseBinaryExponent() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (peg$c301.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c302);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c299.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c300);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = null;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseDigits();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDigits() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            if (peg$c198.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c199);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = [];
                if (peg$c279.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c280);
                    }
                }
                while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    if (peg$c279.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c280);
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    if (peg$c198.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c199);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = [];
                    if (peg$c279.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c280);
                        }
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c279.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c280);
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (peg$c198.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c199);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseHexDigits() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$parseHexDigit();
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$currPos;
                s4 = [];
                if (peg$c279.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c280);
                    }
                }
                while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    if (peg$c279.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c280);
                        }
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseHexDigit();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$currPos;
                    s4 = [];
                    if (peg$c279.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c280);
                        }
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c279.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c280);
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseHexDigit();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseHexDigit() {
            var s0;

            if (peg$c303.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c304);
                }
            }
            if (s0 === peg$FAILED) {
                if (peg$c305.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c306);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (peg$c198.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c199);
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseCharLiteral() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 39) {
                s1 = peg$c307;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c308);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseEscape();
                if (s2 === peg$FAILED) {
                    s2 = peg$currPos;
                    s3 = peg$currPos;
                    peg$silentFails++;
                    if (peg$c309.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c310);
                        }
                    }
                    peg$silentFails--;
                    if (s4 === peg$FAILED) {
                        s3 = void 0;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 !== peg$FAILED) {
                            s3 = [s3, s4];
                            s2 = s3;
                        } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 39) {
                        s3 = peg$c307;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c308);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c311();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseStringLiteral() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 34) {
                s1 = peg$c312;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c313);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parseEscape();
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$currPos;
                    peg$silentFails++;
                    if (peg$c314.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c315);
                        }
                    }
                    peg$silentFails--;
                    if (s5 === peg$FAILED) {
                        s4 = void 0;
                    } else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse_();
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseEscape();
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        s4 = peg$currPos;
                        peg$silentFails++;
                        if (peg$c314.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c315);
                            }
                        }
                        peg$silentFails--;
                        if (s5 === peg$FAILED) {
                            s4 = void 0;
                        } else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parse_();
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 34) {
                        s3 = peg$c312;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c313);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c316();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEscape() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
                s1 = peg$c317;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c318);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c319.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c320);
                    }
                }
                if (s2 === peg$FAILED) {
                    s2 = peg$parseOctalEscape();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseUnicodeEscape();
                    }
                }
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseOctalEscape() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (peg$c321.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c322);
                }
            }
            if (s1 !== peg$FAILED) {
                if (peg$c291.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c292);
                    }
                }
                if (s2 !== peg$FAILED) {
                    if (peg$c291.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c292);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (peg$c291.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c292);
                    }
                }
                if (s1 !== peg$FAILED) {
                    if (peg$c291.test(input.charAt(peg$currPos))) {
                        s2 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c292);
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s1 = [s1, s2];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                    if (peg$c291.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c292);
                        }
                    }
                }
            }

            return s0;
        }

        function peg$parseUnicodeEscape() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = [];
            if (input.charCodeAt(peg$currPos) === 117) {
                s2 = peg$c323;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c324);
                }
            }
            if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    if (input.charCodeAt(peg$currPos) === 117) {
                        s2 = peg$c323;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c324);
                        }
                    }
                }
            } else {
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseHexDigit();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseHexDigit();
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parseHexDigit();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseHexDigit();
                            if (s5 !== peg$FAILED) {
                                s1 = [s1, s2, s3, s4, s5];
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAT() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 64) {
                s1 = peg$c325;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c326);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseAND() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 38) {
                s1 = peg$c327;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c328);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (peg$c329.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c330);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseANDAND() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c331) {
                s1 = peg$c331;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c332);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseANDEQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c333) {
                s1 = peg$c333;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c334);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBANG() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 33) {
                s1 = peg$c335;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c336);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBSR() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c339) {
                s1 = peg$c339;
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c340);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseBSREQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c341) {
                s1 = peg$c341;
                peg$currPos += 4;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c342);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCOLON() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
                s1 = peg$c343;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c344);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseCOMMA() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
                s1 = peg$c345;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c346);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDEC() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c347) {
                s1 = peg$c347;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c348);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDIV() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 47) {
                s1 = peg$c349;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c350);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDIVEQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c351) {
                s1 = peg$c351;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c352);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseDOT() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
                s1 = peg$c293;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c294);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseELLIPSIS() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c353) {
                s1 = peg$c353;
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c354);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEQU() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 61) {
                s1 = peg$c337;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c338);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEQUAL() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c355) {
                s1 = peg$c355;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c356);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseGE() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c357) {
                s1 = peg$c357;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c358);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseGT() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 62) {
                s1 = peg$c359;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c360);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (peg$c361.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c362);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseHAT() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 94) {
                s1 = peg$c363;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c364);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseHATEQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c365) {
                s1 = peg$c365;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c366);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseINC() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c367) {
                s1 = peg$c367;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c368);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLBRK() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
                s1 = peg$c369;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c370);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLE() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c371) {
                s1 = peg$c371;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c372);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLPAR() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 40) {
                s1 = peg$c373;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c374);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLPOINT() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 60) {
                s1 = peg$c375;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c376);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLT() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 60) {
                s1 = peg$c375;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c376);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (peg$c377.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c378);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseLWING() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 123) {
                s1 = peg$c379;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c380);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseMINUS() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 45) {
                s1 = peg$c381;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c382);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (peg$c383.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c384);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseMINUSEQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c385) {
                s1 = peg$c385;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c386);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseMOD() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 37) {
                s1 = peg$c387;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c388);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseMODEQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c389) {
                s1 = peg$c389;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c390);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseNOTEQUAL() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c391) {
                s1 = peg$c391;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c392);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseOR() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 124) {
                s1 = peg$c393;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c394);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (peg$c395.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c396);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseOREQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c397) {
                s1 = peg$c397;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c398);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseOROR() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c399) {
                s1 = peg$c399;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c400);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parsePLUS() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 43) {
                s1 = peg$c401;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c402);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (peg$c403.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c404);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parsePLUSEQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c405) {
                s1 = peg$c405;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c406);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseQUERY() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 63) {
                s1 = peg$c407;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c408);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseRBRK() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 93) {
                s1 = peg$c409;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c410);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseRPAR() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 41) {
                s1 = peg$c411;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c412);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseRPOINT() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 62) {
                s1 = peg$c359;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c360);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseRWING() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 125) {
                s1 = peg$c413;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c414);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSEMI() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 59) {
                s1 = peg$c415;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c416);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSL() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c417) {
                s1 = peg$c417;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c418);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSLEQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c419) {
                s1 = peg$c419;
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c420);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSR() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c421) {
                s1 = peg$c421;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c422);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (peg$c361.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c362);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSREQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c423) {
                s1 = peg$c423;
                peg$currPos += 3;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c424);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSTAR() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c425;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c426);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s3 = peg$c337;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c338);
                    }
                }
                peg$silentFails--;
                if (s3 === peg$FAILED) {
                    s2 = void 0;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseSpacing();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseSTAREQU() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c427) {
                s1 = peg$c427;
                peg$currPos += 2;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c428);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseTILDA() {
            var s0, s1, s2;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 126) {
                s1 = peg$c429;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c430);
                }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parseSpacing();
                if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parseEOT() {
            var s0, s1;

            s0 = peg$currPos;
            peg$silentFails++;
            s1 = peg$parse_();
            peg$silentFails--;
            if (s1 === peg$FAILED) {
                s0 = void 0;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }

            return s0;
        }

        function peg$parse_() {
            var s0;

            if (input.length > peg$currPos) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c431);
                }
            }

            return s0;
        }

        function extractOptional(optional, index, def) {
            def = typeof def !== 'undefined' ? def : null;
            return optional ? optional[index] : def;
        }

        function extractList(list, index) {
            var result = new Array(list.length), i;

            for (i = 0; i < list.length; i++) {
                result[i] = list[i][index];
            }

            return result;
        }

        function buildList(first, rest, index) {
            return [first].concat(extractList(rest, index));
        }

        function buildTree(first, rest, builder) {
            var result = first, i;

            for (i = 0; i < rest.length; i++) {
                result = builder(result, rest[i]);
            }

            return result;
        }

        function buildInfixExpr(first, rest) {
            return buildTree(first, rest, function (result, element) {
                return {
                    node: 'InfixExpression',
                    operator: element[0][0], // remove ending Spacing
                    leftOperand: result,
                    rightOperand: element[1]
                };
            });
        }

        function buildQualified(first, rest, index) {
            return buildTree(first, rest,
                function (result, element) {
                    return {
                        node: 'QualifiedName',
                        qualifier: result,
                        name: element[index]
                    };
                }
            );
        }

        function popQualified(tree) {
            return tree.node === 'QualifiedName'
                ? {name: tree.name, expression: tree.qualifier}
                : {name: tree, expression: null};
        }

        function extractThrowsClassType(list) {
            return list.map(function (node) {
                return node.name;
            });
        }

        function extractExpressions(list) {
            return list.map(function (node) {
                return node.expression;
            });
        }

        function buildArrayTree(first, rest) {
            return buildTree(first, rest,
                function (result, element) {
                    return {
                        node: 'ArrayType',
                        componentType: result
                    };
                });
        }

        function optionalList(value) {
            return value !== null ? value : [];
        }

        function extractOptionalList(list, index) {
            return optionalList(extractOptional(list, index));
        }

        function skipNulls(list) {
            return list.filter(function (v) {
                return v !== null;
            });
        }

        function makePrimitive(code) {
            return {
                node: 'PrimitiveType',
                primitiveTypeCode: code
            }
        }

        function makeModifier(keyword) {
            return {
                node: 'Modifier',
                keyword: keyword
            };
        }

        function makeCatchFinally(catchClauses, finallyBlock) {
            return {
                catchClauses: catchClauses,
                finally: finallyBlock
            };
        }

        function buildTypeName(qual, args, rest) {
            var first = args === null ? {
                node: 'SimpleType',
                name: qual
            } : {
                node: 'ParameterizedType',
                type: {
                    node: 'SimpleType',
                    name: qual
                },
                typeArguments: args
            };

            return buildTree(first, rest,
                function (result, element) {
                    var args = element[2];
                    return args === null ? {
                        node: 'QualifiedType',
                        name: element[1],
                        qualifier: result
                    } :
                        {
                            node: 'ParameterizedType',
                            type: {
                                node: 'QualifiedType',
                                name: element[1],
                                qualifier: result
                            },
                            typeArguments: args
                        };
                }
            );
        }

        function mergeProps(obj, props) {
            var key;
            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    if (obj.hasOwnProperty(key)) {
                        throw new Error(
                            'Property ' + key + ' exists ' + line() + '\n' + text() +
                            '\nCurrent value: ' + JSON.stringify(obj[key], null, 2) +
                            '\nNew value: ' + JSON.stringify(props[key], null, 2)
                        );
                    } else {
                        obj[key] = props[key];
                    }
                }
            }
            return obj;
        }

        function buildSelectorTree(arg, sel, sels) {
            function getMergeVal(o, v) {
                switch (o.node) {
                    case 'SuperFieldAccess':
                    case 'SuperMethodInvocation':
                        return {qualifier: v};
                    case 'ArrayAccess':
                        return {array: v};
                    default:
                        return {expression: v};
                }
            }

            return buildTree(mergeProps(sel, getMergeVal(sel, arg)),
                sels, function (result, element) {
                    return mergeProps(element, getMergeVal(element, result));
                });
        }

        function TODO() {
            throw new Error('TODO: not impl line ' + line() + '\n' + text());
        }

        peg$result = peg$startRuleFunction();

        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
            return peg$result;
        } else {
            if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                peg$fail(peg$endExpectation());
            }

            throw peg$buildStructuredError(
                peg$maxFailExpected,
                peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
                peg$maxFailPos < input.length
                    ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
                    : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
            );
        }
    }

    return {
        SyntaxError: peg$SyntaxError,
        parse:       peg$parse
    }
}()
});