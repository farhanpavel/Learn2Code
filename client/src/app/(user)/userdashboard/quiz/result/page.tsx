"use client";
import React, { useEffect, useState } from "react";
import { FaRegLightbulb } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
import { AiOutlineReload } from "react-icons/ai";
import { IoMdArrowRoundForward } from "react-icons/io";
import { Textarea } from "@/components/ui/textarea";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import ScaleLoader from "react-spinners/ScaleLoader";
import Cookies from "js-cookie";
interface QuizResult {
  _id: string;
  comment: string;
  correctness: string;
  original_answer: string;
  question: string;
  ans: string;
}

export default function Page() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state
  const title = Cookies.get("title");
  const user_id = "123";
  const API_URL = `${url}/api/question/data/${user_id}/${title}`;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(API_URL);
        const data: QuizResult[] = await response.json();
        setQuizResults(data);
        updatePoints(data);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchResults();
  }, []);

  const updatePoints = (results: QuizResult[]) => {
    const correctAnswersCount = results.filter(
      (item) => item.correctness === "100%"
    ).length;
    setPoints(correctAnswersCount); // Update the points based on the count of 100% answers
  };

  const getColor = (correctness: string) => {
    const percent = parseInt(correctness.replace("%", ""));
    if (percent === 100) return "bg-green-800";
    if (percent >= 75) return "bg-blue-600";
    if (percent >= 50) return "bg-orange-400";
    if (percent >= 25) return "bg-yellow-500";
    return "bg-red-800";
  };

  return (
    <div className="p-9">
      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <ScaleLoader color="black" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full border-b-2 border-black  pb-4">
            <div className="space-y-2">
              <div className="flex gap-x-2 items-center text-green-600">
                <FaRegLightbulb className="text-3xl" />
                <h1 className="text-2xl font-bold">Take Quiz</h1>
              </div>
              <p className="text-xs text-[#4a4a4a]">
                Take all of your Quizzes here!
              </p>
            </div>

            <div className="flex space-x-2 items-center">
              <p className="mx-10 text-green-800 font-bold">Points: {points}</p>
              <Button
                disabled
                className="px-6 py-2 bg-green-800 text-white rounded-lg flex items-center gap-x-1"
              >
                <IoBookSharp className="text-white text-sm" />
                <p className="text-semibold text-sm font-bold">Submit</p>
              </Button>
              <Button
                className="px-6 py-2 text-red-800 bg-white border-2 border-red-800 rounded-lg flex items-center gap-x-1"
                disabled
              >
                <AiOutlineReload className="text-red-800 text-sm stroke-[45px]" />
                <p className="text-semibold text-sm font-bold">Reload</p>
              </Button>
            </div>
          </div>
          <div className="flex mt-10">
            <div className="w-[15%] mt-1">
              <IoMdArrowRoundForward />
            </div>
            <div className="w-[65%] mx-5">
              <h1 className="font-bold text-lg text-green-800">
                Short Questions
              </h1>
              {quizResults.map((item, index) => (
                <div key={item._id} className="flex gap-x-5 mt-5">
                  <h1
                    className={`border-[2px] rounded-full w-3 h-3 flex items-center justify-center font-bold text-white p-4 ${getColor(
                      item.correctness
                    )}`}
                  >
                    {index + 1}
                  </h1>
                  <div>
                    <h1 className="text-sm text-[#4a4a4a] font-light">
                      {item.question}
                    </h1>
                    <div className="mt-4">
                      <Textarea
                        className="border-2 resize-none border-green-800"
                        rows={2}
                        value={item.ans}
                        disabled
                      />
                    </div>
                    <div className="mt-5 space-y-2">
                      <p className="text-sm text-green-800 font-bold">
                        Correctness: {item.correctness}
                      </p>
                      <p className="text-sm text-green-800 font-bold">
                        Comment: {item.comment}
                      </p>
                      <div>
                        <p className="text-sm mt-4 text-green-800 font-bold border-b-2 border-green-800 inline-block">
                          Original Answer
                        </p>
                        <p className="text-xs mt-2">{item.ans}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
