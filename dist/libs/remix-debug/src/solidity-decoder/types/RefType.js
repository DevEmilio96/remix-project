'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("./util");
class RefType {
    constructor(storageSlots, storageBytes, typeName, location) {
        this.location = location;
        this.storageSlots = storageSlots;
        this.storageBytes = storageBytes;
        this.typeName = typeName;
        this.basicType = 'RefType';
    }
    decodeFromStorage(input1, input2) {
        throw new Error('This method is abstract');
    }
    decodeFromMemoryInternal(input1, input2, input3) {
        throw new Error('This method is abstract');
    }
    /**
      * decode the type from the stack
      *
      * @param {Int} stackDepth - position of the type in the stack
      * @param {Array} stack - stack
      * @param {String} - memory
      * @param {Object} - storageResolver
      * @return {Object} decoded value
      */
    decodeFromStack(stackDepth, stack, memory, storageResolver, cursor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (stack.length - 1 < stackDepth) {
                return { error: '<decoding failed - stack underflow ' + stackDepth + '>', type: this.typeName };
            }
            let offset = stack[stack.length - 1 - stackDepth];
            if (this.isInStorage()) {
                offset = util_1.toBN(offset);
                try {
                    return yield this.decodeFromStorage({ offset: 0, slot: offset }, storageResolver);
                }
                catch (e) {
                    console.log(e);
                    return { error: '<decoding failed - ' + e.message + '>', type: this.typeName };
                }
            }
            else if (this.isInMemory()) {
                offset = parseInt(offset, 16);
                return this.decodeFromMemoryInternal(offset, memory, cursor);
            }
            else {
                return { error: '<decoding failed - no decoder for ' + this.location + '>', type: this.typeName };
            }
        });
    }
    /**
      * decode the type from the memory
      *
      * @param {Int} offset - position of the ref of the type in memory
      * @param {String} memory - memory
      * @return {Object} decoded value
      */
    decodeFromMemory(offset, memory) {
        offset = memory.substr(2 * offset, 64);
        offset = parseInt(offset, 16);
        return this.decodeFromMemoryInternal(offset, memory);
    }
    /**
      * current type defined in storage
      *
      * @return {Bool} - return true if the type is defined in the storage
      */
    isInStorage() {
        return this.location.indexOf('storage') === 0;
    }
    /**
      * current type defined in memory
      *
      * @return {Bool} - return true if the type is defined in the memory
      */
    isInMemory() {
        return this.location.indexOf('memory') === 0;
    }
}
exports.RefType = RefType;
//# sourceMappingURL=RefType.js.map