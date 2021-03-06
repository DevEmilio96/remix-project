export declare function resolveCalledAddress(vmTraceIndex: any, trace: any): string;
export declare function isCallInstruction(step: any): boolean;
export declare function isCreateInstruction(step: any): boolean;
export declare function isReturnInstruction(step: any): boolean;
export declare function isJumpDestInstruction(step: any): boolean;
export declare function isStopInstruction(step: any): boolean;
export declare function isRevertInstruction(step: any): boolean;
export declare function isSSTOREInstruction(step: any): boolean;
export declare function isSHA3Instruction(step: any): boolean;
export declare function newContextStorage(step: any): boolean;
export declare function isCallToPrecompiledContract(index: any, trace: any): boolean;
export declare function contractCreationToken(index: any): string;
export declare function isContractCreation(address: any): boolean;
