"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Video } from "../owner/video-list"
import { useRouter } from "next/navigation"
import UploadVideo from "./upload-video"
import VideoList from "./video-list"
import { toast } from "sonner"

export default function EditorDashboard({dashboard, role, user}: any) {
  const nav = useRouter();
   const [ myUploads, setMyUploads] = useState<Video[]>([])
   const [ teamUploads, setTeamUploads] = useState<Video[]>([])
    useEffect(() => {
      const fetchVideos = async () => {
        if (!user) {
          toast.error("Please sign in to access your dashboard");
          nav.push("/signin");
          return;
        }
     
        if ( dashboard && role && user?.id ){
          const myUploadsTemp: Video[] = [];
          const teamUploadsTemp: Video[] = [];
          for (const video of dashboard.Video) {
            if (video.uploadedBy === user?.id) {
              myUploadsTemp.push(video);
            } else {
              teamUploadsTemp.push(video);
            }
          }
          setMyUploads(myUploadsTemp);
          setTeamUploads(teamUploadsTemp);
          return;
        }
      }
      fetchVideos() 
    }, [user , role, dashboard, nav])

  return (
    <div className="container mx-auto py-10">
<h1 className="text-2xl font-bold mb-2 ml-1">
  {dashboard?.name?.toUpperCase() ? dashboard?.name?.toUpperCase() : "DASHBOARD NAME"} <span className="font-light">| {role ? 'Editor' : 'Role'}</span>
</h1>

      <div className="grid md:grid-cols-3 gap-8 h-screen">
        <div className="md:col-span-2 flex flex-col gap-8">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Assigned Videos</CardTitle>
              <CardDescription>Manage and download videos assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <VideoList type="teamUploads" videos={teamUploads} />
            </CardContent>
          </Card>

          {/* My Uploads */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>My Uploads</CardTitle>
              <CardDescription>View your uploaded videos</CardDescription>
            </CardHeader>
            <CardContent>
              <VideoList type="myUploads" videos={myUploads} />
            </CardContent>
          </Card>
        </div>

        {/* Right - Upload Video (Large Component) */}
        <div className="md:col-span-1 h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>Upload a new video for review</CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <UploadVideo />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
