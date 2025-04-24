"use client";
import React from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { GiMoebiusStar } from "react-icons/gi";
import { WiDirectionUpRight } from "react-icons/wi";
import { RiBox1Line } from "react-icons/ri";
import { FaScrewdriver } from "react-icons/fa";
import { GoShieldCheck } from "react-icons/go";
import { TbMessageCircleQuestion } from "react-icons/tb";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const iconVariants: Variants = {
  hover: {
    scale: 1.2,
    rotate: 360,
    transition: { duration: 0.6 },
  },
};

const arrowVariants: Variants = {
  hover: {
    x: 5,
    y: -5,
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const, // Explicitly type as "reverse"
      duration: 1,
    },
  },
};

const BenefitCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <motion.div
    className="bg-[#183c44] shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-2xl hover:scale-105"
    variants={cardVariants}
    whileHover={{ y: -5 }}
  >
    <div className="flex justify-between p-4">
      <motion.div variants={iconVariants} whileHover="hover">
        <Icon className="text-3xl text-white" />
      </motion.div>
      <motion.div variants={arrowVariants} whileHover="hover">
        <WiDirectionUpRight className="text-2xl text-white" />
      </motion.div>
    </div>
    <div className="text-white p-7 space-y-3">
      <h1 className="text-lg font-bold">{title}</h1>
      <p className="text-xs font-light leading-[1.2rem]">{description}</p>
    </div>
  </motion.div>
);

export default function Benefits() {
  const benefits = [
    {
      icon: GiMoebiusStar,
      title: "Learn Faster",
      description:
        "Get personalized roadmaps that help you learn in the most efficient way possible. Tailored paths save time and guide you through every step of your coding journey",
    },
    {
      icon: RiBox1Line,
      title: "Code Smarter",
      description:
        "With our AI-assisted code editor, optimize your code as you go. The smart suggestions help refine your logic and improve performance in real-time.",
    },
    {
      icon: FaScrewdriver,
      title: "Stay Organized",
      description:
        "Easily manage your learning progress and plans. Track your achievements, set new goals, and stay motivated by seeing your improvements over time.",
    },
    {
      icon: FaScrewdriver,
      title: "Instant Feedback",
      description:
        "Get immediate feedback on your quizzes and assignments. Our AI not only provides the right answers but also offers explanations to help you understand your mistakes.",
    },
    {
      icon: GoShieldCheck,
      title: "Explore Resources",
      description:
        "Discover a variety of tutorials, eBooks, videos, and coding exercises. No need to jump between different platforms, everything you need is in one place.",
    },
    {
      icon: TbMessageCircleQuestion,
      title: "Ask Anything",
      description:
        "Have questions? Upload study materials, and our AI will answer them in context. From understanding concepts to solving problems, it's like having a personal tutor.",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex justify-center mt-4">
        <motion.h1
          className="text-center font-semibold text-white text-xl border-b-[3px] uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Benefits
        </motion.h1>
      </div>

      <div className="container mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-10 gap-10"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
