export declare class RefType {
    location: any;
    storageSlots: any;
    storageBytes: any;
    typeName: any;
    basicType: any;
    constructor(storageSlots: any, storageBytes: any, typeName: any, location: any);
    decodeFromStorage(input1?: any, input2?: any): void;
    decodeFromMemoryInternal(input1?: any, input2?: any, input3?: any): void;
    /**
      * decode the type from the stack
      *
      * @param {Int} stackDepth - position of the type in the stack
      * @param {Array} stack - stack
      * @param {String} - memory
      * @param {Object} - storageResolver
      * @return {Object} decoded value
      */
    decodeFromStack(stackDepth: any, stack: any, memory: any, storageResolver: any, cursor: any): Promise<any>;
    /**
      * decode the type from the memory
      *
      * @param {Int} offset - position of the ref of the type in memory
      * @param {String} memory - memory
      * @return {Object} decoded value
      */
    decodeFromMemory(offset: any, memory: any): void;
    /**
      * current type defined in storage
      *
      * @return {Bool} - return true if the type is defined in the storage
      */
    isInStorage(): boolean;
    /**
      * current type defined in memory
      *
      * @return {Bool} - return true if the type is defined in the memory
      */
    isInMemory(): boolean;
}
