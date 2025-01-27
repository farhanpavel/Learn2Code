import React from "react";
import Link from "next/link";
import Image from "next/image";
export default function Hero() {
  return (
    <div>
      <div className="flex items-center justify-center mt-[5%] flex-col">
        <div className="text-center text-5xl font-bold w-3/4 leading-[4.2rem]">
          <h1>Revolutionizing Coding Education with Advanced AI Solutions</h1>
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
            href="/signin"
            className="border-2 border-[#10343c] px-6 py-3 text-black rounded-full font-semibold 2xl:px-8 2xl:py-4"
          >
            Signup
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="grid row-span-11">
          <Image
            src={"/images/student.jpg"}
            width={300}
            height={500}
            alt="student"
          />
        </div>
        <div className="bg-[#10343c]">
          <h1>100+</h1>
          <p>Country</p>
        </div>
        <div className="bg-white">
          <h1>Total Users</h1>
          <p>1000+</p>
          <p>
            Increase rate <span>10%</span>
          </p>
        </div>
        <div className="bg-[#e8fccc]">
          <h1>3rd</h1>
          <p>Rank Worldwide</p>
        </div>
        <div className="bg-[#10343c]">
          <h1>100+</h1>
          <p>Country</p>
        </div>
      </div>
    </div>
  );
}
