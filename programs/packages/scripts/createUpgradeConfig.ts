// TODO: move this to anchor scripts
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AtomicArtUpgradesClient } from ".";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import testAuthority from "/Users/elo/.config/solana/master.json";
import { AnchorProvider } from "@coral-xyz/anchor";

const TARGET_COLLECTION = new PublicKey("3VdqpQ2t9Xy83NKVfebBX9HHDtLFXAphxfuconpFR5g4");
const TARGET_AUTHORITY = new PublicKey("CQFRrWZV4yq6u4ympXZa67er293c32zfoJ4P2DoWUwLt");
const BASE_URI = 'https://shdw-drive.genesysgo.net/EzhAK9QF3JEchuvjkTAxC4HT89P9pb2mrTTW98cawBf2';

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
  process.env.ANCHOR_WALLET = '/Users/elo/.config/solana/master.json';

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
