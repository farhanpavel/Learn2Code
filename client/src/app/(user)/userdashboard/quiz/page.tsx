import React from "react";
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
import { FaPlay } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  return (
    <div className="p-9">
      <div className="flex justify-between items-center w-full border-b-2 border-[#d1cece] pb-4">
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
          <button className="px-6 py-2 bg-green-800 text-white rounded-lg flex items-center gap-x-1">
            <IoBookSharp className="text-white text-sm" />
            <p className="text-semibold text-sm font-bold"> Submit</p>
          </button>
          <button className="px-6 py-2  text-red-800 border-2 border-red-800  rounded-lg flex items-center gap-x-1">
            <AiOutlineReload className="text-red-800 text-sm stroke-[45px]" />
            <p className="text-semibold text-sm font-bold"> Reload</p>
          </button>
        </div>
      </div>
      {/*  */}
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
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-yellow-600 ">
                <MdSubtitles className="text-xs" />
                <p className="text-sm font-semibold">Title</p>
              </div>
              <div className="flex items-center space-x-2 text-yellow-600 ">
                <MdAllInbox className=" text-xs" />
                <p className="text-sm font-semibold">Difficulty</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-[#4a4a4a]">
              <div>
                <h1>Hello</h1>
              </div>
              <div>
                <h1>Hello</h1>
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
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-yellow-600 ">
                <MdOutlineQuestionAnswer className="text-xs" />
                <p className="text-sm font-semibold">
                  CQ<span className="text-xs">s</span>
                </p>
              </div>
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
            <div className="space-y-2 text-sm text-[#4a4a4a]">
              <div>
                <h1>Hello</h1>
              </div>
              <div>
                <h1>Hello</h1>
              </div>
              <div>
                <h1>Hello</h1>
              </div>
              <div>
                <h1>Hello</h1>
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
            <div className="text-center flex items-center space-x-4 justify-center w-[90%] mt-6 border-2 border-yellow-600 p-3 text-yellow-600 rounded-lg ">
              <h1 className="font-bold">00.20</h1>
              <FaPlay />
            </div>
          </div>
        </div>
        <div className="w-[65%] p-7 mx-5">
          <div>
            <h1 className="font-bold text-lg text-green-800">Short Quesions</h1>
          </div>
          <div>
            <div className="flex  gap-x-5 mt-5">
              <h1 className="border-[2px] rounded-full w-3 h-3 flex items-center justify-center font-bold border-green-800  p-4">
                1
              </h1>
              <div>
                <div>
                  <h1 className="text-sm text-[#4a4a4a] font-light">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem quia quod quidem reiciendis id minima, velit
                    fugiat quos optio. Voluptatem.?
                  </h1>
                </div>
                <div className="mt-4">
                  <Textarea
                    className="border-2 resize-none border-green-800  "
                    rows={5}
                  />
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex  gap-x-5 mt-5">
              <h1 className="border-[2px] rounded-full w-3 h-3 flex items-center justify-center font-bold border-green-800  p-4">
                2
              </h1>
              <div>
                <div>
                  <h1 className="text-sm text-[#4a4a4a] font-light">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem quia quod quidem reiciendis id minima, velit
                    fugiat quos optio. Voluptatem.?
                  </h1>
                </div>
                <div className="mt-4">
                  <Textarea
                    className="border-2 resize-none border-green-800  "
                    rows={5}
                  />
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex  gap-x-5 mt-5">
              <h1 className="border-[2px] rounded-full w-3 h-3 flex items-center justify-center font-bold border-green-800  p-4">
                3
              </h1>
              <div>
                <div>
                  <h1 className="text-sm text-[#4a4a4a] font-light">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem quia quod quidem reiciendis id minima, velit
                    fugiat quos optio. Voluptatem.?
                  </h1>
                </div>
                <div className="mt-4">
                  <Textarea
                    className="border-2 resize-none border-green-800  "
                    rows={5}
                  />
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex  gap-x-5 mt-5">
              <h1 className="border-[2px] rounded-full w-3 h-3 flex items-center justify-center font-bold border-green-800  p-4">
                4
              </h1>
              <div>
                <div>
                  <h1 className="text-sm text-[#4a4a4a] font-light">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem quia quod quidem reiciendis id minima, velit
                    fugiat quos optio. Voluptatem.?
                  </h1>
                </div>
                <div className="mt-4">
                  <Textarea
                    className="border-2 resize-none border-green-800  "
                    rows={5}
                  />
                </div>
              </div>
            </div>
            <div className="flex  gap-x-5 mt-5">
              <h1 className="border-[2px] rounded-full w-3 h-3 flex items-center justify-center font-bold border-green-800  p-4">
                4
              </h1>
              <div>
                <div>
                  <h1 className="text-sm text-[#4a4a4a] font-light">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatem quia quod quidem reiciendis id minima, velit
                    fugiat quos optio. Voluptatem.?
                  </h1>
                </div>
                <div className="mt-4">
                  <Textarea
                    className="border-2 resize-none border-green-800  "
                    rows={5}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
