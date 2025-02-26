import { Shield, Video, MessageSquare, GitBranch } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Secure Sharing',
    description: 'Share content without granting direct access to your YouTube account.'
  },
  {
    icon: Video,
    title: 'Video Collaboration',
    description: 'Seamlessly work on video projects with your team of editors.'
  },
  {
    icon: MessageSquare,
    title: 'Integrated Messaging',
    description: 'Communicate effectively within the platform to keep everyone on the same page.'
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Keep track of file versions and changes throughout the editing process.'
  }
]

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gray-50 relative z-10">
      <h2 className="text-3xl font-bold text-center mb-12 text-black">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <feature.icon className="w-12 h-12 text-black mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

