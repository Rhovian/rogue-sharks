import React from "react";
import bgImage from "../assets/bg.png";
// @ts-ignore
import videoSource from "../assets/rebirth-experience.mp4";

interface FirstPageProps {
  gotoSecondPage: () => void;
  handleQuickUpgrade: () => void;
}

const FirstPage = ({ gotoSecondPage, handleQuickUpgrade }: FirstPageProps) => {
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
        {/* Placeholder for quick upgrade functionality */}
        <button className="sharky-button-variant" onClick={handleQuickUpgrade}>
          Quick Upgrade
        </button>
      </div>
    </div>
  );
};

export default FirstPage;
