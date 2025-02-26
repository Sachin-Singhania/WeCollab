"use client"
import { Button } from "@/components/ui/button"
import useUserStore from "../store/store"
import { useRouter } from "next/navigation";

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  //@ts-ignore
  const {user}= useUserStore();
  const navigator = useRouter();

  const handleGetStarted = () => {
    if (user==null){
      navigator.push("/signin");
    }else{
      onGetStarted();
    }
  }

  return (
    <section className="py-20 px-4 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-bold mb-6 text-black">
          WeCollab
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          Secure collaboration for YouTube creators and editors. Share content, track tasks, and streamline your workflow without compromising account security.
        </p>
        <div className="space-x-4">
          <Button size="lg" className="bg-black text-white hover:bg-gray-800" onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </div>
    </section>
  )
}

