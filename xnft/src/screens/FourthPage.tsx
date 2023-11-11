import React from "react";
import bgImage from "../assets/bg.png";
import LoadingBar from "../components/LoadingBar";

const ThirdPage = () => {
  const [loadingProgression, setLoadingProgression] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
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
  );
};

export default ThirdPage;
