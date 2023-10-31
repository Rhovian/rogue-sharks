import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AtomicArtUpgradesClient } from ".";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import testAuthority from "../../../../.config/solana/main.json";
import { AnchorProvider } from "@coral-xyz/anchor";

const TARGET_COLLECTION = new PublicKey("FREP9swLijQRyFXyrJTP8AB4ucx1iFP5jr4b3N1zRx52");
const TARGET_AUTHORITY = new PublicKey("8dytQGAY3MtH5kcg6YZpfNFAn4bqon9vtHQbGXuQw4uN");
const BASE_URI = 'https://shdw-drive.genesysgo.net/BnRuSZ8ApLuTog3LUfSbpHXyg8ZwmKzBsdgve5sRTyva';

// Generate a new wallet keypair 
const authority = Keypair.fromSecretKey(Uint8Array.from(testAuthority));
const wallet = new NodeWallet(authority);

const rpcUrl = "https://api.devnet.solana.com";
const connection = new Connection(rpcUrl);

const provider = new AnchorProvider(connection, wallet, {
  preflightCommitment: "processed"
});

async function main() {

  process.env.ANCHOR_PROVIDER_URL = rpcUrl;
  process.env.ANCHOR_WALLET = '/Users/elo/.config/solana/main.json';

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
