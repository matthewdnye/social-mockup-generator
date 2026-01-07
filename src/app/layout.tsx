import type { Metadata } from 'next'
import { UserProvider } from '@/lib/user-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Social Mockup Generator - Create Realistic Social Media Post Screenshots',
  description: 'Generate realistic mockups of social media posts for X/Twitter, LinkedIn, Facebook, Instagram, and Threads. Perfect for presentations, ad creative previews, and content planning.',
  keywords: 'social media mockup, twitter screenshot generator, linkedin post mockup, facebook post generator, instagram mockup, threads mockup',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
