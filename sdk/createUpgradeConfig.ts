// TODO: move this to anchor scripts
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AtomicArtUpgradesClient } from ".";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import testAuthority from "../../../../.config/solana/main.json";
import { AnchorProvider } from "@coral-xyz/anchor";

const TARGET_COLLECTION = new PublicKey("6CAHJFD3vh7ybdi6dxtzVX3tYqWvuF3CnnordkzNjnLK");
const TARGET_AUTHORITY = new PublicKey("A4c5nctuNSN7jTsjDahv6bAWthmUzmXi3yBocvLYM4Bz");
const BASE_URI = 'https://shdw-drive.genesysgo.net/BnRuSZ8ApLuTog3LUfSbpHXyg8ZwmKzBsdgve5sRTyva';

// Generate a new wallet keypair 
const authority = Keypair.fromSecretKey(Uint8Array.from(testAuthority));
const wallet = new NodeWallet(authority);

const rpcUrl = " https://api.mainnet-beta.solana.com";
const connection = new Connection(rpcUrl);

const provider = new AnchorProvider(connection, wallet, {
  preflightCommitment: "processed"
});

async function main() {

  process.env.ANCHOR_PROVIDER_URL = rpcUrl;
  process.env.ANCHOR_WALLET = '/Users/elo/.config/solana/devnet.json';

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
