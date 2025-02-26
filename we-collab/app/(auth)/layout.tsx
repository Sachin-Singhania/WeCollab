import { ReactNode } from 'react'
import Link from 'next/link'
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            WeCollab
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/signin" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-600 hover:text-gray-900">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          © 2023 WeCollab. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

