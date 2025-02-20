"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaRegLightbulb } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
import { AiOutlineReload } from "react-icons/ai";
import { LuMessageSquareDot } from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaTools } from "react-icons/fa";
import { MdSubtitles } from "react-icons/md";
import { MdAllInbox } from "react-icons/md";
import { AiFillLayout } from "react-icons/ai";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { AiFillSwitcher } from "react-icons/ai";
import { FaMarkdown } from "react-icons/fa6";
import { MdOutlineAccessTime } from "react-icons/md";
import { RiTimerFill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa";
import { FaPlay, FaSquare } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ScaleLoader from "react-spinners/ScaleLoader";

type Quiz = {
  theoryquestion: string;
  _id: string;
};

export default function Page() {
  const [dataAll, setData] = useState<Quiz[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const title = Cookies.get("title") || "";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleStartStop = () => {
    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          else {
            clearInterval(intervalRef.current!);
            router.push("/userdashboard/quiz/result");
            return 0;
          }
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("AccessToken");
    const fetchData = async () => {
      const response = await fetch(
        `${url}/api/data/question-generate/${title}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken || "",
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setData(json);
        setTime(json.length * 2 * 60);
      }
    };
    fetchData();
  }, []);

  const handleReload = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Stop the timer
    }
    setTime(dataAll.length * 2 * 60); // Reset the timer to initial value
    setIsRunning(false); // Ensure that the timer isn't running
  };
  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const accessToken = Cookies.get("AccessToken");
    const allAnswers = dataAll.map((item) => ({
      id: item._id,
      answer: answers[item._id] || "I do not know",
      title: title,
    }));

    try {
      const response1 = await fetch(`${url}/api/ans`, {
        method: "POST",
        headers: {
          Authorization: accessToken || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allAnswers),
      });

      const response2 = await fetch(`${url}/api/result/${title}`, {
        method: "POST",
        headers: {
          Authorization: accessToken || "",
        },
      });

      if (response1.ok && response2.ok) {
        // Wait for the navigation to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/userdashboard/quiz/result");
      } else {
        console.error("Error submitting answers:");
        setIsLoading(false); // Stop loading if there's an error
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      setIsLoading(false); // Stop loading if there's an error
    }
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
              <div className="flex gap-x-2 items-center text-black">
                <FaRegLightbulb className="text-3xl" />
                <h1 className="text-2xl font-bold">Take Quiz</h1>
              </div>
              <p className="text-xs text-[#4a4a4a]">
                Take all of your Quizzes here!
              </p>
            </div>

            <div className="flex space-x-2 items-center">
              <Button
                variant={"default"}
                onClick={handleSubmit}
                className="px-6 py-2  text-white rounded-lg flex items-center gap-x-1"
              >
                <IoBookSharp className="text-white text-sm" />
                <p className="text-semibold text-sm font-bold"> Submit</p>
              </Button>
              <button
                onClick={handleReload}
                className="px-6 py-2 text-black border-2 border-black rounded-lg flex items-center gap-x-1"
              >
                <AiOutlineReload className="text-black text-sm stroke-[45px]" />
                <p className="text-semibold text-sm font-bold"> Reload</p>
              </button>
            </div>
          </div>

          <div className="flex justify- mt-10">
            <div className="sticky top-0 h-screen border-r-2 border-[#d1cece] w-1/4">
              <div>
                <div className="flex space-x-2 items-center text-green-800 mt-5">
                  <LuMessageSquareDot className="text-sm stroke-[3px]" />
                  <h1 className="text-lg font-bold">Overview</h1>
                </div>
                <div className="flex space-x-1 mt-1 w-[90%]">
                  <div>
                    <HiOutlineLightBulb className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4a4a4a] ">
                      View the Properties of the quiz. You can edit the title
                      ,difficulty and type of quiz under preferences section
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex space-x-2 items-center text-green-800 mt-5">
                  <FaTools className="text-xs" />
                  <h1 className="text-sm font-bold">Preferences</h1>
                </div>
              </div>
              <div className="flex justify-between w-[90%] mt-4">
                <div className="space-y-2 w-[40%]">
                  <div className="flex items-center space-x-2 text-yellow-600 ">
                    <MdSubtitles className="text-xs" />
                    <p className="text-sm font-semibold">Title</p>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-600 ">
                    <MdAllInbox className=" text-xs" />
                    <p className="text-sm font-semibold">Difficulty</p>
                  </div>
                </div>
                <div className="space-y-2  w-[30%] text-sm text-[#4a4a4a]">
                  <div>
                    <h1>{title ? title.substring(0, 5) + ".." : ""}</h1>
                  </div>
                  <div>
                    <h1>Easy</h1>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex space-x-2 items-center text-green-800 mt-5">
                  <AiFillLayout className="text-xs" />
                  <h1 className="text-sm font-bold">Properties</h1>
                </div>
              </div>
              <div className="flex justify-between w-[90%] mt-4">
                <div className="space-y-2 w-[60%]">
                  <div className="flex items-center space-x-2 text-yellow-600 ">
                    <AiFillSwitcher className=" text-xs" />
                    <p className="text-sm font-semibold">Total Question</p>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-600 ">
                    <FaMarkdown className=" text-xs" />
                    <p className="text-sm font-semibold">Mark</p>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-600 ">
                    <MdOutlineAccessTime className=" text-xs" />
                    <p className="text-sm font-semibold">Duration</p>
                  </div>
                </div>
                <div className="space-y-2 w-[30%] text-sm text-[#4a4a4a]">
                  <div>
                    <h1>{dataAll.length}</h1>
                  </div>
                  <div>
                    <h1>{dataAll.length * 2}</h1>
                  </div>
                  <div>
                    <h1>{dataAll.length * 2} min</h1>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between w-[90%]">
                  <div className="flex space-x-2 items-center text-green-800 mt-5">
                    <RiTimerFill className="text-xs border-none" />
                    <h1 className="text-sm font-bold">Timer</h1>
                  </div>
                </div>
                <div className="text-center flex items-center space-x-4 justify-center w-[90%] mt-6 border-2 border-yellow-600 p-3 text-yellow-600 rounded-lg">
                  <h1 className="font-bold">{formatTime(time)}</h1>
                  <button
                    onClick={handleStartStop}
                    className="focus:outline-none"
                  >
                    {isRunning ? <FaSquare /> : <FaPlay />}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[65%] p-7 mx-5">
              <div>
                <h1 className="font-bold text-lg text-green-800">
                  Short Questions
                </h1>
              </div>

              {dataAll.map((item, index) => (
                <div key={item._id}>
                  <div className="flex gap-x-5 mt-5">
                    <h1 className="border-[2px] rounded-full w-3 h-3 flex items-center justify-center font-bold border-green-800 p-4">
                      {index + 1}
                    </h1>
                    <div>
                      <div>
                        <h1 className="text-sm text-[#4a4a4a] font-light">
                          {item.theoryquestion}
                        </h1>
                      </div>
                      <div className="mt-4">
                        <Textarea
                          className="border-2 resize-none border-green-800"
                          rows={5}
                          value={answers[item._id] || ""} // Bind the input value
                          onChange={
                            (e) => handleInputChange(item._id, e.target.value) // Update the state
                          }
                        />
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
