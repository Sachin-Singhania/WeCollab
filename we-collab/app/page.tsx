'use client'
import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import CTA from './components/CTA'
import JoinOrCreate from './components/JoinOrCreate'
 import ProtectedRoute from './components/Protected'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useUserStore from './store/store'
export default function Home() {
  const [showJoinOrCreate, setShowJoinOrCreate] = useState(false)

  const toggleJoinOrCreate = () => {
    setShowJoinOrCreate(!showJoinOrCreate)
  }
  const {user} = useUserStore();
  const router= useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }else{
      return;
    }
  }, [session, status,user]);
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

