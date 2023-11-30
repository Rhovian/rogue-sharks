import React, { useEffect } from "react";

interface LoadingBarProps {
  progress: number;
  isFourthPage?: boolean;
}

const LoadingBar = ({ progress, isFourthPage }: LoadingBarProps) => {
  useEffect(() => {
    console.log(progress)
  }, [progress]);
  
  return (
    <div className="loading-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
      {isFourthPage ? (
        <p className="demi-text text-white">{`${progress}% complete`}</p>
      ) : (
        <p className="demi-text text-white">Launching the rebirth experience</p>
      )}
    </div>
  );
};

export default LoadingBar;
