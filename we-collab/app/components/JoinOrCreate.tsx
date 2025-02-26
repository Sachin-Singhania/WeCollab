'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from 'lucide-react'
import useUserStore from '../store/store'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface JoinOrCreateProps {
  onClose?: () => void
}

export default function JoinOrCreate({ onClose }: JoinOrCreateProps) {
  const [joinCode, setJoinCode] = useState('')
  const [projectName, setProjectName] = useState('')
  //@ts-ignore
  const {user}= useUserStore();
    const navigate= useRouter();
  const handleJoin = () => {
    console.log('Joining with code:', joinCode);
  }

  const handleCreate = async() => {
    if (user==null) {
        alert('Please login first');
    }
    const name= projectName.trim();
    if(projectName.trim()==""){
        return;
    }
    try {
        console.log('Creating project with name:', name)
        const response = await axios.post("http://localhost:3010/dashboard/api/v1/dashboard/new", {
            name,
            ownerId:user.id,
          });
          console.log(response.data);
          navigate.push("/dashboard/"+response.data.id);
    } catch (error) {
         console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto relative">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <CardHeader>
        <CardTitle>Join or Create a Project</CardTitle>
        <CardDescription>Collaborate with your team or start a new project</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="join" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
          </TabsList>
          <TabsContent value="join">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="join-code" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Enter Join Code
                </label>
                <Input
                  id="join-code"
                  placeholder="Enter your join code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleJoin}>Join Project</Button>
            </div>
          </TabsContent>
          <TabsContent value="create">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="project-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Project Name
                </label>
                <Input
                  id="project-name"
                  placeholder="Enter your project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleCreate}>Create Project</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

