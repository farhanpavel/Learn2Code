"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoCardProps {
  video: any;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, className }) => {
  const router = useRouter();

  const handleWatchVideo = () => {
    router.push(
      `study/watch?videoId=${video.videoId}&title=${encodeURIComponent(
        video.title
      )}&description=${encodeURIComponent(
        video.descriptionSnippet
      )}&channelName=${encodeURIComponent(
        video.author.title
      )}&channelAvatar=${encodeURIComponent(
        video.author.avatar[0].url
      )}&views=${encodeURIComponent(video.stats.views)}`
    );
  };

  return (
    <div className="w-[26vw] relative bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
      {/* Thumbnail */}
      <figure className="group-hover:opacity-90">
        <img
          className="w-full rounded-lg aspect-video"
          src={video.thumbnails[0].url}
          width={300}
          height={169}
          alt={video.title}
        />
      </figure>

      {/* Video Details */}
      <div className="space-y-2 mt-4">
        <h3 className="text-lg font-semibold">
          <Link href={`/watch/${video.videoId}`}>{video.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {video.descriptionSnippet}
        </p>
      </div>

      {/* Channel Info & Stats */}
      <div className="flex flex-col gap-2 mt-4 ">
        <div className="flex items-center gap-2">
          <img
            className="size-6 rounded-full"
            src={video.author.avatar[0].url}
            alt={video.author.title}
          />
          <span className="text-sm text-muted-foreground">
            {video.author.title}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <EyeIcon className="size-4" />
            <span>{video.stats.views} views</span>
          </div>
        </div>
      </div>

      {/* Action Button at the Bottom */}
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full hover:bg-green-800 hover:text-white"
          onClick={handleWatchVideo}
        >
          Watch Now
        </Button>
      </div>
    </div>
  );
};

export default VideoCard;
