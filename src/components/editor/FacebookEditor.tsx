'use client'

import * as React from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AvatarUpload } from './AvatarUpload'
import { ImageAttachment } from './ImageAttachment'
import { ProfileManager } from './ProfileManager'

const privacyOptions = [
  { value: 'public', label: 'Public', description: 'Anyone can see this post' },
  { value: 'friends', label: 'Friends', description: 'Only friends can see this post' },
  { value: 'only_me', label: 'Only Me', description: 'Only you can see this post' },
] as const

export function FacebookEditor() {
  const {
    theme,
    author,
    content,
    metrics,
    privacy,
    setTheme,
    setAuthor,
    setContent,
    setMetrics,
    setPrivacy,
    randomizeMetrics,
  } = usePostStore()

  return (
    <div className="space-y-6 overflow-y-auto p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Post Editor</h2>
        <p className="text-sm text-gray-600">
          Edit the Facebook post content and appearance
        </p>
      </div>

      {/* Theme Selector - Facebook only has light/dark */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900">Theme</Label>
        <div className="flex">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 rounded-lg border-2 p-3 transition-all mr-2 ${
              theme === 'light'
                ? 'border-[#D9B01C] bg-[#D9B01C]/10'
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
                ? 'border-[#D9B01C] bg-[#D9B01C]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="mb-2 h-8 rounded border bg-[#242526] border-gray-700" />
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
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={author.name}
            onChange={(e) => setAuthor({ name: e.target.value })}
            placeholder="John Doe"
            autoComplete="off"
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

      {/* Privacy Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Privacy</h3>
        <div className="space-y-1.5">
          <Label htmlFor="privacy">Who can see this post?</Label>
          <Select
            value={privacy}
            onValueChange={(value: 'public' | 'friends' | 'only_me') => setPrivacy(value)}
          >
            <SelectTrigger id="privacy">
              <SelectValue placeholder="Select privacy setting" />
            </SelectTrigger>
            <SelectContent>
              {privacyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Content</h3>
        <div className="space-y-1.5">
          <Label htmlFor="content">Post Text</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
          />
        </div>

        <ImageAttachment />
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
              Reactions
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
          <div className="space-y-1.5">
            <Label htmlFor="reposts" className="text-xs">
              Shares
            </Label>
            <Input
              id="reposts"
              type="number"
              min={0}
              value={metrics.reposts}
              onChange={(e) =>
                setMetrics({ reposts: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
