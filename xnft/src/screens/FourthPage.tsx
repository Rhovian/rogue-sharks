import React from "react";
import bgImage from "../assets/bg.png";
import LoadingBar from "../components/LoadingBar";

const ThirdPage = () => {
  const [loadingProgression, setLoadingProgression] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <>
      {isLoaded && (
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
      {!isLoaded && (
        <div className="App full-screen flex-col final-page">
          <div className="nav demi-text text-left">upgrade complete</div>
          <div className="img-wrap">
            <img src="" height={300} width={300} />
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

export default ThirdPage;
