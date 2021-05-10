/// <reference types="node" />
import Web3 from 'web3';
import { Web3VmProvider } from '../web3Provider/web3VmProvider';
import VM from '@ethereumjs/vm';
import Common from '@ethereumjs/common';
import StateManager from '@ethereumjs/vm/dist/state/stateManager';
import { StorageDump } from '@ethereumjs/vm/dist/state/interface';
declare class StateManagerCommonStorageDump extends StateManager {
    keyHashes: {
        [key: string]: string;
    };
    constructor();
    putContractStorage(address: any, key: any, value: any): Promise<void>;
    dumpStorage(address: any): Promise<StorageDump>;
    getStateRoot(force?: boolean): Promise<Buffer>;
    setStateRoot(stateRoot: Buffer): Promise<void>;
}
export declare class ExecutionContext {
    event: any;
    logsManager: any;
    blockGasLimitDefault: any;
    blockGasLimit: any;
    customNetWorks: any;
    blocks: any;
    latestBlockNumber: any;
    txs: any;
    executionContext: any;
    listenOnLastBlockId: any;
    currentFork: string;
    vms: any;
    mainNetGenesisHash: string;
    constructor();
    init(config: any): void;
    createVm(hardfork: any): {
        vm: VM;
        web3vm: Web3VmProvider;
        stateManager: StateManagerCommonStorageDump;
        common: Common;
    };
    askPermission(): void;
    getProvider(): any;
    isVM(): boolean;
    web3(): any;
    detectNetwork(callback: any): void;
    removeProvider(name: any): void;
    addProvider(network: any): void;
    internalWeb3(): any;
    blankWeb3(): Web3;
    vm(): any;
    vmObject(): any;
    setContext(context: any, endPointUrl: any, confirmCb: any, infoCb: any): void;
    executionContextChange(context: any, endPointUrl: any, confirmCb: any, infoCb: any, cb: any): any;
    currentblockGasLimit(): any;
    stopListenOnLastBlock(): void;
    _updateBlockGasLimit(): void;
    listenOnLastBlock(): void;
    setProviderFromEndpoint(endpoint: any, context: any, cb: any): void;
    txDetailsLink(network: any, hash: any): any;
    addBlock(block: any): void;
    trackTx(tx: any, block: any): void;
}
export {};
