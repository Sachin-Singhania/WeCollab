"use client"
import Link from "next/link"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import useUserStore from "../store/store"
import { useRouter } from "next/navigation"
import useDashboardStore from "../store/dashboard"


export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigator = useRouter();
  //@ts-ignore
  const setUser = useUserStore((state) => state.setUser);
  const {setDashboard,setRole} = useDashboardStore();

  const handleSignIn = async () => {
    setError(""); // Reset the error message
    try {
      const response = await axios.post("http://localhost:3010/user/api/v1/user/signin", {
        Email:email,
        Password:password,
      },{
        withCredentials : true,
      });
      const data = response.data; 
      console.log("Sign-in successful:", data);
      if(response.status === 200){
        setUser(data.user);
        try {
          
          const dashbaord = await axios.get('http://localhost:3010/dashboard/api/v1/dashboard/get',{
            withCredentials : true
           });
           if (dashbaord.status === 200){
            let fdata=dashbaord.data[0];
            setRole(fdata.role);
            setDashboard(fdata.dashbaord);
            navigator.push(`/dashboard/${fdata?.role.toLowerCase()}`);
          }else{
            navigator.push("/");
          }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
      }

    } catch (err) {
      console.log(err)
      if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Use backend's error message
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSignIn}>
          Sign In
        </Button>
      </CardFooter>
      <CardFooter>
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
  )
}

