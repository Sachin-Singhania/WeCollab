import type { Metadata } from 'next'
import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from "sonner";
import AuthProvider from './provider';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (        
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!} 
>
    <html lang="en">
      <body>
      <AuthProvider>
        {children}
       <Toaster /> 
      </AuthProvider>
       </body>
    </html>
    </GoogleOAuthProvider>

  )
}
