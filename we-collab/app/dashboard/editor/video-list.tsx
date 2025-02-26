'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import useDashboardStore from '@/app/store/dashboard'

// type Video = {
//   id: string
//   title: string
//   thumbnail: string
//   status: 'In Progress' | 'Ready for Review' | 'Approved'
// }
type Video = {
  id: string
  name : string
}


export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])  // Start with an empty array
  const { dashboard ,setRole,setDashboard} = useDashboardStore()
  // Fetch videos on mount
  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3010/dashboard/api/v1/dashboard/get', {
  //         withCredentials: true, // Ensure credentials are sent with the request
  //       })
  //       console.log(response)
  //       const data= response.data[0];
  //       const videoData: Video[] = data.dashboard.Video;  // Assuming the response contains 'videos'
  //       setVideos(videoData)
  //       console.log(data)
  //       setRole(data.role);
  //       setDashboard(data.dashbaord);
  //     } catch (error) {
  //       console.error('Error fetching videos:', error)
  //     }
  //   }

  //   fetchVideos() // Call the function to fetch videos
  // }, [dashboard]) 
  const handleDownload = (videoId: string) => {
    // Implement download logic here
    console.log('Downloading video:', videoId)
  }
 
  return (
    <div className="space-y-4">
      {dashboard?.Video?.map((video) => (
        <div key={video.id} className="flex items-center space-x-4">
          {/* <img  alt={video.name} className="w-20 h-12 object-cover" /> */}
          <div className="flex-grow">
            <h3 className="font-semibold">{video.name}</h3>
          </div>
          <Button onClick={() => handleDownload(video.id)}>Download</Button>
        </div>
      ))}
    </div>
  )
}

