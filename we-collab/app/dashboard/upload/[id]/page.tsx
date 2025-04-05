'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoUpload } from '@/app/hook/Api'
import useDashboardStore from '@/app/store/dashboard'
import { toast } from "sonner";

export default function UploadYouTube() {
  const params = useParams();
  const fileId= params.id as string;
  const {dashboard,role}=useDashboardStore();
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('')
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !visibility) return;
    if (!dashboard?.id) return;
    if (!fileId) return;
    try {
       const response= await VideoUpload(fileId,dashboard?.id, title, description, visibility);
    } catch (error) {
      console.log('Error uploading video:', error);
    }
  }
  useEffect(() => {
    if (!dashboard || !role) {
      router.push("/dashboard");
      return;
    }
    if (role !== "OWNER") {
      router.push("/dashboard");
      return;
    }
  }, [ dashboard, role ]);
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Upload to YouTube</CardTitle>
          <CardDescription>Fill in the details and upload your video to YouTube</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Upload to YouTube</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

