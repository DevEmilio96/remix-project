export declare class TxRunner {
    event: any;
    executionContext: any;
    _api: any;
    blockNumber: any;
    runAsync: any;
    pendingTxs: any;
    vmaccounts: any;
    queusTxs: any;
    blocks: any;
    commonContext: any;
    constructor(vmaccounts: any, api: any, executionContext: any);
    rawRun(args: any, confirmationCb: any, gasEstimationForceSend: any, promptCb: any, cb: any): void;
    _executeTx(tx: any, gasPrice: any, api: any, promptCb: any, callback: any): void;
    _sendTransaction(sendTx: any, tx: any, pass: any, callback: any): any;
    execute(args: any, confirmationCb: any, gasEstimationForceSend: any, promptCb: any, callback: any): any;
    runInVm(from: any, to: any, data: any, value: any, gasLimit: any, useCall: any, timestamp: any, callback: any): any;
    runBlockInVm(tx: any, block: any, callback: any): void;
    runInNode(from: any, to: any, data: any, value: any, gasLimit: any, useCall: any, confirmCb: any, gasEstimationForceSend: any, promptCb: any, callback: any): any;
}
