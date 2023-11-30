import { AnchorProvider } from "@coral-xyz/anchor";
import { Location } from "react-router-dom";
import { AtomicArtUpgradesClient } from "rogue-sharks-sdk";
import { TOKEN_METADATA_PROGRAM_ID } from "@coral-xyz/xnft";
import { Connection, PublicKey } from "@solana/web3.js";
import { COLLECTION_MINT } from "../config";

export const extractMint = (location: Location) => {
  const hash = location.hash;
  console.log("hash", hash);
  return hash.slice(2);
};

export const upgrade = async (mint: string) => {
  try {
    const provider = new AnchorProvider(
      new Connection("https://mainnet.helius-rpc.com/?api-key=b39a84bf-57aa-4a30-8449-5e443814611f"),
      window.xnft?.solana,
      AnchorProvider.defaultOptions(),
    );
    await AtomicArtUpgradesClient.upgradeMetadata(
      COLLECTION_MINT,
      new PublicKey(mint),
      getMetadataAddress(mint)!,
      provider,
    );
    return true
  } catch (err) {
    console.log("upgrade error", err);
    return false
  }
};

const getMetadataAddress = (mint: string) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata", "utf8"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      new PublicKey(mint).toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  )[0];
};
