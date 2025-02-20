"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";
import ButtonLoader from "@/components/ButtonLoader/page";

export default function Signup() {
  const router = useRouter();
  const [isvalid, setvalid] = useState(false);
  const [checkpassword, setPassword] = useState(false);
  const [isLogged, setLogged] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const { password, confirmpassword } = user;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(false);
    setvalid(false);
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password == confirmpassword) {
      setPassword(false);
      try {
        const response = await fetch(`${url}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          setvalid(true);
          throw new Error("Failed to submit data");
        } else {
          setvalid(false);
          setLogged(true);
          setTimeout(() => {
            router.push("/signin");
          }, 2000);
        }
      } catch (err) {
        console.log("error", err);
      }
    } else {
      setPassword(true);
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
            <div className="text-center space-y-1 2xl:text-2xl text-md  text-xl font-semibold">
              <h1>Welcome back!</h1>
              <p>Please Signup To Your Account</p>
            </div>
            <div className="2xl:w-3/4 w-full">
              <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Name"
                  onChange={handleChange}
                />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Email"
                  onChange={handleChange}
                />
                {isvalid && (
                  <div className="text-left text-sm text-red-600 mx-1">
                    <p>Email Already Existed</p>
                  </div>
                )}
                <Input
                  type="password"
                  id="password"
                  name="password"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Password"
                  onChange={handleChange}
                />

                <Input
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  className="border-[1px] border-gray-300 p-2 text-[#10343c] rounded-[5px] bg-[#F0F4F4]"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                />
                {checkpassword && (
                  <div className="text-left text-sm text-red-600 mx-1">
                    <p>Password Doesnot Match</p>
                  </div>
                )}
                <div className="space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#10343c] w-1/2 text-white rounded-full mt-2"
                  >
                    {isLogged ? <ButtonLoader /> : "Register"}
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
