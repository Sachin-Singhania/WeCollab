'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ModernFileInput } from '@/components/modern-file-input'
import { Input } from '@/components/ui/input'
import useDashboardStore from '@/app/store/dashboard'
import { VideoUploadOwner } from '@/app/hook/Api'
import { toast } from 'sonner'

export default function ShareVideo() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState<string>("");
  const {dashboard}=useDashboardStore();

  const handleUpload = async () => {
    if (!file) return;
    if(!dashboard?.id) return;
    if (!description) return;
    const formData = new FormData();
    formData.append("description", description);
    formData.append("dashboardId", dashboard?.id);
    formData.append("name", file.name); 
    formData.append("file", file);
    try {

      const res = await VideoUploadOwner(formData);
      toast.success('Video uploaded successfully!',{
        position: "top-right",
        richColors : true
      })
      console.log('Video uploaded successfully:', res);
      setFile(null);
      setDescription("");
      return;
    }catch(e: any){
      console.error('Error uploading video:', e);
      toast.error('Error uploading video.');
      return;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <ModernFileInput
          id="share-video-file"
          accept="video/*"
          onChange={setFile}
        />
        <Input
          type="text"
          placeholder="Enter video description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>
      <Button onClick={handleUpload}>
        Share with Team
      </Button>
    </div>
  )
}