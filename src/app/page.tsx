'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageWrapper } from '@/components/layout'

const platforms = [
  {
    id: 'twitter',
    name: 'X / Twitter',
    description: 'Create realistic X/Twitter post screenshots',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'bg-black hover:bg-gray-800',
    available: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Generate LinkedIn post mockups',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
    color: 'bg-[#0A66C2] hover:bg-[#004182]',
    available: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Create Facebook post screenshots',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'bg-[#1877F2] hover:bg-[#0b5ed7]',
    available: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Generate Instagram post mockups',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90',
    available: true,
  },
  {
    id: 'threads',
    name: 'Threads',
    description: 'Create Threads post screenshots',
    icon: (
      <svg viewBox="0 0 192 192" className="h-8 w-8" fill="currentColor">
        <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
      </svg>
    ),
    color: 'bg-black hover:bg-gray-800',
    available: true,
  },
]

const features = [
  {
    title: 'Pixel Perfect',
    description: "Accurate recreations of each platform's design",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'High Resolution',
    description: 'Export at 2x for crisp, retina-ready images',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    title: 'Dark Mode',
    description: 'Support for light, dark, and dim themes',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
  },
  {
    title: 'Instant Download',
    description: 'Download as high-quality PNG instantly',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <PageWrapper background="gradient" maxWidth="6xl">
      {/* Hero Section */}
      <section className="text-center py-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Create{' '}
          <span className="text-[#D9B01C]">Stunning</span>{' '}
          Social Mockups
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Generate pixel-perfect social media post screenshots for presentations,
          ad creative previews, and content planning. Free and instant.
        </p>
      </section>

      {/* Platform Selection */}
      <section className="mt-8">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          Choose a platform to get started
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all ${
                platform.available
                  ? 'hover:shadow-lg hover:border-[#D9B01C]/30 hover:ring-1 hover:ring-[#D9B01C]/20'
                  : 'opacity-60'
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${platform.color}`}
                >
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {platform.name}
                  </h3>
                  {!platform.available && (
                    <span className="text-xs font-medium text-amber-600">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
              <p className="mb-4 text-sm text-gray-600">{platform.description}</p>
              {platform.available ? (
                <Link href={`/create/${platform.id}`}>
                  <Button className={`w-full ${platform.color} text-white`}>
                    Create Mockup
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 pb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Use Our Generator?
          </h2>
          <p className="mt-2 text-gray-600">
            Built for marketers, content creators, and presentation pros
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-[#D9B01C]/30 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#D9B01C]/10 text-[#D9B01C]">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
