'use client'

import * as React from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { AvatarUpload } from './AvatarUpload'
import { ImageAttachment } from './ImageAttachment'
import { ProfileManager } from './ProfileManager'

export function InstagramEditor() {
  const {
    theme,
    author,
    content,
    metrics,
    setTheme,
    setAuthor,
    setContent,
    setMetrics,
    randomizeMetrics,
  } = usePostStore()

  return (
    <div className="space-y-6 overflow-y-auto p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Post Editor</h2>
        <p className="text-sm text-gray-600">
          Edit the Instagram post content and appearance
        </p>
      </div>

      {/* Theme Selector - Instagram light/dark */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900">Theme</Label>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 rounded-lg border-2 p-3 transition-all ${
              theme === 'light'
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="mb-2 h-8 rounded border bg-white border-gray-200" />
            <span className="text-sm font-medium text-gray-700">Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 rounded-lg border-2 p-3 transition-all ${
              theme === 'dark'
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="mb-2 h-8 rounded border bg-black border-gray-700" />
            <span className="text-sm font-medium text-gray-700">Dark</span>
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Saved Profiles */}
      <ProfileManager />

      <hr className="border-gray-200" />

      {/* Author Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Author</h3>
        <AvatarUpload />

        <div className="space-y-1.5">
          <Label htmlFor="handle">Username</Label>
          <Input
            id="handle"
            value={author.handle?.replace('@', '') || ''}
            onChange={(e) => setAuthor({ handle: e.target.value })}
            placeholder="username"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="verified">Verified Badge</Label>
          <Switch
            id="verified"
            checked={author.verified}
            onCheckedChange={(checked) => setAuthor({ verified: checked })}
          />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Content</h3>

        {/* Post Image - Required for Instagram */}
        <ImageAttachment />

        <div className="space-y-1.5">
          <Label htmlFor="content">Caption</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
          />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Metrics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-gray-900">
            Engagement Metrics
          </Label>
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
              onChange={(e) =>
                setMetrics({ likes: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comments" className="text-xs">
              Comments
            </Label>
            <Input
              id="comments"
              type="number"
              min={0}
              value={metrics.comments}
              onChange={(e) =>
                setMetrics({ comments: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
