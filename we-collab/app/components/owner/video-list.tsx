'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { youtubeUploads } from './OwnerDashboard'
import Image from 'next/image'

export type Video = {
  id: string
  name : string
  uploadedBy : string
}
type VideoListProps = {
  videos: Video[] | youtubeUploads[];
  type: "teamUploads" | "myUploads" | "youtubeUploads";
};
export default function VideoList({ videos, type }: VideoListProps) {
  const videoListRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const nav = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (videoListRef.current && !videoListRef.current.contains(event.target as Node)) {
        setSelectedVideo(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 

  const handleSelectVideo = (video: Video) => {
    if (type === "teamUploads") {
      setSelectedVideo(video);
    }
  };

  return (
    <div ref={videoListRef} className="max-h-80 overflow-y-auto custom-scrollbar">
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectVideo(video as Video)}
          >
            <div className="flex-grow">
              <h3 className="font-semibold">{(video as Video).name || (video as youtubeUploads).title}</h3>
            </div>
            {type === "teamUploads" && (
              <Image
                src='/direction.png'
                alt=""
                width={20}
                height={20}
                className="rounded-md"
                onClick={() => {
                  if (video) {
                    window.open(`/dashboard/video/${(video as Video).id}`, "_blank");
                  }
                }}
              />
            )}
            {type === "youtubeUploads" && (
              <Image
                src='/direction.png'
                alt=""
                width={20}
                height={20}
                className="rounded-md"
                onClick={() => {
                  if (video) {
                    window.open(`https://www.youtube.com/watch?v=${(video as youtubeUploads).id}}`, "_blank");
                  }
                }}
              />
            )}
           
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No videos available</p>
      )}

      {selectedVideo && type === "teamUploads" && (
        <div className="absolute top-5 right-4">
          <Button onClick={() => nav.push(`/dashboard/upload/${selectedVideo.id}`)}>
            PUBLISH
          </Button>
        </div>
      )}
    </div>
  );
}
