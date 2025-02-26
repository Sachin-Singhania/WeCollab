import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-20 px-4 text-center relative z-30 bg-gray-100">
      <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-black">Ready to Collaborate Securely?</h2>
        <p className="text-xl mb-8 text-gray-600">
          Join WeCollab today and experience seamless, secure collaboration with your editing team.
        </p>
        <Button size="lg" className="bg-black text-white hover:bg-gray-800">
          Sign Up Now
        </Button>
      </div>
    </section>
  )
}

