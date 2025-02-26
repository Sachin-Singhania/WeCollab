import { CheckCircle } from 'lucide-react'

const steps = [
  'Sign up for WeCollab',
  'Invite your editors to join your team',
  'Upload and share your video content securely',
  'Collaborate on tasks and communicate within the platform',
  'Review and approve final edits',
  'Publish directly to YouTube without sharing account credentials'
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white relative z-20">
      <h2 className="text-3xl font-bold text-center mb-12 text-black">How It Works</h2>
      <div className="max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center mb-6 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CheckCircle className="w-6 h-6 text-black mr-4 flex-shrink-0" />
            <p className="text-lg text-gray-600">{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

