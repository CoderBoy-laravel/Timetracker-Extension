import React from "react";
import Digit from "./BlackDigit";

interface time {
  seconds: number;
  minutes: number;
  hours: number;
  days: number | undefined;
}

export default function TimerStyledBlack({
  seconds,
  minutes,
  hours,
  days,
}: time) {
  return (
    <span className="flex flex-row items-center ml-1">
      {days !== undefined ? (
        <Digit value={days} title="DAYS" addSeparator />
      ) : null}
      {days !== undefined ? (
        <span className="flex flex-col items-center mx-2">
          <span className="inline-block w-1 mb-[2px] h-1 bg-[#404549] rounded-md mx-1" />
          <span className="inline-block w-1 h-1 mt-[2px]  bg-[#404549] rounded-md mx-1" />
        </span>
      ) : null}
      <Digit value={hours} title="HOURS" addSeparator />
      <span className="flex flex-col items-center mx-1">
        <span className="inline-block w-1 h-1 mb-[2px] bg-[#404549] rounded-md mx-1" />
        <span className="inline-block w-1 h-1 mt-[2px] bg-[#404549] rounded-md mx-1" />
      </span>
      <Digit value={minutes} title="MINUTES" addSeparator />
      <span className="flex flex-col items-center mx-1">
        <span className="inline-block w-1 h-1 mb-[2px] bg-[#404549] rounded-md mx-1" />
        <span className="inline-block w-1 h-1 mt-[2px] bg-[#404549] rounded-md mx-1" />
      </span>
      <Digit value={seconds} title="SECONDS" addSeparator={false} />
    </span>
  );
}
