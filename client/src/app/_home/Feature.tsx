import Image from "next/image";
import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
export default function Feature() {
  return (
    <div>
      <div className="flex justify-center mt-4">
        <h1 className="text-center font-semibold text-black border-[#10343c] text-xl border-b-[3px] uppercase">
          Features
        </h1>
      </div>
      <div className=" flex justify-evenly container mx-auto p-5">
        <div>
          <Image
            src={"/images/vector.png"}
            width={520}
            height={500}
            alt="vector"
          />
        </div>
        <div className="w-1/3 flex flex-col justify-center gap-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#10343c]">
              Discover features that make coding easier and faster
            </h1>
            <p className="text-xs font-light">
              Unlock essential features for an optimized learning experience.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-x-3">
              <div>
                <IoMdCheckmarkCircleOutline className="text-lg mt-1 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-lg font-bold">
                  Personalized Learning Path
                </h1>
                <p className="text-xs text-[#4a4a4a] leading-[1.2rem]">
                  Receive a customized roadmap that fits your goals and
                  schedule. Learn at your own pace with topics tailored to your
                  current skills and interests.
                </p>
              </div>
            </div>
            <div className="flex gap-x-3">
              <div>
                <IoMdCheckmarkCircleOutline className="text-lg mt-1 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-lg font-bold">Interactive Quizzes</h1>
                <p className="text-xs text-[#4a4a4a] leading-[1.2rem]">
                  Challenge yourself with quizzes that adapt to your learning
                  progress. Receive feedback to strengthen your understanding
                  and test your knowledge effectively.
                </p>
              </div>
            </div>
            <div className="flex gap-x-3">
              <div>
                <IoMdCheckmarkCircleOutline className="text-lg mt-1 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-lg font-bold">AI-Powered Code Editor</h1>
                <p className="text-xs text-[#4a4a4a] leading-[1.2rem]">
                  Write and test your code directly in the browser with an
                  integrated AI assistant. Get instant suggestions and
                  optimization tips to improve your code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
