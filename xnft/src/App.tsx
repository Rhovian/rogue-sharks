/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useDimensions, usePublicKeys } from "./hooks";
import { useConsoleInterceptor } from "./hooks/consoleOverride";
import { AtomicArtUpgradesClient } from "rogue-sharks-sdk";
import { PublicKey } from "@solana/web3.js";
import "./App.css";
import { TOKEN_METADATA_PROGRAM_ID } from "@coral-xyz/xnft";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useLocation } from "react-router-dom";
import bgImage from "./assets/bg.png";
import screen3 from "./assets/screen-2.jpg";
// @ts-ignore
import videoSource from "./assets/rebirth-experience.mp4";
import LoadingBar from "./components/LoadingBar";
import rightIcon from "./assets/right-icon.png";

const COLLECTION_MINT = new PublicKey(
  "FREP9swLijQRyFXyrJTP8AB4ucx1iFP5jr4b3N1zRx52",
);

function App() {
  const { triggerGameOver } = useConsoleInterceptor();
  const publicKeys = usePublicKeys();
  const dimensions = useDimensions();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [mint, setMint] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "build/SharkRun.loader.js",
    dataUrl: "build/SharkRun.data.unityweb",
    frameworkUrl: "build/SharkRun.framework.js.unityweb",
    codeUrl: "build/SharkRun.wasm.unityweb",
  });

  useEffect(() => {
    if (publicKeys) {
      setLoading(false);
    }
  }, [publicKeys]);

  useEffect(() => {
    if (triggerGameOver) {
      (async () => {
        await upgrade();
      })();
    }
  }, [triggerGameOver]);

  useEffect(() => {
    console.log("extracting mint...");
    extractMint();
  }, [location]);

  const handleSkip = async () => {
    await upgrade();
  };

  const getMetadataAddress = () => {
    if (!mint) return;
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        new PublicKey(mint).toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )[0];
  };

  const upgrade = async () => {
    if (!mint) return;
    try {
      const provider = new AnchorProvider(
        window.xnft?.solana.connection,
        window.xnft?.solana,
        AnchorProvider.defaultOptions(),
      );
      await AtomicArtUpgradesClient.upgradeMetadata(
        COLLECTION_MINT,
        new PublicKey(mint),
        getMetadataAddress()!,
        provider,
      );
    } catch (err) {
      console.log("upgrade error", err);
    }
  };

  const extractMint = () => {
    const url = location.pathname;
    const parts = url.split("/");
    const mint = parts[parts.length - 1];
    setMint(mint);
  };

  const handleStartGame = () => {
    setPage(2);
  };

  const gotoSecondPage = () => {
    setPage(1);
  };

  const secondPage = () => {
    return (
      <div
        className="App full-screen flex-center flex-col"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <img src={screen3} alt="" className="full-screen" />
        <button className="right-icon" onClick={handleStartGame}>
          <img src={rightIcon} alt="" width={60} height={60} />
        </button>
      </div>
    );
  };

  const firstPage = () => {
    return (
      <div
        className="App full-screen flex-center flex-col"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="sharky-dance">
          <video autoPlay loop muted className="sharky-dance">
            <source src={videoSource} type="video/mp4" />
          </video>
        </div>
        <div className="sharky-cta">
          <button className="sharky-button demi-text" onClick={gotoSecondPage}>
            The Rebirth Experience
          </button>
          <button className="sharky-button-variant">Quick Upgrade</button>
        </div>
      </div>
    );
  };

  const thirdPage = () => {
    return (
      <div
        className="App full-screen flex-center flex-col"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <>
          <h2 className="flex-center bold-text text-white large mt-5">
            An interactive art upgrade experience
          </h2>
          <div style={{ height: "200px" }}></div>
          <LoadingBar progress={loadingProgression * 100} />
          <Unity
            unityProvider={unityProvider}
            style={{
              width: "100vw",
              height: "100vh",
              visibility: isLoaded ? "visible" : "hidden",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </>
      </div>
    );
  };

  switch (page) {
    case 0:
      return firstPage();
    case 1:
      return secondPage();
    case 2:
      return thirdPage();
    default:
      return firstPage();
  }
}

export default App;
