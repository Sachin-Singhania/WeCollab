'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import useDashboardStore from '@/app/store/dashboard'

type Video = {
  id: string
  name : string
}

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])  // Start with an empty array
const { setDashboard ,setRole } = useDashboardStore()
  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:3010/dashboard/api/v1/dashboard/get', {
          withCredentials: true, // Ensure credentials are sent with the request
        })
        console.log(response)
        const videoData: Video[] = response.data[0].dashboard.Video;  // Assuming the response contains 'videos'
        setVideos(videoData)
        setDashboard(response.data[0].dashboard)
        setRole(response.data[0].dashboard.role)
      } catch (error) {
        console.error('Error fetching videos:', error)
      }
    }

    fetchVideos() // Call the function to fetch videos
  }, [setRole, setDashboard])  // Empty dependency array, so this runs only once on component mount

  const handleDownload = (videoId: string) => {
    // Implement download logic here
    console.log('Downloading video:', videoId)
  }

  return (
    <div className="space-y-4">
      {videos?.map((video,index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="flex-grow">
            <h3 className="font-semibold">{video.name}</h3>
          </div>
          <Button onClick={() => handleDownload(video.id)}>Download</Button>
        </div>
      ))}
    </div>
  )
}
