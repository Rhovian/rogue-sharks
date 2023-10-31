"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomicArtUpgradesClient = exports.confirm = exports.setUpAnchor = exports.METADATA_PROGRAM_ID = exports.PROGRAM_ID = void 0;
var anchor = __importStar(require("@coral-xyz/anchor"));
var anchor_1 = require("@coral-xyz/anchor");
var web3_js_1 = require("@solana/web3.js");
var atomic_art_upgrades_1 = require("./types/atomic_art_upgrades");
exports.PROGRAM_ID = new web3_js_1.PublicKey("8EidSNJMiPUWcB8pXLnBG2k6nL4nqWwutPL5To5yY8Hh");
exports.METADATA_PROGRAM_ID = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
var setUpAnchor = function (anchorProvider, wallet) {
    if (anchorProvider)
        return anchorProvider;
    return wallet
        ? new anchor_1.AnchorProvider(anchor_1.AnchorProvider.env().connection, wallet, anchor_1.AnchorProvider.env().opts)
        : anchor_1.AnchorProvider.env();
};
exports.setUpAnchor = setUpAnchor;
var confirm = function (connection) { return function (txSig) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _b = (_a = connection).confirmTransaction;
                _c = [{ signature: txSig }];
                return [4 /*yield*/, connection.getLatestBlockhash()];
            case 1: return [2 /*return*/, _b.apply(_a, [__assign.apply(void 0, _c.concat([(_d.sent())]))])];
        }
    });
}); }; };
exports.confirm = confirm;
var AtomicArtUpgradesClient = /** @class */ (function () {
    function AtomicArtUpgradesClient(provider) {
        this.provider = provider;
        this.program = new anchor.Program(atomic_art_upgrades_1.IDL, exports.PROGRAM_ID, provider);
    }
    AtomicArtUpgradesClient.prototype.init = function (upgradeConfigAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var upgradeConfig;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.program.account.upgradeConfig.fetch(upgradeConfigAddress)];
                    case 1:
                        upgradeConfig = _b.sent();
                        this.config = {
                            updateAuthority: upgradeConfig.updateAuthority,
                            collection: upgradeConfig.collectionMint,
                            baseUri: upgradeConfig.baseUri,
                            bump: upgradeConfig.bump[0],
                        };
                        this.upgradeConfigAddress = upgradeConfigAddress;
                        return [2 /*return*/];
                }
            });
        });
    };
    AtomicArtUpgradesClient.getUpgradeConfigAddress = function (collection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("upgrade_config"), collection.toBuffer()], exports.PROGRAM_ID)];
            });
        });
    };
    AtomicArtUpgradesClient.getUpgradeAccount = function (mint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("upgrade"), mint.toBuffer()], exports.PROGRAM_ID)];
            });
        });
    };
    AtomicArtUpgradesClient.fetchUpgradeConfigData = function (upgradeConfigAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_b) {
                client = new AtomicArtUpgradesClient((0, exports.setUpAnchor)());
                return [2 /*return*/, client.program.account.upgradeConfig.fetch(upgradeConfigAddress)];
            });
        });
    };
    AtomicArtUpgradesClient.createUpgradeConfig = function (updateAuthority, collectionMint, baseUri) {
        return __awaiter(this, void 0, void 0, function () {
            var client, upgradeConfigAddress, accounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        client = new AtomicArtUpgradesClient((0, exports.setUpAnchor)());
                        return [4 /*yield*/, AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint)];
                    case 1:
                        upgradeConfigAddress = _b.sent();
                        accounts = {
                            payer: client.provider.wallet.publicKey,
                            upgradeConfig: upgradeConfigAddress[0],
                            collectionMint: collectionMint,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        };
                        return [4 /*yield*/, client.program.methods
                                .registerUpgradeConfig({
                                updateAuthority: updateAuthority,
                                collectionMint: collectionMint,
                                baseUri: baseUri,
                            })
                                .accounts(accounts)
                                .rpc()
                                .then(function () {
                                (0, exports.confirm)(client.provider.connection);
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, client.init(upgradeConfigAddress[0])];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, client];
                }
            });
        });
    };
    AtomicArtUpgradesClient.updateUpgradeConfig = function (updateAuthority, collectionMint, baseUri, wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var client, upgradeConfigAddress, accounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        client = new AtomicArtUpgradesClient((0, exports.setUpAnchor)(null, wallet));
                        return [4 /*yield*/, AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint)];
                    case 1:
                        upgradeConfigAddress = _b.sent();
                        accounts = {
                            payer: client.provider.wallet.publicKey,
                            upgradeConfig: upgradeConfigAddress[0],
                            collectionMint: collectionMint,
                        };
                        return [4 /*yield*/, client.program.methods
                                .updateUpgradeConfig({
                                updateAuthority: updateAuthority,
                                baseUri: baseUri,
                            })
                                .accounts(accounts)
                                .rpc()
                                .then(function () {
                                (0, exports.confirm)(client.provider.connection);
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, client.init(upgradeConfigAddress[0])];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, client];
                }
            });
        });
    };
    AtomicArtUpgradesClient.relinquishUpgradeAuthority = function (updateAuthority, collectionMint, mint, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var client, upgradeConfigAddress, accounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        client = new AtomicArtUpgradesClient((0, exports.setUpAnchor)());
                        return [4 /*yield*/, AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint)];
                    case 1:
                        upgradeConfigAddress = _b.sent();
                        accounts = {
                            payer: client.provider.wallet.publicKey,
                            upgradeConfig: upgradeConfigAddress[0],
                            mint: mint,
                            metadata: metadata,
                            tokenMetadataProgram: exports.METADATA_PROGRAM_ID,
                        };
                        return [4 /*yield*/, client.program.methods
                                .relinquishUpdateAuthority(updateAuthority)
                                .accounts(accounts)
                                .rpc()
                                .then(function () {
                                (0, exports.confirm)(client.provider.connection);
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, client.init(upgradeConfigAddress[0])];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, client];
                }
            });
        });
    };
    AtomicArtUpgradesClient.upgradeMetadata = function (collectionMint, mint, metadata, provider) {
        return __awaiter(this, void 0, void 0, function () {
            var client, upgradeConfigAddress, upgradeAccount, accounts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        client = new AtomicArtUpgradesClient((0, exports.setUpAnchor)(provider));
                        return [4 /*yield*/, AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint)];
                    case 1:
                        upgradeConfigAddress = _b.sent();
                        return [4 /*yield*/, AtomicArtUpgradesClient.getUpgradeAccount(mint)];
                    case 2:
                        upgradeAccount = _b.sent();
                        accounts = {
                            payer: client.provider.wallet.publicKey,
                            upgradeConfig: upgradeConfigAddress[0],
                            upgradeAccount: upgradeAccount[0],
                            mint: mint,
                            metadata: metadata,
                            tokenMetadataProgram: exports.METADATA_PROGRAM_ID,
                        };
                        return [4 /*yield*/, client.program.methods
                                .upgradeMetadata()
                                .accounts(accounts)
                                .rpc()
                                .then(function () {
                                (0, exports.confirm)(client.provider.connection);
                            })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, client.init(upgradeConfigAddress[0])];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, client];
                }
            });
        });
    };
    var _a;
    _a = AtomicArtUpgradesClient;
    /** helper for xnft env */
    AtomicArtUpgradesClient.buildUpgradeMetadataTransaction = function (connection, payer, mint, collectionMint, metadata) { return __awaiter(void 0, void 0, void 0, function () {
        var upgradeAccount, upgradeConfigAddress, upgradeMetadataInstruction, transaction, _b;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, AtomicArtUpgradesClient.getUpgradeAccount(mint)];
                case 1:
                    upgradeAccount = _c.sent();
                    upgradeConfigAddress = AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint);
                    upgradeMetadataInstruction = new web3_js_1.TransactionInstruction({
                        keys: [
                            { pubkey: upgradeAccount[0], isSigner: false, isWritable: false },
                            { pubkey: upgradeConfigAddress[0], isSigner: false, isWritable: true },
                            { pubkey: mint, isSigner: false, isWritable: false },
                            { pubkey: metadata, isSigner: false, isWritable: true },
                            { pubkey: exports.METADATA_PROGRAM_ID, isSigner: false, isWritable: false }
                        ],
                        programId: exports.PROGRAM_ID,
                        data: Buffer.from(Uint8Array.of(2))
                    });
                    transaction = new web3_js_1.Transaction()
                        .add(upgradeMetadataInstruction);
                    _b = transaction;
                    return [4 /*yield*/, connection.getLatestBlockhash()];
                case 2:
                    _b.recentBlockhash = (_c.sent()).blockhash;
                    transaction.feePayer = payer;
                    return [2 /*return*/, transaction];
            }
        });
    }); };
    return AtomicArtUpgradesClient;
}());
exports.AtomicArtUpgradesClient = AtomicArtUpgradesClient;
