import React from "react";
import bgImage from "../assets/bg.png";
import screen3 from "../assets/screen-2.jpg";
import rightIcon from "../assets/right-icon.png";

interface SecondPageProps {
  handleStartGame: () => void;
}

const SecondPage = ({ handleStartGame }: SecondPageProps) => {
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

export default SecondPage;
