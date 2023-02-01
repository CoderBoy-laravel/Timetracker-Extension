import { useState } from "react";
import { Time } from "./utils";
import { useInterval } from "./hooks";

export default function useStopwatch({ autoStart, offsetTimestamp }) {
  const [passedSeconds, setPassedSeconds] = useState(
    Time.getSecondsFromExpiry(offsetTimestamp, true) || 0
  );
  const [prevTime, setPrevTime] = useState<any>(new Date());
  const [seconds, setSeconds] = useState<number>(
    passedSeconds + Time.getSecondsFromPrevTime(prevTime || 0, true)
  );
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);

  useInterval(
    () => {
      setSeconds(passedSeconds + Time.getSecondsFromPrevTime(prevTime, true));
    },
    isRunning ? 1000 : null
  );

  function start(sec: number) {
    setPassedSeconds(sec);
    const newPrevTime = new Date();
    setPrevTime(newPrevTime);
    setIsRunning(true);
    setSeconds(passedSeconds + Time.getSecondsFromPrevTime(newPrevTime, true));
  }

  function pause() {
    setPassedSeconds(seconds);
    setIsRunning(false);
  }

  function reset(offset = 0, newAutoStart = true) {
    const newPassedSeconds = Time.getSecondsFromExpiry(offset, true) || 0;
    const newPrevTime = new Date();
    setPrevTime(newPrevTime);
    setPassedSeconds(newPassedSeconds);
    setIsRunning(newAutoStart);
    setSeconds(
      newPassedSeconds + Time.getSecondsFromPrevTime(newPrevTime, true)
    );
  }

  return {
    ...Time.getTimeFromSeconds(seconds),
    start,
    pause,
    reset,
    isRunning,
  };
}
