// TODO: move this to anchor scripts
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AtomicArtUpgradesClient } from "../client";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import testAuthority from "/Users/elo/.config/solana/master.json";
import { AnchorProvider } from "@coral-xyz/anchor";

const TARGET_COLLECTION = new PublicKey("4EaFiJNsoQzvTQckxZVsPfSttpgAT1Tehtg6bp7AuSfg");
const TARGET_AUTHORITY = new PublicKey("9m2r8NyVmE9FrQuK6o24pNdnkXpmmHYfTQT3vZm9yP3w");
const BASE_URI = 'https://shdw-drive.genesysgo.net/4pgfffz5v8TaeVnHUTrAWv6RTnXwvSYcgmUGG3aDB2jg';

// Generate a new wallet keypair 
const authority = Keypair.fromSecretKey(Uint8Array.from(testAuthority));
const wallet = new NodeWallet(authority);

const rpcUrl = "https://api.mainnet-beta.solana.com";
const connection = new Connection(rpcUrl);

const provider = new AnchorProvider(connection, wallet, {
  preflightCommitment: "processed"
});

async function main() {

  process.env.ANCHOR_PROVIDER_URL = rpcUrl;
  process.env.ANCHOR_WALLET = '/Users/elo/.config/solana/rhovian.json';

  let client = new AtomicArtUpgradesClient(provider);
  // Create the upgrade config
  client = await AtomicArtUpgradesClient.createUpgradeConfig(
    TARGET_AUTHORITY, 
    TARGET_COLLECTION,
    BASE_URI
  );

  console.log("Upgrade config created:", client.upgradeConfigAddress);
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  }
);
