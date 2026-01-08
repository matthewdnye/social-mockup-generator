'use client'

import * as React from 'react'
import dynamicImport from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import { EditorLayout } from '@/components/layout'
import { ResetButton } from '@/components/editor/ResetButton'
import { ScalableMockupWrapper } from '@/components/mockups/ScalableMockupWrapper'

// Force dynamic rendering (skip static generation)
export const dynamic = 'force-dynamic'

// Platform-specific mockup width
const MOCKUP_WIDTH = 598

// Dynamically import components that use Zustand store
const ThreadsPost = dynamicImport(
  () => import('@/components/mockups/ThreadsPost').then((mod) => mod.ThreadsPost),
  {
    ssr: false,
    loading: () => (
      <div className="w-[598px] h-[300px] flex items-center justify-center bg-white rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" aria-label="Loading preview" />
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

const UndoRedoButtons = dynamicImport(
  () => import('@/components/editor/UndoRedoButtons').then((mod) => mod.UndoRedoButtons),
  {
    ssr: false,
    loading: () => <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />,
  }
)

export default function ThreadsGeneratorPage() {
  const postRef = React.useRef<HTMLDivElement>(null)

  return (
    <EditorLayout
      title="Threads Post Generator"
      description="Create realistic Threads post mockups"
      platform="threads"
      actions={
        <>
          <UndoRedoButtons />
          <ResetButton />
          <ExportOptions targetRef={postRef} filename="threads-mockup" />
        </>
      }
    >
      {/* Main Content - stack on mobile, side-by-side on lg+ */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Editor Sidebar */}
        <aside
          className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r bg-gray-50 overflow-auto max-h-[50vh] lg:max-h-none"
          aria-label="Post editor"
        >
          <ThreadsEditor />
        </aside>

        {/* Preview Area */}
        <main
          className="flex flex-1 items-start lg:items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 overflow-auto"
          aria-label="Post preview"
        >
          <ScalableMockupWrapper mockupWidth={MOCKUP_WIDTH}>
            <div ref={postRef} className="rounded-xl bg-white p-4 lg:p-8 shadow-lg">
              <ThreadsPost />
            </div>
          </ScalableMockupWrapper>
        </main>
      </div>
    </EditorLayout>
  )
}
