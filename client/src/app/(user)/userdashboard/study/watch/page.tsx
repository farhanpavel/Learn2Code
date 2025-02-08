"use client";
import { useState } from 'react';
import { FaLaptopCode, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import CodeEditor from '../_video/CodeEditor';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [channel, setChannel] = useState({ name: '', avatar: '' });
  const [views, setViews] = useState('');
  const [videoId, setVideoId] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    const videoTitle = searchParams.get('title') || '';
    const videoDescription = searchParams.get('description') || '';
    const channelName = searchParams.get('channelName') || '';
    const channelAvatar = searchParams.get('channelAvatar') || '';
    const views = searchParams.get('views') || '';
    const videoId = searchParams.get('videoId') || '';

    setVideoTitle(videoTitle);
    setVideoDescription(videoDescription);
    setChannel({
      name: channelName,
      avatar: channelAvatar,
    });
    setViews(views);
    setVideoId(videoId);
  }, [searchParams]);

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

      <div className="ps-9 mx-auto mt-32 mx-2">
        {/* Video Embed */}
        <div className={`aspect-video w-full rounded-lg overflow-hidden shadow-lg ${isEditorOpen ? 'w-1/2' : 'w-full'}`}>
          <iframe
            className="w-full h-full shadow-lg"
            src={`https://www.youtube.com/embed/${videoId}`} // Replace with your YouTube video ID
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Title */}
        <h1 className="text-2xl font-bold mt-6">{videoTitle}</h1>

        {/* Video Stats (Views) */}
        <p className="text-sm text-gray-500 mt-2">{views} views</p>

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