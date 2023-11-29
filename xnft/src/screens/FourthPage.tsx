import React, { useEffect } from "react";
import bgImage from "../assets/bg.png";
import LoadingBar from "../components/LoadingBar";
import { Metaplex, PublicKey, JsonMetadata } from "@metaplex-foundation/js";
import { upgrade } from "../utils";
import placeholderShark from "../assets/placeholderShark.png";

interface FourthPageProps {
  metaplex: Metaplex;
  nftMetadata: JsonMetadata;
  mint: string;
}

const FourthPage = ({ metaplex, nftMetadata, mint }: FourthPageProps) => {
  const [loadingProgression, setLoadingProgression] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [metadata, setMetadata] = React.useState<JsonMetadata | null>(
    nftMetadata,
  );
  const [image, setImage] = React.useState<string | null>(null);

  useEffect(() => {
    if (metadata && metadata.json) setImage(metadata.image || null);
  }, [metadata]);

  useEffect(() => {
    (async () => {
      await upgrade(mint);
    })();
    setLoadingProgression(25);
  }, [mint]);

  // create a function to poll for nft metadata changes
  // if the metadata changes, set the metadata state to the new metadata
  // and then set the loading progression to 75
  // recover the image from the metadata and set it to the image state
  // Poll for metadata changes every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!metaplex || !mint) return;

      const updatedMetadata = await metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(mint) });
      if (metadata?.uri !== updatedMetadata?.uri) {
        setMetadata(updatedMetadata.json);
        setImage(updatedMetadata?.json?.image || null);
        setLoadingProgression(100);
        setIsLoaded(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [metaplex, mint, metadata]);

  return (
    <>
      {!isLoaded && (
        <div
          className="App full-screen flex-center flex-col"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <h2 className="flex-center bold-text text-white large mt-5">
            Upgrade in progress
          </h2>
          <div style={{ height: "200px" }}></div>
          <LoadingBar progress={loadingProgression * 100} />
        </div>
      )}
      {isLoaded && (
        <div className="App full-screen flex-col final-page">
          <div className="nav demi-text text-left">upgrade complete</div>
          <div className="img-wrap">
            {image ? (
              <img
                src={image}
                alt="rogue sharks nft"
                height={300}
                width={300}
              />
            ) : (
              <img
                src={placeholderShark}
                alt="rogue sharks nft"
                height={300}
                width={300}
              />
            )}
            <div className="text-wrap">
              <div className="title demi-text">
                Say "Hi" to <br /> your new shark
              </div>
              <div className="description">
                Looking sharp! Welcome to the new era <br /> of Rogue Sharks.
                Time for a new PFP?
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FourthPage;
