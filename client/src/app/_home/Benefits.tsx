import React from "react";
import { GiMoebiusStar } from "react-icons/gi";
import { WiDirectionUpRight } from "react-icons/wi";
import { RiBox1Line } from "react-icons/ri";
import { FaScrewdriver } from "react-icons/fa";
import { GoShieldCheck } from "react-icons/go";
import { TbMessageCircleQuestion } from "react-icons/tb";
export default function Benefits() {
  return (
    <div>
      <div className="flex justify-center mt-4">
        <h1 className="text-center font-semibold text-white text-xl border-b-[3px] uppercase">
          Benefits
        </h1>
      </div>
      {/* parent */}
      <div className="container mx-auto">
        <div className="grid grid-cols-3 p-10 gap-10">
          <div className="bg-[#183c44] shadow-lg rounded-lg">
            <div className="flex justify-between p-4">
              <div>
                <GiMoebiusStar className="text-3xl text-white" />
              </div>
              <div>
                <WiDirectionUpRight className="text-2xl text-white" />
              </div>
            </div>
            <div className="text-white p-7 space-y-3">
              <h1 className="text-lg font-bold">Learn Faster</h1>
              <p className="text-xs font-light leading-[1.2rem]">
                Get personalized roadmaps that help you learn in the most
                efficient way possible. Tailored paths save time and guide you
                through every step of your coding journey
              </p>
            </div>
          </div>
          <div className="bg-[#183c44] shadow-lg rounded-lg">
            <div className="flex justify-between p-4">
              <div>
                <RiBox1Line className="text-3xl text-white" />
              </div>
              <div>
                <WiDirectionUpRight className="text-2xl text-white" />
              </div>
            </div>
            <div className="text-white p-7 space-y-3">
              <h1 className="text-lg font-bold">Code Smarter</h1>
              <p className="text-xs font-light  leading-[1.2rem]">
                With our AI-assisted code editor, optimize your code as you go.
                The smart suggestions help refine your logic and improve
                performance in real-time.
              </p>
            </div>
          </div>
          <div className="bg-[#183c44] shadow-lg rounded-lg">
            <div className="flex justify-between p-4">
              <div>
                <FaScrewdriver className="text-3xl text-white" />
              </div>
              <div>
                <WiDirectionUpRight className="text-2xl text-white" />
              </div>
            </div>
            <div className="text-white p-7 space-y-3">
              <h1 className="text-lg font-bold">Stay Organized</h1>
              <p className="text-xs font-light  leading-[1.2rem]">
                Easily manage your learning progress and plans. Track your
                achievements, set new goals, and stay motivated by seeing your
                improvements over time.
              </p>
            </div>
          </div>

          <div className="bg-[#183c44] shadow-lg rounded-lg">
            <div className="flex justify-between p-4">
              <div>
                <FaScrewdriver className="text-3xl text-white" />
              </div>
              <div>
                <WiDirectionUpRight className="text-2xl text-white" />
              </div>
            </div>
            <div className="text-white p-7 space-y-3">
              <h1 className="text-lg font-bold">Instant Feedback</h1>
              <p className="text-xs font-light  leading-[1.2rem]">
                Get immediate feedback on your quizzes and assignments. Our AI
                not only provides the right answers but also offers explanations
                to help you understand your mistakes.
              </p>
            </div>
          </div>
          <div className="bg-[#183c44] shadow-lg rounded-lg">
            <div className="flex justify-between p-4">
              <div>
                <GoShieldCheck className="text-3xl text-white" />
              </div>
              <div>
                <WiDirectionUpRight className="text-2xl text-white" />
              </div>
            </div>
            <div className="text-white p-7 space-y-3">
              <h1 className="text-lg font-bold">Explore Resources</h1>
              <p className="text-xs font-light  leading-[1.2rem]">
                Discover a variety of tutorials, eBooks, videos, and coding
                exercises. No need to jump between different platforms,
                everything you need is in one place.{" "}
              </p>
            </div>
          </div>
          <div className="bg-[#183c44] shadow-lg rounded-lg">
            <div className="flex justify-between p-4">
              <div>
                <TbMessageCircleQuestion className="text-3xl text-white" />
              </div>
              <div>
                <WiDirectionUpRight className="text-2xl text-white" />
              </div>
            </div>
            <div className="text-white p-7 space-y-3">
              <h1 className="text-lg font-bold">Ask Anything</h1>
              <p className="text-xs font-light  leading-[1.2rem]">
                Have questions? Upload study materials, and our AI will answer
                them in context. From understanding concepts to solving
                problems, it’s like having a personal tutor.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
