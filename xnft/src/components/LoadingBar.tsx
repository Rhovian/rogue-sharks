import React from "react";

const LoadingBar = ({ progress }: { progress: number }) => {
  return (
    <div className="loading-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
      <p className="demi-text text-white">Launching the rebirth experience</p>
    </div>
  );
};

export default LoadingBar;
