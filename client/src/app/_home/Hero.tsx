import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AiFillQuestionCircle } from "react-icons/ai";
export default function Hero() {
  return (
    <div>
      <div className="flex items-center justify-center mt-[5%] flex-col">
        <div className="text-center text-5xl font-bold w-3/4 leading-[4.2rem]">
          <h1>
            <span className="bg-gradient-to-r from-[#10343c] to-[#2a9d8f] bg-clip-text text-transparent">
              Revolutionizing
            </span>{" "}
            Coding Education with Advanced AI Solutions
          </h1>
        </div>
        <div className="text-lg  text-[#4a4a4a] mt-4 ">
          <p>
            Learn2Code simplifies coding education by offering AI-driven tools
            for personalized learning
          </p>
        </div>
        <div className="mt-9 space-x-3">
          <Link
            href="/signin"
            className="bg-[#10343c] px-6 py-3 text-white rounded-full font-semibold 2xl:px-8 2xl:py-4"
          >
            Signin
          </Link>
          <Link
            href="/signup"
            className="border-2 border-[#10343c] px-6 py-3 text-black rounded-full font-semibold 2xl:px-8 2xl:py-4"
          >
            Signup
          </Link>
        </div>
      </div>
      <div className="p-10 container mx-auto">
        <div className="grid grid-cols-5 row-span-7 gap-10 ">
          <div className="row-span-9 row-start-1">
            <Image
              src={"/images/student.jpg"}
              width={400}
              height={500}
              alt="student"
              className="h-full w-full object-cover rounded-2xl"
            />
          </div>
          <div className="bg-[#10343c] row-start-2  row-span-8 rounded-2xl flex justify-center items-center flex-col text-white">
            <h1 className="text-2xl font-bold">25,000+ </h1>
            <p className="text-white text-xs font-light text-center">
              Active Learners <br />
              Building Smarter <br /> Future
            </p>
          </div>
          <div className="bg-white  row-start-5 row-span-5 rounded-2xl shadow-lg flex justify-center items-center flex-col">
            <h1 className="text-lg font-bold">Satisfaction Rate</h1>
            <p className="text-2xl font-bold">90%</p>
            <p className="text-xs font-light mt-2">
              Trusted by <strong className="text-green-400">Worldwide</strong>
            </p>
          </div>
          <div className="bg-[#e8fccc] row-start-2 row-span-8 rounded-2xl flex justify-center items-center flex-col text-black ">
            <h1 className="text-2xl font-bold">500+</h1>
            <p className="text-xs font-light text-center">
              {" "}
              Active Users
              <br />
              All Over
              <br />
              The world
            </p>
          </div>
          <div className="bg-[#10343c] p-4 row-start-1 space-y-4 row-span-9 rounded-2xl flex justify-end  flex-col">
            <div>
              <AiFillQuestionCircle className="text-5xl p-2 border-dotted border-white border-2 rounded-full  text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-white text-md">Top 5 Platform</h1>
              <p className="text-white text-xs">Recognized for Excellence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
