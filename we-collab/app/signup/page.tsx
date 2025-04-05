"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import useUserStore from "../store/store"
import { signup } from "../hook/Api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const nav= useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const handleSignup = async () => {
    setError(""); 
    try {
      const data = await signup(email, name, password, ConfirmPassword);
        setUser(data);
        toast.success("Sign up successful, Click Get Start to Create or Join Dashboard", {
          richColors : true,position:"top-right"
        });
        nav.push("/");
    } catch (err:any) {
      if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); 
        toast.error(err.response.data.message, {
          richColors : true,position:"top-right"
          });
      } else{
        toast. error("Internal Server Error", {
          richColors: true,
          position: "top-right",
        });
        setError(err?.message);
      }
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

