import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import { AtomicArtUpgrades } from "./types/atomic_art_upgrades";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
export declare const PROGRAM_ID: anchor.web3.PublicKey;
export declare const METADATA_PROGRAM_ID: anchor.web3.PublicKey;
export declare const setUpAnchor: (anchorProvider?: AnchorProvider, wallet?: NodeWallet) => anchor.AnchorProvider;
export declare const confirm: (connection: Connection) => (txSig: string) => Promise<anchor.web3.RpcResponseAndContext<anchor.web3.SignatureResult>>;
export interface AtomicArtUpgradesConfig {
    updateAuthority: PublicKey;
    collection: PublicKey;
    baseUri: string;
    bump: number;
}
export declare class AtomicArtUpgradesClient {
    readonly provider: anchor.AnchorProvider;
    config: AtomicArtUpgradesConfig | undefined;
    upgradeConfigAddress: PublicKey | undefined;
    readonly program: anchor.Program<AtomicArtUpgrades>;
    constructor(provider: anchor.AnchorProvider);
    private init;
    static getUpgradeConfigAddress(collection: PublicKey): Promise<[anchor.web3.PublicKey, number]>;
    static getUpgradeAccount(mint: PublicKey): Promise<[anchor.web3.PublicKey, number]>;
    static fetchUpgradeConfigData(upgradeConfigAddress: PublicKey): Promise<{
        updateAuthority: anchor.web3.PublicKey;
        collectionMint: anchor.web3.PublicKey;
        baseUri: string;
        bump: number[];
    }>;
    static createUpgradeConfig(updateAuthority: PublicKey, collectionMint: PublicKey, baseUri: string): Promise<AtomicArtUpgradesClient>;
    static updateUpgradeConfig(updateAuthority: PublicKey, collectionMint: PublicKey, baseUri: string, wallet?: NodeWallet): Promise<AtomicArtUpgradesClient>;
    static relinquishUpgradeAuthority(updateAuthority: PublicKey, collectionMint: PublicKey, mint: PublicKey, metadata: PublicKey): Promise<AtomicArtUpgradesClient>;
    static upgradeMetadata(collectionMint: PublicKey, mint: PublicKey, metadata: PublicKey, provider?: AnchorProvider): Promise<AtomicArtUpgradesClient>;
    /** helper for xnft env */
    static buildUpgradeMetadataTransaction: (connection: Connection, payer: PublicKey, mint: PublicKey, collectionMint: PublicKey, metadata: PublicKey) => Promise<anchor.web3.Transaction>;
}
