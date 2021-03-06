"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const blocks_1 = require("./methods/blocks");
const remix_lib_1 = require("@remix-project/remix-lib");
const logs_1 = require("./utils/logs");
const merge_1 = tslib_1.__importDefault(require("merge"));
const accounts_1 = require("./methods/accounts");
const filters_1 = require("./methods/filters");
const misc_1 = require("./methods/misc");
const net_1 = require("./methods/net");
const transactions_1 = require("./methods/transactions");
const debug_1 = require("./methods/debug");
const genesis_1 = require("./genesis");
const { executionContext } = remix_lib_1.execution;
class Provider {
    constructor(host = 'vm', options = {}) {
        this.options = options;
        this.host = host;
        this.connected = true;
        // TODO: init executionContext here
        this.executionContext = executionContext;
        this.Accounts = new accounts_1.Accounts(this.executionContext);
        this.Transactions = new transactions_1.Transactions(this.executionContext);
        this.methods = {};
        this.methods = merge_1.default(this.methods, this.Accounts.methods());
        this.methods = merge_1.default(this.methods, (new blocks_1.Blocks(this.executionContext, options)).methods());
        this.methods = merge_1.default(this.methods, misc_1.methods());
        this.methods = merge_1.default(this.methods, (new filters_1.Filters(this.executionContext)).methods());
        this.methods = merge_1.default(this.methods, net_1.methods());
        this.methods = merge_1.default(this.methods, this.Transactions.methods());
        this.methods = merge_1.default(this.methods, (new debug_1.Debug(this.executionContext)).methods());
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield genesis_1.generateBlock(this.executionContext);
            yield this.Accounts.resetAccounts();
            this.Transactions.init(this.Accounts.accounts);
        });
    }
    sendAsync(payload, callback) {
        // log.info('payload method is ', payload.method) // commented because, this floods the IDE console
        const method = this.methods[payload.method];
        if (this.options.logDetails) {
            logs_1.info(payload);
        }
        if (method) {
            return method.call(method, payload, (err, result) => {
                if (this.options.logDetails) {
                    logs_1.info(err);
                    logs_1.info(result);
                }
                if (err) {
                    return callback(err);
                }
                const response = { id: payload.id, jsonrpc: '2.0', result: result };
                callback(null, response);
            });
        }
        callback(new Error('unknown method ' + payload.method));
    }
    send(payload, callback) {
        this.sendAsync(payload, callback || function () { });
    }
    isConnected() {
        return true;
    }
    disconnect() {
        return false;
    }
    ;
    supportsSubscriptions() {
        return true;
    }
    ;
    on(type, cb) {
        this.executionContext.logsManager.addListener(type, cb);
    }
}
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map