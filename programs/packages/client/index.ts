import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, BorshInstructionCoder } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Connection, TransactionInstruction, Transaction } from "@solana/web3.js";
import { AtomicArtUpgrades, IDL } from "../types/atomic_art_upgrades";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const upgradeMetadataDescriminator = [107, 186, 204, 157, 166, 203, 110, 96];

export const PROGRAM_ID = new PublicKey(
  "8EidSNJMiPUWcB8pXLnBG2k6nL4nqWwutPL5To5yY8Hh"
);

export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const setUpAnchor = (anchorProvider?: AnchorProvider, wallet?: NodeWallet) => {
  if (anchorProvider) return anchorProvider;
  return wallet
    ? new AnchorProvider(
        AnchorProvider.env().connection,
        wallet,
        AnchorProvider.env().opts
      )
    : AnchorProvider.env();
};

export const confirm = (connection: Connection) => async (txSig: string) =>
  connection.confirmTransaction({
    signature: txSig,
    ...(await connection.getLatestBlockhash()),
  });

export interface AtomicArtUpgradesConfig {
  updateAuthority: PublicKey;
  collection: PublicKey;
  baseUri: string;
  bump: number;
}

export class AtomicArtUpgradesClient {
  config: AtomicArtUpgradesConfig | undefined;
  upgradeConfigAddress: PublicKey | undefined;
  readonly program: anchor.Program<AtomicArtUpgrades>;

  constructor(readonly provider: anchor.AnchorProvider) {
    this.program = new anchor.Program(IDL, PROGRAM_ID, provider);
  }

  private async init(upgradeConfigAddress: PublicKey) {
    const upgradeConfig = await this.program.account.upgradeConfig.fetch(
      upgradeConfigAddress
    );

    this.config = {
      updateAuthority: upgradeConfig.updateAuthority,
      collection: upgradeConfig.collectionMint,
      baseUri: upgradeConfig.baseUri,
      bump: upgradeConfig.bump[0],
    };

    this.upgradeConfigAddress = upgradeConfigAddress;
  }

  public static async getUpgradeConfigAddress(collection: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("upgrade_config"), collection.toBuffer()],
      PROGRAM_ID
    );
  }

  public static async getUpgradeAccount(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("upgrade"), mint.toBuffer()],
      PROGRAM_ID
    );
  }

  public static async fetchUpgradeConfigData(upgradeConfigAddress: PublicKey) {
    const client = new AtomicArtUpgradesClient(setUpAnchor());
    return client.program.account.upgradeConfig.fetch(upgradeConfigAddress);
  }

  public static async createUpgradeConfig(
    updateAuthority: PublicKey,
    collectionMint: PublicKey,
    baseUri: string
  ): Promise<AtomicArtUpgradesClient> {
    const client = new AtomicArtUpgradesClient(setUpAnchor());
    const upgradeConfigAddress =
      await AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint);

    const accounts = {
      payer: client.provider.wallet.publicKey,
      upgradeConfig: upgradeConfigAddress[0],
      collectionMint,
      systemProgram: SystemProgram.programId,
    };

    await client.program.methods
      .registerUpgradeConfig({
        updateAuthority,
        collectionMint,
        baseUri,
      })
      .accounts(accounts)
      .rpc()
      .then(() => {
        confirm(client.provider.connection);
      });
    await client.init(upgradeConfigAddress[0]);

    return client;
  }

  public static async updateUpgradeConfig(
    updateAuthority: PublicKey,
    collectionMint: PublicKey,
    baseUri: string,
    wallet?: NodeWallet
  ): Promise<AtomicArtUpgradesClient> {
    const client = new AtomicArtUpgradesClient(setUpAnchor(null, wallet));

    const upgradeConfigAddress =
      await AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint);

    const accounts = {
      payer: client.provider.wallet.publicKey,
      upgradeConfig: upgradeConfigAddress[0],
      collectionMint,
    };

    await client.program.methods
      .updateUpgradeConfig({
        updateAuthority,
        baseUri,
      })
      .accounts(accounts)
      .rpc()
      .then(() => {
        confirm(client.provider.connection);
      });

    await client.init(upgradeConfigAddress[0]);

    return client;
  }

  public static async relinquishUpgradeAuthority(
    updateAuthority: PublicKey,
    collectionMint: PublicKey,
    mint: PublicKey,
    metadata: PublicKey
  ): Promise<AtomicArtUpgradesClient> {
    const client = new AtomicArtUpgradesClient(setUpAnchor());

    const upgradeConfigAddress =
      await AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint);

    const accounts = {
      payer: client.provider.wallet.publicKey,
      upgradeConfig: upgradeConfigAddress[0],
      mint,
      metadata,
      tokenMetadataProgram: METADATA_PROGRAM_ID,
    };

    await client.program.methods
      .relinquishUpdateAuthority(updateAuthority)
      .accounts(accounts)
      .rpc()
      .then(() => {
        confirm(client.provider.connection);
      });

    await client.init(upgradeConfigAddress[0]);

    return client;
  }

  public static async upgradeMetadata(
    collectionMint: PublicKey,
    mint: PublicKey,
    metadata: PublicKey,
    provider?: AnchorProvider
  ): Promise<AtomicArtUpgradesClient> {
    const client = new AtomicArtUpgradesClient(setUpAnchor(provider));

    const upgradeConfigAddress =
      await AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint);

    const upgradeAccount = 
      await AtomicArtUpgradesClient.getUpgradeAccount(mint);

    const accounts = {
      payer: client.provider.wallet.publicKey,
      upgradeConfig: upgradeConfigAddress[0],
      upgradeAccount: upgradeAccount[0],
      mint,
      metadata,
      tokenMetadataProgram: METADATA_PROGRAM_ID,
    };

    await client.program.methods
      .upgradeMetadata()
      .accounts(accounts)
      .rpc()
      .then(() => {
        confirm(client.provider.connection);
      });

    await client.init(upgradeConfigAddress[0]);

    return client;
  }

  /** helper for xnft env */
  public static buildUpgradeMetadataTransaction = async (
    connection: Connection,
    payer: PublicKey,
    mint: PublicKey,
    collectionMint: PublicKey,
    metadata: PublicKey,
  ) => {

    const upgradeAccount = 
      await AtomicArtUpgradesClient.getUpgradeAccount(mint);

    const upgradeConfigAddress = await AtomicArtUpgradesClient.getUpgradeConfigAddress(collectionMint);



    const upgradeMetadataInstruction = new TransactionInstruction({
      keys: [
        {pubkey: payer, isSigner: true, isWritable: false}, 
        {pubkey: upgradeConfigAddress[0], isSigner: false, isWritable: true},
        {pubkey: mint, isSigner: false, isWritable: false}, 
        {pubkey: upgradeAccount[0], isSigner: false, isWritable: true},
        {pubkey: metadata, isSigner: false, isWritable: true},
        {pubkey: METADATA_PROGRAM_ID, isSigner: false, isWritable: false},
        {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
      ],
      programId: PROGRAM_ID,
      data: Buffer.from(upgradeMetadataDescriminator) 
    })
    
    const transaction = new Transaction()
      .add(upgradeMetadataInstruction)

      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash 
      transaction.feePayer = payer
  
    return transaction
  }
}
