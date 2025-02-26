'use client'
import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CTA from './components/CTA'
import JoinOrCreate from './components/JoinOrCreate'
import axios from 'axios'
import useUserStore from './store/store'
import useDashboardStore from './store/dashboard'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [showJoinOrCreate, setShowJoinOrCreate] = useState(false)

  const toggleJoinOrCreate = () => {
    setShowJoinOrCreate(!showJoinOrCreate)
  }
  const navigator = useRouter();

  //@ts-ignore
  const setUser = useUserStore((state) => state.setUser);
  //@ts-ignore
  const {setDashboard,setRole,role,dashboard} = useDashboardStore();
  useEffect(() => {
    const getUser= async()=>{
      try {
        const response= await axios.get('http://localhost:3010/user/api/v1/user/get',{
          withCredentials : true
        });
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        return;
      } 
    }
    const getDashboard= async()=>{
      try {
        if (dashboard && role ) return;
         const response = await axios.get('http://localhost:3010/dashboard/api/v1/dashboard/get',{
          withCredentials : true
         });
         if(response.data.error){
          return;
         }
         const data= response.data[0];
         console.log(data)
         setRole(data.role);
         setDashboard(data.dashbaord);
         console.log("done")
         navigator.push(`/dashboard/${data?.role.toLowerCase()}`);

      } catch (error) {
        return;
      }
    }
    getUser();
    getDashboard();
  },  [])
  // useEffect(() => {
  //   if (dashboard && role) {
  //     navigator.push(`/dashboard/${role.toLowerCase()}`);
  //   }
  // }, [dashboard, role, navigator]);
  
  return (
    <main className="min-h-screen bg-white relative z-0">
      <Hero onGetStarted={toggleJoinOrCreate} />
      {showJoinOrCreate && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">Get Started</h2>
            <JoinOrCreate />
          </div>
        </section>
      )}
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  )
}

