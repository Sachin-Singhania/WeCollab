"use client"
import { getVideo } from "@/app/hook/Api";
import useDashboardStore from "@/app/store/dashboard";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function Video(){
    const playerRef = useRef(null);
    const [videolink, setvideolink] = useState<string | null>(null);
    const { dashboard } = useDashboardStore();
    const params = useParams();
    const videoId = params.id as string;
  
    useEffect(() => {
      const fetchVideo = async () => {
        try {
          if (!dashboard || !videoId){
            toast.error("Dashboard and videoId are required");
            return;
          }
          const video = await getVideo(dashboard?.id, videoId);
          console.log(video)
          if (!video || !video?.video?.url){
            toast.error("Video not found");
            return;
          }
          setvideolink(video?.video?.url);
        } catch (error) {
            console.error(error);
          toast.error("Error fetching video");
        }
      }
      fetchVideo();
    }, [dashboard, videoId]);
  
    return (
      <>
            <div className="bg-black min-h-screen flex justify-center items-center">
        {videolink && ( // Only render the VideoPlayer when videolink is set
          <VideoPlayer
            options={{
              controls: true,
              responsive: true,
              fluid: true,
              sources: [
                {
                  src: videolink,
                  type: "application/x-mpegURL"
                }
              ]
            }}
            onReady={(player: any) => {
              playerRef.current = player;
              player.on("waiting", () => videojs.log("player is waiting"));
              player.on("dispose", () => videojs.log("player will dispose"));
            }}
          />
        )}
        </div>
      </>
    );
  }
  const VideoPlayer = (props: { options: any; onReady: any; }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { options, onReady } = props;
  
    useEffect(() => {
        if (!videoRef.current) {
            return;
        }

      if (!playerRef.current) {
        const videoElement = document.createElement("video-js");
  
        videoElement.classList.add("vjs-big-play-centered");
        // @ts-ignore
        videoRef.current.appendChild(videoElement);
        
        // @ts-ignore
        const player = (playerRef.current = videojs(videoElement, options, () => {
            videojs.log("player is ready");
            onReady && onReady(player);
        }));
        
    } else {
        const player = playerRef.current;
        
        // @ts-ignore
        player.autoplay(options.autoplay);
        // @ts-ignore
        player.src(options.sources);
    }
}, [options, videoRef]);

useEffect(() => {
    const player = playerRef.current;
    
    return () => {
          // @ts-ignore
          if (player && !player.isDisposed()) {
            // @ts-ignore
          player.dispose();
          playerRef.current = null;
        }
      };
    }, [playerRef]);
  
    return (
      <div
        data-vjs-player
        style={{ width: "1000px" }}
      >
        <div ref={videoRef} />
      </div>
    );
  };  