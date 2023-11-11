/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";
import { useConsoleInterceptor } from "./hooks/consoleOverride";
import { useLocation } from "react-router-dom";
import { extractMint, upgrade } from "./utils";
import { COLLECTION_MINT } from "./config";
import FirstPage from "./screens/FirstPage";
import SecondPage from "./screens/SecondPage";
import ThirdPage from "./screens/ThirdPage";
import FourthPage from "./screens/FourthPage";
import "./App.css";

function App() {
  const { triggerGameOver } = useConsoleInterceptor();
  const location = useLocation();
  const [mint, setMint] = useState<string | null>(null);
  const [page, setPage] = useState(3);

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "build/SharkRun.loader.js",
    dataUrl: "build/SharkRun.data.unityweb",
    frameworkUrl: "build/SharkRun.framework.js.unityweb",
    codeUrl: "build/SharkRun.wasm.unityweb",
  });

  useEffect(() => {
    console.log("extracting mint...");
    setMint(extractMint(location));
  }, [location]);

  useEffect(() => {
    if (triggerGameOver) {
      (async () => {
        if (mint) await upgrade(mint, COLLECTION_MINT);
      })();
    }
  }, [triggerGameOver]);

  const handleQuickUpgrade = async () => {
    if (!mint) {
      console.log("no mint found");
      return;
    }
    await upgrade(mint, COLLECTION_MINT);
  };

  const handleStartGame = () => {
    setPage(2);
  };

  const gotoSecondPage = () => {
    setPage(1);
  };

  const renderPage = () => {
    switch (page) {
      case 0:
        return (
          <FirstPage
            gotoSecondPage={gotoSecondPage}
            handleQuickUpgrade={handleQuickUpgrade}
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
        return <FourthPage />;
      default:
        return (
          <FirstPage
            gotoSecondPage={gotoSecondPage}
            handleQuickUpgrade={handleQuickUpgrade}
          />
        );
    }
  };

  return renderPage();
}

export default App;
