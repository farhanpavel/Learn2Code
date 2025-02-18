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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { url } from "@/components/Url/page";
import { toast } from "@/hooks/use-toast";
import { Clock, Loader2, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoProjectRoadmap } from "react-icons/go";

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

  const createPlanner = async (payload: Result) => {
    const newPlannerData = {
      title: payload.title,
      description: payload.description,
      level: level,
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
      fetchAllPlanners();
      setplan(null);
      setquery("");
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
      <div className="flex gap-x-2 items-center text-black">
        <GoProjectRoadmap className="text-3xl" />
        <h1 className="text-2xl font-bold">Roadmap</h1>
      </div>
      <p className="text-xs text-[#4a4a4a] border-[#d1cece] border-b-[2px] pb-4">
        Create a perfect roadmap for your learning
      </p>
      <div className="py-10 space-y-2 border-[1px] rounded-lg p-8 border-gray-300">
        <h1 className="font-semibold text-black text-2xl">
          Create Your Learning Path
        </h1>
        <p className="text-[#4a4a4a] text-xs">What do you want to learn?</p>
        <div className="space-y-4 mt-5">
          <Input
            type="text"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            className="bg-white w-1/2 border-black focus:ring-black"
          />
          <div className="flex items-center space-x-2">
            <Button
              disabled={loading}
              onClick={generatePlan}
              className="bg-black hover:bg-gray-600 w-1/2"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-1" size={17} />
              ) : (
                <Sparkles className="mr-1" size={17} />
              )}
              Generate
            </Button>
          </div>
        </div>

        {plan?.result && plan?.result?.steps?.length > 0 && (
          <div className=" w-full max-w-3xl">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold mt-5">{plan.result.title}</p>
            </div>

            <p className="text-xs  text-gray-500 mt-2 mb-5">
              {plan.result.description}
            </p>
            <Accordion type="single" collapsible>
              {plan.result.steps.map((item, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="border-0"
                >
                  <AccordionTrigger className="flex justify-end items-center p-0 ">
                    <div className="h-[60px] flex items-center relative">
                      <p className="flex items-center z-20 justify-center h-[30px] mr-3 font-semibold text-xl w-[30px] rounded-full bg-black text-white p-5">
                        {index + 1}
                      </p>
                      <div className="absolute top-0 left-[20px] h-full bottom-0 w-[3px] bg-gray-600"></div>
                    </div>
                    <p className="text-sm mr-2 flex-1">{item.step}</p>
                    <div className="flex items-center mx-2">
                      <Badge
                        className={
                          item.difficulty === "Beginner"
                            ? "bg-green-500"
                            : item.difficulty === "Intermediate"
                            ? "bg-yellow-600"
                            : "bg-red-500"
                        }
                      >
                        {item.difficulty}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.reference_links?.map((link, i) =>
                      link.type === "video" ? (
                        <iframe
                          key={i}
                          width="688"
                          height="387"
                          src={link.embed_url}
                          title={link.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          className="my-2 w-full"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div key={i} className="my-3">
                          <a
                            href={link.url}
                            target="_blank"
                            className="text-xs w-[400px]"
                            rel="noreferrer"
                          >
                            <Badge className="bg-black text-white">
                              Documentation
                            </Badge>{" "}
                            {link.title}{" "}
                            <span className="underline italic text-blue-500">
                              ({link.url})
                            </span>
                          </a>
                        </div>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannerPage;
