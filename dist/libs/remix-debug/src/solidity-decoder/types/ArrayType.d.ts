import { RefType } from './RefType';
export declare class ArrayType extends RefType {
    underlyingType: any;
    arraySize: any;
    constructor(underlyingType: any, arraySize: any, location: any);
    decodeFromStorage(location: any, storageResolver: any): Promise<{
        value: string;
        type: any;
        length?: undefined;
    } | {
        value: any[];
        length: string;
        type: any;
    }>;
    decodeFromMemoryInternal(offset: any, memory: any, skip: any): {
        value: string;
        type: string;
        length?: undefined;
        cursor?: undefined;
        hasNext?: undefined;
    } | {
        value: any[];
        length: string;
        type: any;
        cursor: any;
        hasNext: boolean;
    };
}
