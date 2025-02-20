"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface SigninFormData {
  email: string;
  password: string;
}

export default function Signin() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        alert("Error");
        throw new Error("Failed to login");
      }
      const data = await response.json();
      Cookies.set("AccessToken", data.accessToken);
      Cookies.set("RefreshToken", data.refreshToken);
      alert("SuccessFul");
      router.push("/userdashboard/overview");
    } catch (err) {
      console.log("Error", err);
    }
  };
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
            <div className="text-center space-y-1 2xl:text-2xl text-md font- text-xl  font-[700]">
              <h1>Welcome back!</h1>
              <p>Please Login To Your Account</p>
            </div>
            <div className="2xl:w-3/4 w-full">
              <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="border border-gray-300 p-2 text-[#4a4a4a] rounded-[5px] bg-[#F0F4F4] "
                  onChange={handleChange}
                />

                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  name="password"
                  className="border border-gray-300 p-2 text-[#4a4a4a] rounded-[5px] bg-[#F0F4F4] "
                  onChange={handleChange}
                />

                <div className="space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#10343c]  w-1/2 text-white rounded-full mt-2"
                  >
                    Login
                  </button>
                </div>
              </form>
              <div>
                <h1 className="text-sm text-center mt-4">
                  Forgot Password?{" "}
                  <Link href={"/signup"} className="font-bold text-[#10343c]">
                    Signup
                  </Link>
                </h1>
              </div>
            </div>
          </div>
          <div className="order-first sm:order-last lg:flex items-center hidden">
            <Image
              src="/images/signin.png"
              width={500}
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
