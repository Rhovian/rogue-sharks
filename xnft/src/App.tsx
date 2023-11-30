// disable eslint entirely
/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";
import { useConsoleInterceptor } from "./hooks/consoleOverride";
import { useLocation } from "react-router-dom";
import { extractMint } from "./utils";
import FirstPage from "./screens/FirstPage";
import SecondPage from "./screens/SecondPage";
import ThirdPage from "./screens/ThirdPage";
import FourthPage from "./screens/FourthPage";
import { JsonMetadata, Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import "./App.css";

function App() {
  const { triggerGameOver } = useConsoleInterceptor();
  const location = useLocation();
  const [mint, setMint] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [metaplex, setMetaplex] = useState<Metaplex | null>(null);
  const [nftMetadata, setNftMetadata] = useState<JsonMetadata | null>(null);

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "build/SharkRun.loader.js",
    dataUrl: "build/SharkRun.data.unityweb",
    frameworkUrl: "build/SharkRun.framework.js.unityweb",
    codeUrl: "build/SharkRun.wasm.unityweb",
  });

  useEffect(() => {
    if (location && !mint) setMint(extractMint(location));
  }, [location, setMint, mint]);

  useEffect(() => {
    if (!metaplex && window && window.xnft) {
      // make solana connection with rpc
      setMetaplex(
        Metaplex.make(
          new Connection(
            "https://mainnet.helius-rpc.com/?api-key=b39a84bf-57aa-4a30-8449-5e443814611f",
          ),
        ),
      );
    }
  }, [metaplex, window]);

  useEffect(() => {
    if (!metaplex || !mint) return;
    (async () => {
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(mint) });
      setNftMetadata(nft.json);
    })();
  }, [metaplex, mint]);

  useEffect(() => {
    if (triggerGameOver) {
      goToFourthPage();
    }
  }, [triggerGameOver]);

  const gotoSecondPage = () => {
    setPage(1);
  };

  const handleStartGame = () => {
    setPage(2);
  };

  const goToFourthPage = () => {
    if (!mint || !metaplex || !nftMetadata) return;
    setPage(3);
  };

  const renderPage = () => {
    switch (page) {
      case 0:
        return (
          <FirstPage
            gotoSecondPage={gotoSecondPage}
            handleQuickUpgrade={goToFourthPage}
          />
        );
      case 1:
        return <SecondPage handleStartGame={handleStartGame} />;
      case 2:
        return (
          <ThirdPage
            unityProvider={unityProvider}
            isLoaded={isLoaded}
            loadingProgression={loadingProgression}
          />
        );
      case 3:
        return (
          <FourthPage
            metaplex={metaplex!}
            nftMetadata={nftMetadata!}
            mint={mint!}
          />
        );
      default:
        return (
          <FirstPage
            gotoSecondPage={gotoSecondPage}
            handleQuickUpgrade={goToFourthPage}
          />
        );
    }
  };

  return renderPage();
}

export default App;
