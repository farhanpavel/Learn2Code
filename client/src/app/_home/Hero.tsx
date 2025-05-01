"use client";
import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { AiFillQuestionCircle } from "react-icons/ai";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const cardVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

const Hero = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="overflow-hidden"
    >
      <motion.div className="flex items-center justify-center mt-8 md:mt-12 lg:mt-[5%] flex-col">
        <motion.div
          variants={itemVariants}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-bold w-full sm:w-5/6 md:w-3/4 leading-tight md:leading-[4.2rem]"
        >
          <h1>
            <span className="bg-gradient-to-r from-[#10343c] to-[#2a9d8f] bg-clip-text text-transparent">
              Revolutionizing
            </span>{" "}
            Coding Education with Advanced AI Solutions
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-base md:text-lg text-[#4a4a4a] mt-4 text-center"
        >
          <p>
            Learn2Code simplifies coding education by offering AI-driven tools
            for personalized learning
          </p>
        </motion.div>

        <div className="mb-5 md:mb-0 mt-9 space-x-3">
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
      </motion.div>

      {/* Grid Section */}
      <motion.div
        variants={itemVariants}
        className="p-4 sm:p-6 md:p-10 container mx-auto "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-10">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="row-span-1 lg:row-span-9 lg:row-start-1 h-64 sm:h-80 md:h-auto"
          >
            <img
              src="/images/student.jpg"
              alt="student"
              className="h-full w-full object-cover rounded-2xl"
            />
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-[#10343c] row-span-1 lg:row-start-2 lg:row-span-8 rounded-2xl flex justify-center items-center flex-col text-white p-6 sm:p-4"
          >
            <h1 className="text-2xl font-bold">25,000+ </h1>
            <p className="text-white text-xs font-light text-center">
              Active Learners <br />
              Building Smarter <br /> Future
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white row-span-1 lg:row-start-5 lg:row-span-5 rounded-2xl shadow-lg flex justify-center items-center flex-col p-6 sm:p-4"
          >
            <h1 className="text-lg font-bold">Satisfaction Rate</h1>
            <p className="text-2xl font-bold">90%</p>
            <p className="text-xs font-light mt-2">
              Trusted by <strong className="text-green-400">Worldwide</strong>
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-[#e8fccc] row-span-1 lg:row-start-2 lg:row-span-8 rounded-2xl flex justify-center items-center flex-col text-black p-6 sm:p-4"
          >
            <h1 className="text-2xl font-bold">500+</h1>
            <p className="text-xs font-light text-center">
              Active Users
              <br />
              All Over
              <br />
              The world
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-[#10343c] p-4 row-span-1 row-start-1 space-y-4 lg:row-span-9 rounded-2xl flex flex-row lg:flex-col justify-between lg:justify-end items-center md:items-start"
          >
            <div>
              <AiFillQuestionCircle className="text-5xl p-2 border-dotted border-white border-2 rounded-full  text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-white text-md">Top 5 Platform</h1>
              <p className="text-white text-xs">Recognized for Excellence</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
