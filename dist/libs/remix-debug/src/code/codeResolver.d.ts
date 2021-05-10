export declare class CodeResolver {
    getCode: any;
    bytecodeByAddress: any;
    instructionsByAddress: any;
    instructionsIndexByBytesOffset: any;
    constructor({ getCode }: {
        getCode: any;
    });
    clear(): void;
    resolveCode(address: any): Promise<{
        instructions: any;
        instructionsIndexByBytesOffset: any;
        bytecode: any;
    }>;
    cacheExecutingCode(address: any, hexCode: any): {
        instructions: any;
        instructionsIndexByBytesOffset: any;
        bytecode: any;
    };
    formatCode(hexCode: any): {
        code: {};
        instructionsIndexByBytesOffset: {};
    };
    getExecutingCodeFromCache(address: any): {
        instructions: any;
        instructionsIndexByBytesOffset: any;
        bytecode: any;
    };
    getInstructionIndex(address: any, pc: any): any;
}
