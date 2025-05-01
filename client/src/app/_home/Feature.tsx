"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, Code, Brain, Zap, Target, BookOpen } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

const FeatureItem = ({
  Icon,
  title,
  description,
}: {
  Icon: any;
  title: string;
  description: string;
}) => (
  <motion.div className="flex gap-x-4 group" variants={itemVariants}>
    <div className="mt-1">
      <div className="p-2 rounded-lg bg-teal-100 text-[#10343c] group-hover:bg-[#10343c] group-hover:text-teal-100 transition-all duration-300">
        <Icon size={20} />
      </div>
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-[#10343c] group-hover:text-teal-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Feature() {
  const features = [
    {
      Icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Advanced algorithms adapt to your learning style, creating personalized paths that optimize your coding education journey.",
    },
    {
      Icon: Code,
      title: "Interactive Coding Environment",
      description:
        "Write, test, and debug code in real-time with our powerful integrated development environment designed for learning.",
    },
    {
      Icon: Target,
      title: "Goal-Oriented Projects",
      description:
        "Build real-world projects that align with your career goals, guided by industry best practices and modern standards.",
    },
    {
      Icon: BookOpen,
      title: "Comprehensive Resources",
      description:
        "Access a vast library of tutorials, documentation, and learning materials curated by industry experts.",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-white to-teal-50" id="feature">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-center text-[#10343c] text-xl font-bold uppercase border-b-4 border-[#10343c] pb-2">
              Features
            </h2>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-200 to-[#10343c] rounded-lg opacity-20 blur-lg"></div>
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                alt="Coding Features"
                className="rounded-lg shadow-2xl relative z-10 w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 space-y-8"
            variants={containerVariants}
          >
            <div className="space-y-4 mb-8">
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-[#10343c]"
                variants={itemVariants}
              >
                Discover powerful features that accelerate your learning
              </motion.h3>
              <motion.p className="text-gray-600" variants={itemVariants}>
                Our platform combines cutting-edge technology with proven
                learning methodologies to help you master coding efficiently.
              </motion.p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <FeatureItem key={index} {...feature} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
