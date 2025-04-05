
import { downloadVideo } from "@/app/hook/Api"
import { Video } from "../owner/video-list"
import { Button } from "@/components/ui/button"
import useDashboardStore from "@/app/store/dashboard"
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VideoList({ videos,type 
}: { videos: Video[], type: "teamUploads" | "myUploads" }) {
  const nav=useRouter();
  const {dashboard}=useDashboardStore();
  const handleDownload = async(videoId:string) => {
    try {
      if(!dashboard?.id){
        toast.error("Please login first",{
          position:"top-center",
          richColors :true
        });
        nav.push("/signin");
        return;
      }
      if(!videoId) {
        toast.message ("Video id is required",{
          position:"top-center",
          richColors :true
          });
      }
      const response= await downloadVideo(dashboard?.id,videoId);
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoId}.mp4`; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast. error("Failed to download video",{
        position:"top-center",
        richColors :true
        });
    }
  }
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar "> 
      {videos?.map((video) => (
        <div key={video.id} className="flex items-center space-x-4 border-b ">
          <div className="flex-grow">
            <h3 className="font-semibold">{video.name}</h3>
          </div>
          {
            type === "teamUploads" && (
              <Button onClick={() => handleDownload(video.id)}>Download</Button>            
            )
          }
        </div>
      ))}
    </div>
  )
}
