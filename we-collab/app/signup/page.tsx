"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import useUserStore from "../store/store"


export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  //@ts-ignore
  const setUser = useUserStore((state) => state.setUser);
  const handleSignup = async () => {
    setError(""); 

    try {
      const response = await axios.post("http://localhost:3010/user/api/v1/user/signup", {
        Email:email,
        Password:password,
        ConfirmPassword,
        Name:name
      }, { withCredentials: true });
      console.log(response.data);
    
      const data = response.data;
      if(response.status === 200){
        setUser(data);
      }
      console.log("Sign-in successful:", data.user);
    } catch (err) {
      //@ts-ignore
      setError(err.message);
    }
  };
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Name</Label>
            <Input
            id="name"
            type="text"
            placeholder="xyz"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={ConfirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup} className="w-full">Create Account</Button>
        </CardFooter>
        <CardFooter>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

