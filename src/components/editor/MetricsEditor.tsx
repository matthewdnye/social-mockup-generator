'use client'

import * as React from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function MetricsEditor() {
  const { metrics, setMetrics, randomizeMetrics } = usePostStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-gray-900">Engagement Metrics</Label>
        <Button variant="outline" size="sm" onClick={randomizeMetrics}>
          Randomize
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="likes" className="text-xs">
            Likes
          </Label>
          <Input
            id="likes"
            type="number"
            min={0}
            value={metrics.likes}
            onChange={(e) => setMetrics({ likes: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="comments" className="text-xs">
            Comments/Replies
          </Label>
          <Input
            id="comments"
            type="number"
            min={0}
            value={metrics.comments}
            onChange={(e) => setMetrics({ comments: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reposts" className="text-xs">
            Reposts/Shares
          </Label>
          <Input
            id="reposts"
            type="number"
            min={0}
            value={metrics.reposts}
            onChange={(e) => setMetrics({ reposts: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quotes" className="text-xs">
            Quotes
          </Label>
          <Input
            id="quotes"
            type="number"
            min={0}
            value={metrics.quotes}
            onChange={(e) => setMetrics({ quotes: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bookmarks" className="text-xs">
            Bookmarks
          </Label>
          <Input
            id="bookmarks"
            type="number"
            min={0}
            value={metrics.bookmarks}
            onChange={(e) => setMetrics({ bookmarks: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="views" className="text-xs">
            Views
          </Label>
          <Input
            id="views"
            type="number"
            min={0}
            value={metrics.views}
            onChange={(e) => setMetrics({ views: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  )
}
