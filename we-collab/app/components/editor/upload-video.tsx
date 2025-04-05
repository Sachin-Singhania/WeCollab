'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ModernFileInput } from '@/components/modern-file-input'
import useDashboardStore from '@/app/store/dashboard'
import { VideoUploadEditor } from '@/app/hook/Api'
import { toast } from 'sonner'

export default function  UploadVideo() {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const {dashboard} = useDashboardStore();
  const handleUpload = async () => {
    if (!file || !name || !dashboard?.id) {
      toast.error('Please fill in all fields and select a file.')
      return
    }

    try {
      if(name.trim()==""){
        toast.error('Please fill in the name field.')
        return;
      }
      const formData = new FormData();
    formData.append("description", description);
    formData.append("dashboardId", dashboard?.id);
    formData.append("name", name); 
    formData.append("file", file);
      const response = await VideoUploadEditor(formData);

      toast.success('Video uploaded successfully!',{
        position: "top-right",
        richColors : true
      })
      setFile(null)
      setName('')
      setDescription('')
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Error uploading video.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video-name">Video name</Label>
        <Input
          id="video-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter video name"
        />
      </div>
      <div>
        <Label htmlFor="editor-video-file">Choose Video File</Label>
        <ModernFileInput
          id="editor-video-file"
          accept="video/*"
          onChange={setFile}
        />
      </div>
      <div>
        <Label htmlFor="editor-description">Description for Review</Label>
        <Textarea
          id="editor-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any description for the review process"
          rows={4}
        />
      </div>
      <Button onClick={handleUpload} >
        Upload Edited Video
      </Button>
    </div>
  )
}


