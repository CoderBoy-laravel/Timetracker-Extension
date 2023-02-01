import React, { useState, useEffect } from "react";

interface watch {
  watch: boolean;
  oldTime: number;
}

const Stopwatch: React.FC<watch> = (props) => {
  const [time, setTime] = useState<number>(props.oldTime);
  const [running, setRunning] = useState<boolean>(props.watch);

  useEffect(() => {
    let interval;
    setRunning(props.watch);
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, props.watch]);
  return (
    <span className="stopwatch">
      <span className="numbers">
        <span>
          {(
            "0" + Math.floor(((time / 1000) % (60 * 60 * 24)) / (60 * 60))
          ).slice(-2)}
          :
        </span>
        <span>
          {("0" + Math.floor(((time / 1000) % (60 * 60)) / 60)).slice(-2)}:
        </span>
        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
      </span>
    </span>
  );
};

export default Stopwatch;
