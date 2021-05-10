"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const categories_1 = tslib_1.__importDefault(require("./categories"));
const staticAnalysisCommon_1 = require("./staticAnalysisCommon");
const algorithmCategories_1 = tslib_1.__importDefault(require("./algorithmCategories"));
const functionCallGraph_1 = require("./functionCallGraph");
const abstractAstView_1 = tslib_1.__importDefault(require("./abstractAstView"));
class constantFunctions {
    constructor() {
        this.name = 'Constant/View/Pure functions: ';
        this.description = 'Potentially constant/view/pure functions';
        this.category = categories_1.default.MISC;
        this.algorithm = algorithmCategories_1.default.HEURISTIC;
        this.version = {
            start: '0.4.12'
        };
        this.abstractAst = new abstractAstView_1.default();
        this.visit = this.abstractAst.build_visit((node) => staticAnalysisCommon_1.isLowLevelCall(node) ||
            staticAnalysisCommon_1.isTransfer(node) ||
            staticAnalysisCommon_1.isExternalDirectCall(node) ||
            staticAnalysisCommon_1.isEffect(node) ||
            staticAnalysisCommon_1.isLocalCallGraphRelevantNode(node) ||
            node.nodeType === 'InlineAssembly' ||
            node.nodeType === 'NewExpression' ||
            staticAnalysisCommon_1.isSelfdestructCall(node) ||
            staticAnalysisCommon_1.isDeleteUnaryOperation(node));
        this.report = this.abstractAst.build_report(this._report.bind(this));
    }
    _report(contracts, multipleContractsWithSameName, version) {
        const warnings = [];
        const hasModifiers = contracts.some((item) => item.modifiers.length > 0);
        const callGraph = functionCallGraph_1.buildGlobalFuncCallGraph(contracts);
        contracts.forEach((contract) => {
            contract.functions.forEach((func) => {
                if (staticAnalysisCommon_1.isPayableFunction(func.node) || staticAnalysisCommon_1.isConstructor(func.node)) {
                    func['potentiallyshouldBeConst'] = false;
                }
                else {
                    func['potentiallyshouldBeConst'] = this.checkIfShouldBeConstant(staticAnalysisCommon_1.getFullQuallyfiedFuncDefinitionIdent(contract.node, func.node, func.parameters), this.getContext(callGraph, contract, func));
                }
            });
            contract.functions.filter((func) => staticAnalysisCommon_1.hasFunctionBody(func.node)).forEach((func) => {
                if (staticAnalysisCommon_1.isConstantFunction(func.node) !== func['potentiallyshouldBeConst']) {
                    const funcName = staticAnalysisCommon_1.getFullQuallyfiedFuncDefinitionIdent(contract.node, func.node, func.parameters);
                    let comments = (hasModifiers) ? 'Note: Modifiers are currently not considered by this static analysis.' : '';
                    comments += (multipleContractsWithSameName) ? 'Note: Import aliases are currently not supported by this static analysis.' : '';
                    if (func['potentiallyshouldBeConst']) {
                        warnings.push({
                            warning: `${funcName} : Potentially should be constant/view/pure but is not. ${comments}`,
                            location: func.node.src,
                            more: `https://solidity.readthedocs.io/en/${version}/contracts.html#view-functions`
                        });
                    }
                    else {
                        warnings.push({
                            warning: `${funcName} : Is constant but potentially should not be. ${comments}`,
                            location: func.node.src,
                            more: `https://solidity.readthedocs.io/en/${version}/contracts.html#view-functions`
                        });
                    }
                }
            });
        });
        return warnings;
    }
    getContext(callGraph, currentContract, func) {
        return { callGraph: callGraph, currentContract: currentContract, stateVariables: this.getStateVariables(currentContract, func) };
    }
    getStateVariables(contract, func) {
        return contract.stateVariables.concat(func.localVariables.filter(staticAnalysisCommon_1.isStorageVariableDeclaration));
    }
    checkIfShouldBeConstant(startFuncName, context) {
        return !functionCallGraph_1.analyseCallGraph(context.callGraph, startFuncName, context, this.isConstBreaker.bind(this));
    }
    isConstBreaker(node, context) {
        return staticAnalysisCommon_1.isWriteOnStateVariable(node, context.stateVariables) ||
            staticAnalysisCommon_1.isLowLevelCall(node) ||
            staticAnalysisCommon_1.isTransfer(node) ||
            this.isCallOnNonConstExternalInterfaceFunction(node, context) ||
            staticAnalysisCommon_1.isCallToNonConstLocalFunction(node) ||
            node.nodeType === 'InlineAssembly' ||
            node.nodeType === 'NewExpression' ||
            staticAnalysisCommon_1.isSelfdestructCall(node) ||
            staticAnalysisCommon_1.isDeleteUnaryOperation(node);
    }
    isCallOnNonConstExternalInterfaceFunction(node, context) {
        if (staticAnalysisCommon_1.isExternalDirectCall(node)) {
            const func = functionCallGraph_1.resolveCallGraphSymbol(context.callGraph, staticAnalysisCommon_1.getFullQualifiedFunctionCallIdent(context.currentContract.node, node));
            return !func || (func && !staticAnalysisCommon_1.isConstantFunction(func.node.node));
        }
        return false;
    }
}
exports.default = constantFunctions;
//# sourceMappingURL=constantFunctions.js.map