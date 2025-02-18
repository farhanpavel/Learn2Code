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
          <div className="flex gap-x-2 items-center text-black">
            <FaTeamspeak className="text-3xl" />
            <h1 className="text-2xl font-bold">Interview</h1>
          </div>
          <p className="text-xs text-[#4a4a4a] border-[#d1cece] border-b-[2px] pb-4">
            Create a perfect Interview for your Job
          </p>
        </div>

        <div className="flex justify-around">
          {/* Fundamental Level */}
          <Card className="w-[300px] h-[300px] shadow-lg border border-black hover:scale-105 transition-transform duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-black text-xl font-bold">
                Fundamental
              </CardTitle>
              <CardDescription className="text-gray-600">
                A beginner-friendly set to start your journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-grow">
              <FaMicrophone className="text-5xl text-black animate-pulse" />
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto border-t pt-3">
              <span className="text-sm text-green-700">Difficulty: Easy</span>
              <Button
                className="bg-black "
                onClick={() => handleClick("fundamental")}
              >
                Enter
              </Button>
            </CardFooter>
          </Card>

          {/* Standard Level */}
          <Card className="w-[300px] h-[300px] shadow-lg border border-black hover:scale-105 transition-transform duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-black text-xl font-bold">
                Standard
              </CardTitle>
              <CardDescription className="text-gray-600">
                A balanced level for moderate challenge.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-grow">
              <FaMicrophone className="text-5xl text-black animate-pulse" />
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto border-t pt-3">
              <span className="text-sm text-blue-700">Difficulty: Medium</span>
              <Button
                className="bg-black "
                onClick={() => handleClick("standard")}
              >
                Enter
              </Button>
            </CardFooter>
          </Card>

          {/* Classic Level */}
          <Card className="w-[300px] h-[300px] shadow-lg border border-black hover:scale-105 transition-transform duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-black text-xl font-bold">
                Classic
              </CardTitle>
              <CardDescription className="text-gray-600">
                The ultimate test for mastering skills.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-grow">
              <FaMicrophone className="text-5xl text-black animate-pulse" />
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto border-t pt-3">
              <span className="text-sm text-red-700">Difficulty: Hard</span>
              <Button
                className="bg-black "
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
