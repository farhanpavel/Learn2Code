"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { url } from "@/components/Url/page";

const Signin = () => {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValid(false);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLogged(true);
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        setIsValid(true);
        setIsLogged(false);
        throw new Error("Failed to login");
      }

      setIsValid(false);
      const data = await response.json();

      setTimeout(() => {
        Cookies.set("AccessToken", data.accessToken);
        Cookies.set("RefreshToken", data.refreshToken);
        router.push("/userdashboard/overview");
      }, 2000);
    } catch (err) {
      console.log("Error", err);
      setIsLogged(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Google sign-in clicked");
    // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
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
          <div className="w-full sm:w-1/2 p-6 md:p-10 flex flex-col justify-center">
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
                  Welcome back!
                </motion.h1>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground"
                >
                  Please login to your account
                </motion.p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className={`border p-2 rounded-lg bg-[#F0F4F4] ${
                      isValid ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handleChange}
                    required
                  />
                  {isValid && (
                    <motion.p
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-red-600 px-1"
                    >
                      Invalid email or password
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className={`border p-2 rounded-lg bg-[#F0F4F4] ${
                      isValid ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#10343c] hover:bg-[#10343c]/90 text-white py-5 rounded-lg transition-all duration-200 hover:shadow-md"
                    disabled={isLogged}
                  >
                    {isLogged ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </form>

              <div className="relative flex items-center justify-center my-6">
                <Separator className="absolute w-full" />
                <span className="relative px-4 bg-white text-sm text-muted-foreground">
                  or continue with
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.0223 13.607 12.1761 15.0001 9.99984 15.0001C7.23859 15.0001 4.99984 12.7613 4.99984 10.0001C4.99984 7.23884 7.23859 5.00008 9.99984 5.00008C11.2744 5.00008 12.4344 5.48229 13.317 6.27113L15.674 3.91408C14.1857 2.5188 12.2094 1.66675 9.99984 1.66675C5.39775 1.66675 1.6665 5.39799 1.6665 10.0001C1.6665 14.6022 5.39775 18.3334 9.99984 18.3334C14.6019 18.3334 18.3332 14.6022 18.3332 10.0001C18.3332 9.44121 18.2757 8.89579 18.1711 8.36788Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M2.62744 6.12133L5.36536 8.12925C6.10619 6.29511 7.90036 5.00008 9.99994 5.00008C11.2745 5.00008 12.4345 5.48229 13.317 6.27113L15.674 3.91408C14.1857 2.5188 12.2095 1.66675 9.99994 1.66675C6.74869 1.66675 3.91036 3.47383 2.62744 6.12133Z"
                      fill="#FF3D00"
                    />
                    <path
                      d="M10.0001 18.3334C12.1709 18.3334 14.1138 17.5105 15.5926 16.1563L13.0084 13.9855C12.1526 14.6353 11.1109 15.0001 10.0001 15.0001C7.83088 15.0001 5.98963 13.6167 5.29796 11.6855L2.58838 13.7834C3.85546 16.4813 6.71713 18.3334 10.0001 18.3334Z"
                      fill="#4CAF50"
                    />
                    <path
                      d="M18.1711 8.36796H17.4998V8.33337H9.99984V11.6667H14.7094C14.3848 12.5902 13.7897 13.3972 13.0071 13.9859L13.0084 13.9851L15.5926 16.1559C15.4068 16.3271 18.3332 14.1667 18.3332 10.0001C18.3332 9.44129 18.2757 8.89587 18.1711 8.36796Z"
                      fill="#1976D2"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </Button>
              </motion.div>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-[#10343c] hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#10343c] hover:underline mt-2 inline-block"
                >
                  Forgot password?
                </Link>
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
                src="/images/signin.png"
                width={500}
                height={400}
                alt="Sign in illustration"
                className="object-contain max-h-[400px]"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;
