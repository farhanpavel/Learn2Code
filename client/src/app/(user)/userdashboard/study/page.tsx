"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { time } from "console";
import { useRouter } from "next/navigation";
import { title } from "process";
import React, { useEffect } from "react";
import { AiFillLayout, AiFillSwitcher, AiOutlineReload } from "react-icons/ai";
import {
  FaChevronDown,
  FaLaptopCode,
  FaMarkdown,
  FaPlay,
  FaRegLightbulb,
  FaSquare,
  FaTools,
} from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { IoBookSharp } from "react-icons/io5";
import VideoCard from "./_video/VideoCard";
import ScaleLoader from "react-spinners/ScaleLoader";
import { url } from "@/components/Url/page";

export default function Page() {
  const router = useRouter();
  const [position, setPosition] = React.useState("Python");
  const [videos, setVideos] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [lang, setLang] = React.useState("Bangla");
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const requestUrl = `${url}/api/get-videos?pl=${encodeURIComponent(
        position.toLowerCase()
      )}&lang=${encodeURIComponent(lang.toLowerCase())}`;
      console.log(requestUrl);
      const response = await fetch(requestUrl);
      const data = await response.json();
      setVideos(
        data.contents.filter((item: any) =>
          item.video.title.toLowerCase().includes(position.toLowerCase())
        )
      );
      console.log(data.contents);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [position, lang]);

  if (loading)
    return (
      <div className="p-9">
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <ScaleLoader color="black" />
        </div>
      </div>
    );

  return (
    <div className="ps-12 pr-9 bg-gray-100 w-full items-center justify-items-center content-center">
      <div className="fixed bg-gray-100 w-full z-10 top-0 h-9" />
      <div className="flex top-9 justify-between items-center w-[75vw] border-b-2 border-black  fixed bg-gray-100 z-10 pb-4">
        <div className="space-y-2">
          <div className="flex gap-x-2 items-center text-black">
            <FaLaptopCode className="text-3xl" />
            <h1 className="text-2xl font-bold">Start Learning</h1>
          </div>
          <p className="text-xs text-[#4a4a4a]">
            Watch coding tutorials and start coding right now!
          </p>
        </div>

        <div className="flex space-x-2 items-center">
          <div>
            <div className="flex -space-x-px">
              <Button
                className={`rounded-r-none focus:z-10 hover:bg-gray-300 ${
                  lang === "Bangla"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => {
                  setLang("Bangla");
                  fetchVideos();
                }}
              >
                Bangla
              </Button>
              <Button
                className={`rounded-none focus:z-10 hover:bg-gray-300 ${
                  lang === "English"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setLang("English")}
              >
                English
              </Button>
              <Button
                className={`rounded-l-none focus:z-10 hover:bg-gray-300 ${
                  lang === "Hindi"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setLang("Hindi")}
              >
                Hindi
              </Button>
            </div>
          </div>
          <div className="w-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-black text-white w-32 flex items-center gap-x-1">
                {position.charAt(0).toUpperCase()}
                {position.substring(1)}
                <FaChevronDown color="white" className="text-xs mt-[0.7px]" />
              </Button>
              {/* Dropdown button */}
              {/* <Button color='gray' className='bg-gray-200 border border-gray-800 hover:bg-green-800'>
                                <FaChevronDown color='black'/>
                            </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Choose Programming Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem
                  className={position === "python" ? "outline-green-800" : ""}
                  value="python"
                >
                  Python
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className={position === "java" ? "outline-green-800" : ""}
                  value="java"
                >
                  Java
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className={position === "c++" ? "outline-green-800" : ""}
                  value="c++"
                >
                  C++
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className={position === "c#" ? "outline-green-800" : ""}
                  value="c#"
                >
                  C#
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className={
                    position === "javascript" ? "outline-green-800" : ""
                  }
                  value="javascript"
                >
                  JavaScript
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className={
                    position === "typescript" ? "outline-green-800" : ""
                  }
                  value="typescript"
                >
                  TypeScript
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-32 ps-10 grid grid-cols-3 gap-4 justify-items-center pb-4">
        {videos.map((item: any) => (
          <VideoCard
            key={item.videoId}
            video={item.video}
            className="w-[300px] h-[400px]"
          />
        ))}
      </div>
    </div>
  );
}
