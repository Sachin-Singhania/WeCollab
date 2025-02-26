'use client';
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import VideoList from "./video-list"
import ShareVideo from "./share-video"
import { useRouter } from 'next/navigation'

export default function YouTubeOwnerDashboard() {

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">YouTube Owner Dashboard</h1>

      <GoogleLogin />

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload to YouTube</CardTitle>
            <CardDescription>Upload a new video directly to your YouTube channel</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/owner/upload">
              <Button>Upload to YouTube</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share with Team</CardTitle>
            <CardDescription>Upload and share a video with your editing team</CardDescription>
          </CardHeader>
          <CardContent>
            <ShareVideo />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Videos</CardTitle>
          <CardDescription>Manage and download your uploaded videos</CardDescription>
        </CardHeader>
        <CardContent>
          <VideoList />
        </CardContent>
      </Card>
    </div>
  )
}
function GoogleLogin() {
  const router = useRouter();
  const handlegooglelogin=()=>{
    router.push('/api/auth/signin');
  }
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Connect YouTube Account</CardTitle>
        <CardDescription>Link your YouTube account to enable video management</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handlegooglelogin}>Connect YouTube Account</Button>
      </CardContent>
    </Card>
  )

}
