/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";
import { useConsoleInterceptor } from "./hooks/consoleOverride";
// import { useLocation } from "react-router-dom";
// import { extractMint } from "./utils";
import FirstPage from "./screens/FirstPage";
import SecondPage from "./screens/SecondPage";
import ThirdPage from "./screens/ThirdPage";
import FourthPage from "./screens/FourthPage";
import { useSolanaConnection } from "./hooks";
import { JsonMetadata, Metaplex, PublicKey } from "@metaplex-foundation/js";
import "./App.css";

function App() {
  const { triggerGameOver } = useConsoleInterceptor();
  // const location = useLocation();
  const [mint] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [metaplex, setMetaplex] = useState<Metaplex | null>(null);
  const [nftMetadata, setNftMetadata] = useState<JsonMetadata | null>(null);
  const connection = useSolanaConnection();

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "build/SharkRun.loader.js",
    dataUrl: "build/SharkRun.data.unityweb",
    frameworkUrl: "build/SharkRun.framework.js.unityweb",
    codeUrl: "build/SharkRun.wasm.unityweb",
  });

  // useEffect(() => {
  //   if (location) setMint(extractMint(location));
  // }, [location]);

  useEffect(() => {
    if (connection) {
      setMetaplex(Metaplex.make(window.xnft.solana.connection._rpcEndpoint));
    }
  }, [connection]);

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
