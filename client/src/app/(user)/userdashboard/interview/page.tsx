"use client";
import React from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlay } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa"; // Changed icon to microphone 🎤
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
export default function DialogUploaderDemo() {
  const [files, setFiles] = React.useState<File[]>([]);
  const router = useRouter();
  const handleClick = (e: string) => {
    router.push(`/userdashboard/interview/${e}`);
  };
  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="mb-10">
          <div className="flex gap-x-2 items-center text-green-600">
            <FaTeamspeak className="text-3xl" />
            <h1 className="text-2xl font-bold">Interview</h1>
          </div>
          <p className="text-xs text-[#4a4a4a] border-[#d1cece] border-b-[2px] pb-4">
            Create a perfect Interview for your Job
          </p>
        </div>

        <div className="flex justify-around">
          {/* Fundamental Level */}
          <Card className="w-[350px] h-[350px] shadow-lg border border-red-400 hover:scale-105 transition-transform duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-red-600 text-xl font-bold">
                Fundamental
              </CardTitle>
              <CardDescription className="text-gray-600">
                A beginner-friendly set to start your journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-grow">
              <FaMicrophone className="text-5xl text-red-600 animate-pulse" />
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto border-t pt-3">
              <span className="text-sm text-gray-500">Difficulty: Easy</span>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleClick("fundamental")}
              >
                Enter
              </Button>
            </CardFooter>
          </Card>

          {/* Standard Level */}
          <Card className="w-[350px] h-[350px] shadow-lg border border-blue-400 hover:scale-105 transition-transform duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-blue-600 text-xl font-bold">
                Standard
              </CardTitle>
              <CardDescription className="text-gray-600">
                A balanced level for moderate challenge.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-grow">
              <FaMicrophone className="text-5xl text-blue-600 animate-pulse" />
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto border-t pt-3">
              <span className="text-sm text-gray-500">Difficulty: Medium</span>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleClick("standard")}
              >
                Enter
              </Button>
            </CardFooter>
          </Card>

          {/* Classic Level */}
          <Card className="w-[350px] h-[350px] shadow-lg border border-green-400 hover:scale-105 transition-transform duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-green-600 text-xl font-bold">
                Classic
              </CardTitle>
              <CardDescription className="text-gray-600">
                The ultimate test for mastering skills.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-grow">
              <FaMicrophone className="text-5xl text-green-600 animate-pulse" />
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto border-t pt-3">
              <span className="text-sm text-gray-500">Difficulty: Hard</span>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleClick("classic")}
              >
                Enter
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
