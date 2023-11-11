import React from "react";
import bgImage from "../assets/bg.png";
import LoadingBar from "../components/LoadingBar";
import { Unity } from "react-unity-webgl";

interface ThirdPageProps {
  unityProvider: any; // Replace 'any' with the specific type for your unityProvider
  isLoaded: boolean;
  loadingProgression: number;
}

const ThirdPage = ({
  unityProvider,
  isLoaded,
  loadingProgression,
}: ThirdPageProps) => {
  return (
    <div
      className="App full-screen flex-center flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="flex-center flex-col"
        style={{ visibility: isLoaded ? "hidden" : "visible", width: "100%" }}
      >
        <h2 className="flex-center bold-text text-white large mt-5">
          An interactive art upgrade experience
        </h2>
        <div style={{ height: "200px" }}></div>
        <LoadingBar progress={loadingProgression * 100} />
      </div>
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
    </div>
  );
};

export default ThirdPage;
