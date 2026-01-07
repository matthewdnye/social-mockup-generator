'use client'

import * as React from 'react'
import dynamicImport from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { RotateCcw, Loader2 } from 'lucide-react'
import { EditorLayout } from '@/components/layout'

// Force dynamic rendering (skip static generation)
export const dynamic = 'force-dynamic'

// Dynamically import components that use Zustand store
const ThreadsPost = dynamicImport(
  () => import('@/components/mockups/ThreadsPost').then((mod) => mod.ThreadsPost),
  {
    ssr: false,
    loading: () => (
      <div className="w-[598px] h-[300px] flex items-center justify-center bg-white rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    ),
  }
)

const ThreadsEditor = dynamicImport(
  () => import('@/components/editor/ThreadsEditor').then((mod) => mod.ThreadsEditor),
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

// Reset button component
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

export default function ThreadsGeneratorPage() {
  const postRef = React.useRef<HTMLDivElement>(null)

  return (
    <EditorLayout
      title="Threads Post Generator"
      description="Create realistic Threads post mockups"
      actions={
        <>
          <ResetButton />
          <ExportOptions targetRef={postRef} filename="threads-mockup" />
        </>
      }
    >
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Editor Sidebar */}
        <aside className="w-96 border-r bg-gray-50">
          <ThreadsEditor />
        </aside>

        {/* Preview Area */}
        <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          <div ref={postRef} className="rounded-xl bg-white p-8 shadow-lg">
            <ThreadsPost />
          </div>
        </main>
      </div>
    </EditorLayout>
  )
}
