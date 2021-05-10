import { RefType } from './RefType';
export declare class DynamicByteArray extends RefType {
    constructor(location: any);
    decodeFromStorage(location: any, storageResolver: any): Promise<{
        value: string;
        type: any;
        length?: undefined;
    } | {
        value: string;
        length: string;
        type: any;
    }>;
    decodeFromMemoryInternal(offset: any, memory: any): {
        length: string;
        value: string;
        type: any;
    };
}
