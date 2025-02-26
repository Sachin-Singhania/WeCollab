"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import VideoList from "./video-list"
import UploadVideo from "./upload-video"
import axios from "axios"
import useDashboardStore from "@/app/store/dashboard"
import { useEffect } from "react"

export default function EditorDashboard() {
  const { dashboard ,setRole,setDashboard} = useDashboardStore()
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:3010/dashboard/api/v1/dashboard/get', {
          withCredentials: true, 
        })
        console.log(response)
        const data= response.data[0];
        console.log(data)
        setRole(data.role);
        setDashboard(data.dashboard);
      } catch (error) {
        console.error('Error fetching videos:', error)
      }
    }

    fetchVideos() // Call the function to fetch videos
  }, [setRole, setDashboard]) 
  if (!dashboard) {
    return <div>Loading...</div> 
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Editor Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>Upload a new video for review</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadVideo  />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Videos</CardTitle>
            <CardDescription>Manage and download videos assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

