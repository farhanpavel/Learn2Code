"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ButtonLoader from "@/components/ButtonLoader/page";
import { url } from "@/components/Url/page";

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
    if (password === confirmpassword) {
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl bg-white rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-lg shadow-[#10343c]/20"
        >
          {/* Form section */}
          <div className="w-full sm:w-1/2 p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-6"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/images/logo2.png"
                    width={180}
                    height={180}
                    alt="logo"
                    className="mb-2"
                  />
                </motion.div>
              </div>

              <div className="text-center space-y-2">
                <motion.h1
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-[#10343c]"
                >
                  Create an Account
                </motion.h1>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground"
                >
                  Please fill in your details to sign up
                </motion.p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    className="border p-2 rounded-lg bg-[#F0F4F4] border-gray-300"
                    onChange={handleChange}
                    required
                  />

                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    className={`border p-2 rounded-lg bg-[#F0F4F4] ${
                      isvalid ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handleChange}
                    required
                  />
                  {isvalid && (
                    <motion.p
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-red-600 px-1"
                    >
                      Email already exists
                    </motion.p>
                  )}

                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className={`border p-2 rounded-lg bg-[#F0F4F4] ${
                      checkpassword ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    type="password"
                    id="confirmpassword"
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    className={`border p-2 rounded-lg bg-[#F0F4F4] ${
                      checkpassword ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handleChange}
                    required
                  />
                  {checkpassword && (
                    <motion.p
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-red-600 px-1"
                    >
                      Passwords do not match
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#10343c] hover:bg-[#10343c]/90 text-white py-5 rounded-lg transition-all duration-200 hover:shadow-md"
                  disabled={isLogged}
                >
                  {isLogged ? <ButtonLoader /> : "Create Account"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="font-medium text-[#10343c] hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Image section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full sm:w-1/2 bg-[#F0F4F4] hidden sm:flex items-center justify-center p-6"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/images/signup.png"
                width={500}
                height={400}
                alt="Sign up illustration"
                className="object-contain max-h-[400px]"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
