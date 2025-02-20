"use client";
import React, { useEffect } from "react";
import { timeline } from "motion";

export default function ButtonLoader() {
  useEffect(() => {
    const draw = (progress: number) => ({
      strokeDashoffset: 1 - progress,
      visibility: "visible",
    });

    timeline([["path", draw(1), { duration: 3, delay: 0.3 }]]);
  }, []);

  return (
    <div className=" top-0 left-0 right-0 bottom-0 flex items-center justify-center ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-6"
      >
        <path
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          pathLength="1"
          style={{
            fill: "transparent",
            stroke: "white",
            strokeWidth: "2px",
            strokeDasharray: "1",
            strokeDashoffset: "1",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            visibility: "hidden",
          }}
        ></path>
      </svg>
    </div>
  );
}
