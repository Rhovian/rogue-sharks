import { AnchorProvider } from "@coral-xyz/anchor";
import { Location } from "react-router-dom";
import { AtomicArtUpgradesClient } from "rogue-sharks-sdk";
import { TOKEN_METADATA_PROGRAM_ID } from "@coral-xyz/xnft";
import { PublicKey } from "@solana/web3.js";
import { COLLECTION_MINT } from "../config";

export const extractMint = (location: Location) => {
  const hash = location.hash;
  return hash.slice(2);
};

export const upgrade = async (mint: string) => {
  try {
    const provider = new AnchorProvider(
      window.xnft?.solana.connection,
      window.xnft?.solana,
      AnchorProvider.defaultOptions(),
    );
    await AtomicArtUpgradesClient.upgradeMetadata(
      COLLECTION_MINT,
      new PublicKey(mint),
      getMetadataAddress(mint)!,
      provider,
    );
  } catch (err) {
    console.log("upgrade error", err);
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
