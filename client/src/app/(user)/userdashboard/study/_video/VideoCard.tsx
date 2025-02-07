"use-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, EyeIcon } from "lucide-react";

const video = {
  title: "Introduction to Next.js",
  href: "#",
  thumbnail: "https://th.bing.com/th/id/R.54ffa803bddd87659d7e80fd0fe276eb?rik=VJOEKxtr2GzulA&pid=ImgRaw&r=0", // Replace with a video thumbnail image
  views: "1.2M",
  likes: "45K",
  description: "Learn the basics of Next.js in this comprehensive tutorial.",
};

export default function VideoCard() {
  return (
    <div className="w-[27vw] relative space-y-4 bg-white rounded-lg shadow-md p-4">
      {/* Thumbnail */}
      <figure className="group-hover:opacity-90">
        <img
          className="w-full rounded-lg aspect-video" // aspect-video for 16:9 ratio
          src={video.thumbnail}
          width={300}
          height={169} // 16:9 aspect ratio height
          alt={video.title}
        />
      </figure>

      {/* Video Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          <Link href={video.href}>
            <span aria-hidden="true" className="absolute" />
            {video.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{video.description}</p>
      </div>

      {/* Stats (Views and Likes) */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <EyeIcon className="size-4" />
          <span>{video.views} views</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUpIcon className="size-4" />
          <span>{video.likes} likes</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
      <Button onClick={()=>{console.log("heee")}} variant="outline" className="w-full hover:bg-green-800 hover:text-white">
        Watch Now
      </Button>
      </div>
    </div>
  );
}