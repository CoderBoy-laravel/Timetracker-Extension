import { useEffect } from "react";
import useStopwatch from "./useStopwatch";

export { useStopwatch };

// This deprecated default export is just to avoid breaking old versions code before v1.1.0
export default function useTimerDeprecated(settings) {
  // didMount effect
  useEffect(() => {
    console.warn(
      "react-timer-hook: default export useTimer is deprecated, use named exports { useTimer, useStopwatch, useTime } instead"
    );
  }, []);
  const values = useStopwatch(settings); // eslint-disable-line
  return {
    ...values,
    startTimer: values.start,
    stopTimer: values.pause,
    resetTimer: values.reset,
  };
}
