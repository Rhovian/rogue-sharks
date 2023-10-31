"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
var _1 = require("./");
var nodewallet_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet"));
var main_json_1 = __importDefault(require("../../../../.config/solana/main.json"));
var anchor_1 = require("@coral-xyz/anchor");
var TARGET_COLLECTION = new web3_js_1.PublicKey("FREP9swLijQRyFXyrJTP8AB4ucx1iFP5jr4b3N1zRx52");
var TARGET_AUTHORITY = new web3_js_1.PublicKey("8dytQGAY3MtH5kcg6YZpfNFAn4bqon9vtHQbGXuQw4uN");
var BASE_URI = 'https://shdw-drive.genesysgo.net/BnRuSZ8ApLuTog3LUfSbpHXyg8ZwmKzBsdgve5sRTyva';
// Generate a new wallet keypair 
var authority = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(main_json_1.default));
var wallet = new nodewallet_1.default(authority);
var rpcUrl = "https://api.devnet.solana.com";
var connection = new web3_js_1.Connection(rpcUrl);
var provider = new anchor_1.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed"
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.ANCHOR_PROVIDER_URL = rpcUrl;
                    process.env.ANCHOR_WALLET = '/Users/elo/.config/solana/main.json';
                    client = new _1.AtomicArtUpgradesClient(provider);
                    return [4 /*yield*/, _1.AtomicArtUpgradesClient.createUpgradeConfig(TARGET_AUTHORITY, TARGET_COLLECTION, BASE_URI)];
                case 1:
                    // Create the upgrade config
                    client = _a.sent();
                    console.log("Upgrade config created:", client.upgradeConfigAddress);
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () { return process.exit(); }, function (err) {
    console.error(err);
    process.exit(-1);
});
