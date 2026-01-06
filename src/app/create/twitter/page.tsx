'use client'

import * as React from 'react'
import dynamicImport from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react'

// Force dynamic rendering (skip static generation)
export const dynamic = 'force-dynamic'

// Dynamically import components that use Zustand store and Radix UI
const TwitterPost = dynamicImport(
  () => import('@/components/mockups/TwitterPost').then((mod) => mod.TwitterPost),
  {
    ssr: false,
    loading: () => (
      <div className="w-[598px] h-[300px] flex items-center justify-center bg-white rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    ),
  }
)

const PostEditor = dynamicImport(
  () => import('@/components/editor/PostEditor').then((mod) => mod.PostEditor),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    ),
  }
)

const ExportOptions = dynamicImport(
  () => import('@/components/export/ExportButton').then((mod) => mod.ExportOptions),
  {
    ssr: false,
    loading: () => <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />,
  }
)

// Create a client component for the reset button
function ResetButton() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleReset = React.useCallback(async () => {
    if (mounted) {
      const { usePostStore } = await import('@/hooks/usePostStore')
      usePostStore.getState().reset()
    }
  }, [mounted])

  return (
    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
      <RotateCcw className="h-4 w-4" />
      Reset
    </Button>
  )
}

export default function TwitterGeneratorPage() {
  const postRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">X/Twitter Post Generator</h1>
              <p className="text-sm text-gray-600">
                Create realistic X/Twitter post mockups
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ResetButton />
            <ExportOptions targetRef={postRef} filename="twitter-mockup" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Editor Sidebar */}
        <aside className="w-96 border-r bg-gray-50">
          <PostEditor />
        </aside>

        {/* Preview Area */}
        <main className="flex flex-1 items-center justify-center bg-gray-100 p-8">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <TwitterPost ref={postRef} />
          </div>
        </main>
      </div>
    </div>
  )
}
