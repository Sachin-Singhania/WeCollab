'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ModernFileInput } from '@/components/modern-file-input'
import axios from 'axios'
import useDashboardStore from '@/app/store/dashboard'

export default function  UploadVideo() {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const {dashboard} = useDashboardStore();
  const handleUpload = async () => {
    if (!file || !name || !dashboard?.id) {
      console.log(dashboard?.id)
      alert('Please provide all required fields (file, name, and dashboardId).')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('dashboardId', dashboard?.id)
      const response = await axios.post(
        'http://localhost:3010/video/api/v1/video/upload-editor',
        formData,
        {
          withCredentials: true, // Ensure cookies are sent
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log('Video uploaded successfully:', response.data)
      alert('Video uploaded successfully!')
      // Clear form fields after successful upload
      setFile(null)
      setName('')
      setDescription('')
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Failed to upload video. Please try again.')
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


