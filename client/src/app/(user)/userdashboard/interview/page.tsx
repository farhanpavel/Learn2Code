"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTeamspeak } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { Sparkles, Brain, Target, Trophy, Timer, Users } from "lucide-react";

const interviewData = [
  {
    id: "fundamental",
    title: "Fundamental",
    description: "Perfect for beginners starting their journey",
    bgGradient:
      "bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    icon: Brain,
    stats: {
      questions: 5, // Changed from 20 to 5
      duration: "10 min", // Changed from 30 min to 10 min
      successRate: 85,
      activeUsers: "2.5k",
    },
    topics: ["Basic Algorithms", "Data Structures", "Problem Solving"],
    difficulty: {
      level: "Easy",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900",
    },
  },
  {
    id: "standard",
    title: "Standard",
    description: "For developers with intermediate experience",
    bgGradient:
      "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: Target,
    stats: {
      questions: 7, // Changed from 35 to 7
      duration: "14 min", // Changed from 45 min to 14 min
      successRate: 65,
      activeUsers: "1.8k",
    },
    topics: ["System Design", "Advanced Algorithms", "OOP Concepts"],
    difficulty: {
      level: "Medium",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
  },
  {
    id: "classic",
    title: "Classic",
    description: "Challenge yourself with expert-level questions",
    bgGradient:
      "bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: Trophy,
    stats: {
      questions: 10, // Changed from 50 to 10
      duration: "20 min", // Changed from 60 min to 20 min
      successRate: 45,
      activeUsers: "950",
    },
    topics: ["Architecture", "System Design", "Advanced Concepts"],
    difficulty: {
      level: "Hard",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
  },
];

export default function InterviewSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaTeamspeak className="text-4xl text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Interview Preparation
            </h1>
            <p className="text-muted-foreground">
              Select your challenge level and begin your journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {interviewData.map((level) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`h-full flex flex-col border-2 ${level.borderColor} ${level.bgGradient} backdrop-blur-sm`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      className={`${level.difficulty.bgColor} ${level.difficulty.color}`}
                    >
                      {level.difficulty.level}
                    </Badge>
                    <level.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {level.title}
                  </CardTitle>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">
                        {level.stats.questions}
                      </p>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">
                        {level.stats.duration}
                      </p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">
                        {level.stats.successRate}%
                      </span>
                    </div>
                    <Progress value={level.stats.successRate} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {level.topics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{level.stats.activeUsers} active users</span>
                  </div>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push(`/userdashboard/interview/${level.id}`)
                    }
                  >
                    Start Interview
                    <Timer className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI-powered questions updated daily based on current industry trends
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
