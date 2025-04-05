'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ShareVideo from "./share-video";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { acceptRequest, createCode, rejectRequest } from '@/app/hook/Api';
import Image from "next/image";
import VideoList, { Video } from "./video-list";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
export interface youtubeUploads{
  id: string;
  title: string;
}
export default function YouTubeOwnerDashboard({ dashboard, role, user }: any) {
  const nav = useRouter();
  const [myUploads, setMyUploads] = useState<Video[]>([]);
  const [teamUploads, setTeamUploads] = useState<Video[]>([]);
  const [youtubeUploads, setYoutubeUploads] = useState<youtubeUploads[]>([]);
  const [dashboardCode, setDashboardCode] = useState("");
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) {
        toast.error("Please sign in to access your dashboard");
        nav.push("/signin");
        return;
      }
      if (dashboard && role && user?.id) {
        setYoutubeUploads(dashboard?.YoutubeUploads || []);
        const myUploadsTemp: Video[] = [];
        const teamUploadsTemp: Video[] = [];

        for (const video of dashboard?.Video || []) {
          if (video?.uploadedBy === user?.id) {
            myUploadsTemp.push(video);
          } else {
            teamUploadsTemp.push(video);
          }
        }

        setMyUploads(myUploadsTemp);
        setTeamUploads(teamUploadsTemp);
      }
    };

    fetchVideos();
  }, [user, role, dashboard, nav]);
      const handlecopy = () => {
        if(!dashboard?.id) return;
        if(dashboardCode) {
          navigator.clipboard.writeText(dashboardCode);
          toast.success("Code copied to clipboard");
          return;
        }
        createCode(dashboard?.id).then((data) => {
          setDashboardCode(data?.code);
          navigator.clipboard.writeText(data?.code);
          toast.success("Code copied to clipboard");
        }).catch(() => {
          toast.error("Error copying code");
        });
      }
  return (
    <div className="container mx-auto py-10">
     <h1 className="text-2xl font-bold mb-2 ml-1 flex items-center gap-2">
      {dashboard?.name?.toUpperCase() ? dashboard?.name?.toUpperCase() : 'DASHBOARD NAME'} 
      <span className="font-light">| {role && role=="OWNER" ? 'Owner' : 'Role'}</span>
      <Image onClick={handlecopy} src="/link.png" className='cursor-pointer' alt="Link" width={30} height={20} />
      {
        dashboard?.Request?.length >0 && (
          <Requests requests={dashboard?.Request}dashboardId={dashboard?.id}/>
          )
      }
    </h1>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <GoogleLogin />
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

      <div className="grid grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Team Uploads</CardTitle>
            <CardDescription>Manage and download your uploaded videos</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoList type='teamUploads' videos={teamUploads}  />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Uploads</CardTitle>
            <CardDescription>View and manage videos you have uploaded</CardDescription>
          </CardHeader>
          <CardContent>
          <VideoList  type='myUploads' videos={myUploads} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>YouTube Uploads</CardTitle>
            <CardDescription>View and manage videos uploaded to YouTube</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoList type='youtubeUploads' videos={youtubeUploads} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoogleLogin() {
  const router = useRouter();
  const { data: session } = useSession(); 
  const handleGoogleLogin = () => {
    router.push('/api/auth/signin'); 
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect YouTube Account</CardTitle>
        <CardDescription>Link your YouTube account to enable video management</CardDescription>
      </CardHeader>
      <CardContent>
        {session?.user? (
          <div className="flex items-center space-x-2">
            <p className="text-green-500 font-medium">
              ✅ Connected as {session.user.name}
            </p>
          </div>
        ) : (
          <Button onClick={handleGoogleLogin}>Connect YouTube Account</Button>
        )}
      </CardContent>
    </Card>
  );
}
function Requests({ requests,dashboardId }: { requests: { id: string; userId: string }[],dashboardId:string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = async(id: string,userId:string) => {
    try {
      console.log(`Accepted request ID: ${id}`);
    const res=await acceptRequest(id,userId,dashboardId);
    if(res){
      toast.success ('Request accepted',{
        position: "top-right",
        richColors : true,
      });
      setIsOpen(false);
      }
    } 
    catch (error) {
       toast.error ('Error accepting request',{
        position: "top-right",
        richColors : true,
        });
        return;
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res= await rejectRequest(id,dashboardId);
      if(res){
        toast.success ('Request rejected')
        setIsOpen(false);
    };
    } 
    catch (error) {
      toast.error ('Error rejecting request',{
        position: "top-right",
        richColors : true,
        });
        return;
    }
   
}

  return (
    <>
      <Image
        src="./notification.png"
        className="cursor-pointer"
        alt="Requests"
        width={20}
        height={20}
        onClick={() => setIsOpen(true)}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Requests</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {requests?.length > 0 ? (
              requests?.map((req) => (
                <div key={req.id} className="border p-2 rounded-md flex justify-between items-center">
                  <p><strong>User ID:</strong> {req.userId}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-white border border-black shadow-sm"  onClick={() => handleAccept(req.id,req.userId)}>✅</Button>
                    <Button size="sm" className="bg-white border border-black shadow-sm"   onClick={() => handleReject(req.id)}>❌</Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No requests available</p>
            )}
          </div>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

