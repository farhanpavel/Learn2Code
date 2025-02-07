"use client";
import { useState } from 'react';
import { FaLaptopCode, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import CodeEditor from '../_video/CodeEditor';

export default function Page() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const videoTitle = "How to Build a Modern Web App with Next.js and Tailwind CSS";
  const videoDescription = "In this video, we'll walk you through the process of building a modern web application using Next.js and Tailwind CSS. Learn how to set up your project, create responsive layouts, and style your components efficiently.";
  const channel = {
    name: "FireShip.io",
    avatar: "https://cdn.discordapp.com/discovery-splashes/1015095797689360444/39c2f83d83a050c41c78546eae47ad58.jpg?size=2048", // Replace with a channel avatar image
  };
  const views = "1.2M views";

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  return (
    <div className="ps-12 pr-9 pb-9 bg-gray-100 w-full items-center justify-items-center content-center">
      <div className='fixed bg-gray-100 w-full z-10 top-0 h-9' />
      <div className="flex top-9 justify-between items-center w-[87vw] border-b-2 border-[#d1cece] fixed bg-gray-100 z-10 pb-5">
        <div className="space-y-2">
          <div className="flex gap-x-2 items-center text-green-600">
            <FaLaptopCode className="text-3xl" />
            <h1 className="text-2xl font-bold">Watch & Code</h1>
          </div>
          <p className="text-xs text-[#4a4a4a]">
            Watch coding tutorials and start coding right now!
          </p>
        </div>

        <div className="flex space-x-2 items-center">
          <div className="flex flex-row gap-1 items-center">
            <Button
              onClick={toggleEditor}
              className="bg-green-800 text-white w-32"
            >
              <p>{isEditorOpen ? "Close Editor" : "Open Editor"}</p>
              <div className='w-2' />
              {isEditorOpen ? <FaChevronRight color='white' /> : <FaChevronLeft color='white' />}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-32 mx-2">
        {/* Video Embed */}
        <div className={`aspect-video w-full rounded-lg overflow-hidden shadow-lg ${isEditorOpen ? 'w-1/2' : 'w-full'}`}>
          <iframe
            className="w-full h-full shadow-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your YouTube video ID
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Title */}
        <h1 className="text-2xl font-bold mt-6">{videoTitle}</h1>

        {/* Video Stats (Views) */}
        <p className="text-sm text-gray-500 mt-2">{views}</p>

        {/* Channel Info */}
        <div className="flex items-center mt-4">
          <img
            src={channel.avatar}
            alt={`${channel.name} icon`}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <span className="font-medium text-gray-700">{channel.name}</span>
          </div>
        </div>

        {/* Video Description */}
        <p className="mt-4 text-gray-600">{videoDescription}</p>
      </div>

      {/* Code Editor */}
      <div
        className={`fixed top-28 right-0 h-full w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isEditorOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <CodeEditor />
      </div>
    </div>
  );
}