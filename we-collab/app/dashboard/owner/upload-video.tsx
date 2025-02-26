'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UploadVideo() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError(null)
    } else {
      setFile(null)
      setError("No file selected")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }
    try {
      // Implement upload logic here
      console.log('Uploading file:', file.name)
      // Reset file and error state after successful upload
      setFile(null)
      setError(null)
    } catch (err) {
      setError("An error occurred during upload")
      console.error(err)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video-file">Choose Video File</Label>
        <Input id="video-file" type="file" accept="video/*" onChange={handleFileChange} />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleUpload} disabled={!file}>
        Upload Video
      </Button>
    </div>
  )
}

