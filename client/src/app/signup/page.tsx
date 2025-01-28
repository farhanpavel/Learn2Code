"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Signup() {
  return (
    <div className="container mx-auto">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[80%] sm:w-3/4 m-auto  flex flex-wrap sm:flex-nowrap  shadow-lg shadow-[#10343c] justify-around text-center p-16 ">
          <div className="space-y-7 flex flex-wrap flex-col justify-center items-center">
            <div>
              <Image
                src="/images/logo2.png"
                width={200}
                height={200}
                alt="logo"
              />
            </div>
            <div className="text-center space-y-1 2xl:text-2xl text-md  text-xl font-semibold">
              <h1>Welcome back!</h1>
              <p>Please Signup To Your Account</p>
            </div>
            <div className="2xl:w-3/4 w-full">
              <form className="flex flex-col gap-y-2">
                <input
                  type="text"
                  name="name"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Password"
                />
                <input
                  type="password"
                  name="confirmpassword"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Confirm Password"
                />

                <div className="space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#10343c] w-1/2 text-white rounded-full mt-2"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="order-first sm:order-last lg:flex items-center hidden">
            <Image
              src="/images/signup.png"
              width={400}
              height={400}
              alt="logo"
              className="lg:w-[400px] md:w-[300px] 2xl:w-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
