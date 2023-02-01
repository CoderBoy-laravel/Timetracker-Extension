import React from "react";

interface digitType {
  value: number;
  title: string;
  addSeparator: boolean;
}

export default function WhiteDigit({ value, title }: digitType) {
  const leftDigit = value >= 10 ? value.toString()[0] : "0";
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString();
  return (
    <span className="flex flex-col items-center my-[5px] first:ml-0">
      <span className="flex flex-row p-0">
        <span className="relative flex flex-[0_1_25%] text-sm rounded-md text-white first:mr-[2px]">
          {leftDigit}
        </span>
        <span className="relative flex flex-[0_1_25%] text-sm rounded-md text-white first:mr-[2px]">
          {rightDigit}
        </span>
      </span>
    </span>
  );
}
