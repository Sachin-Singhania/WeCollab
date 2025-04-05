"use client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import useUserStore from "../store/store";
import useDashboardStore from "../store/dashboard";
import { fetchDashboard, GetUserData } from "../hook/Api";
import { ReactNode } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import axios from "axios";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const route= useRouter();
  const {setUser,user} = useUserStore();
  const { setDashboard, setRole, role, dashboard } = useDashboardStore();
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        if (dashboard && role && user) return;
        if(!user){
          const userResponse = await GetUserData();
          if (!userResponse) {
            route.push("/signin");
            return;
          }
          setUser(userResponse);
        }
        if (!dashboard || !role) {
          const data = await fetchDashboard();
          setRole(data.role);
          setDashboard(data);

        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message + "| Signin or Signup", {
            richColors : true,position:"top-right"
            });
        }else{
          toast.error("Server Error or No dashboard , Click Get Started to create or join Dashboard",{
            richColors : true,position:"top-right"
          });
        }
        route.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <LoaderCircle className="animate-spin text-black" size={60} />
    </div>;
  }
  return <>{children}</>;
}
