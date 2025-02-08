"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaYoutube } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { IoIosDocument } from "react-icons/io";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { url } from "@/components/Url/page";
import { toast } from "@/hooks/use-toast";
import { BadgeAlertIcon, Clock, Loader2, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineSun } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";

export interface Root {
  result: Result;
}

export interface Result {
  title: string;
  description: string;
  steps: Steps[];
  _id?: string;
}

export interface Steps {
  step: string;
  difficulty: string;
  time: number;
  reference_links?: ReferenceLink[];
}

export interface ReferenceLink {
  title: string;
  url: string;
  type: string;
  embed_url?: string;
}

const PlannerPage = () => {
  const [query, setquery] = useState<string>("");
  const [level, setlevel] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const [plan, setplan] = useState<Root | null>(null);
  const [allPlanners, setallPlanners] = useState<Result[]>([]);

  const generatePlan = async () => {
    setloading(true);
    try {
      const res = await fetch(`${url}/api/planner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, level }),
      });
      const data = await res.json();
      console.log(data);
      setplan(data);
    } catch (err) {
      console.error("Error fetching plan:", err);
    }
    setloading(false);
  };

  const fetchAllPlanners = async () => {
    setloading(true);
    try {
      const res = await fetch(`${url}/api/planner`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch planners");
      }

      const data = await res.json();
      setallPlanners(data);
    } catch (err) {
      console.error("Error fetching planners:", err);
    }
    setloading(false);
  };

  // Assuming 'level' and other fields are coming from the client-side input
  const createPlanner = async (payload: Result) => {
    const newPlannerData = {
      title: payload.title,
      description: payload.description,
      level: level, // Make sure level is included here
      steps: payload.steps.map((step) => ({
        step: step.step,
        difficulty: step.difficulty,
        time: step.time,
        reference_links: step.reference_links,
      })),
    };

    setloading(true);
    try {
      const res = await fetch(`${url}/api/planner/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlannerData),
      });

      if (!res.ok) {
        throw new Error("Failed to create planner");
      }

      const data = await res.json();
      console.log(data);
      toast({
        title: "Planner created successfully",
        description: "Your planner has been created successfully",
      });
      // Handle the successful creation response
    } catch (err) {
      console.error("Error creating planner:", err);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchAllPlanners();
  }, []);

  return (
    <div className="p-9 space-y-2">
      <div className="flex gap-x-2 items-center text-green-600">
        <GoProjectRoadmap className="text-3xl" />
        <h1 className="text-2xl font-bold">Roadmap</h1>
      </div>
      <p className="text-xs text-[#4a4a4a]  border-[#d1cece] border-b-[2px] pb-4">
        Create a perfect roadmap for your learning
      </p>
      <div className="py-10 space-y-2 border-[1px] rounded-lg p-8 border-gray-300">
        <h1 className=" font-semibold text-green-600 text-2xl">
          Create Your Learning Path
        </h1>
        <p className="text-[#4a4a4a] text-xs">What do you want to learn?</p>
        <div className="  space-y-4 mt-5">
          <Input
            type="text"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            className="bg-white w-1/2"
          />
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label className="text-xs text-[#4a4a4a]">Kisu akta dio</Label>
          </div>
          <Button
            disabled={loading}
            onClick={generatePlan}
            className="bg-green-800 hover:bg-green-600 w-1/2"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-1" size={17} />
            ) : (
              <Sparkles className="mr-1" size={17} />
            )}{" "}
            Generate
          </Button>
        </div>
        <div></div>
        {loading && (
          <p className="mt-5 text-center text-sm text-green-600">
            Generating a plan for you...
          </p>
        )}
        <div className="p-4">
          <h1 className="text-lg">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi,
            nihil.
          </h1>
          <p className="text-xs">Semititle</p>

          {/* Benefit 1 */}
          <div className="mt-10 flex space-x-2">
            <div className="grid grid-cols-[auto,1fr] gap-x-6 items-start">
              <div className="h-full grid grid-cols-1 grid-rows-[max(44px),1fr]">
                <div className="h-[44px] w-[44px] rounded-full bg-green-800 text-white flex justify-center items-center">
                  <span className="font-bold">1</span>
                </div>
                <div className="h-full flex justify-center">
                  <div className="w-1 h-8 border-l-2  border-green-800"></div>
                </div>
              </div>
              <div className="space-x-2 space-y-2">
                <p className="text-xs w-[75%] ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Repudiandae, enim at. Dolorem sint maiores deleniti quod ullam
                  vero, molestias numquam?
                </p>
                <Badge
                  variant="destructive"
                  className="cursor-pointer text-xs space-x-1"
                >
                  <div>
                    <FaYoutube className="text-xs" />
                  </div>
                  <div>
                    <h1>Youtube</h1>
                  </div>
                </Badge>
                <Badge className="bg-gray-500 text-white cursor-pointer text-xs space-x-1">
                  <div>
                    <IoIosDocument className="text-xs" />
                  </div>
                  <div>
                    <h1>Documentation</h1>
                  </div>
                </Badge>
                <Badge className="bg-blue-500 text-white hover:bg-blue-300 cursor-pointer text-xs space-x-1">
                  <div>
                    <IoMdTime className="text-xs" />
                  </div>
                  <div>
                    <h1>Time Frame</h1>
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="grid grid-cols-[auto,1fr] gap-x-6 items-start">
              <div className="h-full grid grid-cols-1 grid-rows-[max(44px),1fr]">
                <div className="h-[44px] w-[44px] rounded-full bg-green-800 text-white flex justify-center items-center">
                  <span className="font-bold">2</span>
                </div>
                <div className="h-full flex justify-center">
                  <div className="w-1 h-8 border-l-2  border-green-800"></div>
                </div>
              </div>
              <div className="space-x-2 space-y-2">
                <p className="text-xs w-[75%] ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Repudiandae, enim at. Dolorem sint maiores deleniti quod ullam
                  vero, molestias numquam?
                </p>
                <Badge
                  variant="destructive"
                  className="cursor-pointer text-xs space-x-1"
                >
                  <div>
                    <FaYoutube className="text-xs" />
                  </div>
                  <div>
                    <h1>Youtube</h1>
                  </div>
                </Badge>
                <Badge className="bg-gray-500 text-white cursor-pointer text-xs space-x-1">
                  <div>
                    <IoIosDocument className="text-xs" />
                  </div>
                  <div>
                    <h1>Documentation</h1>
                  </div>
                </Badge>
                <Badge className="bg-blue-500 text-white hover:bg-blue-300 cursor-pointer text-xs space-x-1">
                  <div>
                    <IoMdTime className="text-xs" />
                  </div>
                  <div>
                    <h1>Time Frame</h1>
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          <div className=" flex space-x-2">
            <div className="grid grid-cols-[auto,1fr] gap-x-6 items-start">
              <div className="h-full grid grid-cols-1 grid-rows-[max(44px),1fr]">
                <div className="h-[44px] w-[44px] rounded-full bg-green-800 text-white flex justify-center items-center">
                  <span className="font-bold">3</span>
                </div>
                <div className="h-full flex justify-center">
                  <div className="w-1  border-l-2  border-green-800"></div>
                </div>
              </div>
              <div className="space-x-2 space-y-2">
                <p className="text-xs w-[75%] ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Repudiandae, enim at. Dolorem sint maiores deleniti quod ullam
                  vero, molestias numquam?
                </p>
                <Badge
                  variant="destructive"
                  className="cursor-pointer text-xs space-x-1"
                >
                  <div>
                    <FaYoutube className="text-xs" />
                  </div>
                  <div>
                    <h1>Youtube</h1>
                  </div>
                </Badge>
                <Badge className="bg-gray-500 text-white cursor-pointer text-xs space-x-1">
                  <div>
                    <IoIosDocument className="text-xs" />
                  </div>
                  <div>
                    <h1>Documentation</h1>
                  </div>
                </Badge>
                <Badge className="bg-blue-500 text-white hover:bg-blue-300 cursor-pointer text-xs space-x-1">
                  <div>
                    <IoMdTime className="text-xs" />
                  </div>
                  <div>
                    <h1>Time Frame</h1>
                  </div>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;
