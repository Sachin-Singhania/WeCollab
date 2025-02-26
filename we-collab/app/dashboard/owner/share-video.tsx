'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ModernFileInput } from '@/components/modern-file-input'
import axios from 'axios'

export default function ShareVideo() {
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("description", "Your description here");
    formData.append("dashboardId", "80fe5c21-db44-4993-81ff-1334ce0ea009");
    formData.append("name", file.name); 
    formData.append("file", file);
    try {

      const res = await axios.post(
        "http://localhost:3010/video/api/v1/video/upload-owner",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Uploading and sharing file:', file.name)
    }catch(e: any){
      if (e.response) {
        // If the error comes from the server
        console.error('Error from server:', e.response.data);
        alert(`Upload failed: ${e.response.data.message}`);
      } else {
        // If the error comes from the network or Axios itself
        console.error('Error uploading file:', e.message);
        alert('An error occurred during the file upload.');
      }
    }
  }

  return (
    <div className="space-y-4">
      <ModernFileInput
        id="share-video-file"
        accept="video/*"
        onChange={setFile}
      />
      <Button onClick={handleUpload} >
        Share with Team
      </Button>
    </div>
  )
}

