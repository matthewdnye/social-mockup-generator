'use client'

import * as React from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AvatarUpload } from './AvatarUpload'
import { MetricsEditor } from './MetricsEditor'
import { ThemeSelector } from './ThemeSelector'
import { ImageAttachment } from './ImageAttachment'

const clientOptions = [
  'Twitter for iPhone',
  'Twitter for Android',
  'Twitter Web App',
  'TweetDeck',
  'Buffer',
  'Hootsuite',
  'Sprout Social',
]

export function PostEditor() {
  const { author, content, client, setAuthor, setContent, setClient } =
    usePostStore()

  return (
    <div className="space-y-6 overflow-y-auto p-6">
      <div>
        <h2 className="text-lg font-semibold">Post Editor</h2>
        <p className="text-sm text-gray-500">
          Edit the post content and appearance
        </p>
      </div>

      {/* Theme Selector */}
      <ThemeSelector />

      <hr className="border-gray-200" />

      {/* Author Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Author</h3>
        <AvatarUpload />

        <div className="space-y-1.5">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={author.name}
            onChange={(e) => setAuthor({ name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="handle">Handle</Label>
          <Input
            id="handle"
            value={author.handle}
            onChange={(e) => setAuthor({ handle: e.target.value })}
            placeholder="@johndoe"
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
        <h3 className="font-medium">Content</h3>
        <div className="space-y-1.5">
          <Label htmlFor="content">Post Text</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            rows={4}
          />
        </div>

        <ImageAttachment />
      </div>

      <hr className="border-gray-200" />

      {/* Metrics Section */}
      <MetricsEditor />

      <hr className="border-gray-200" />

      {/* Meta Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Post Details</h3>
        <div className="space-y-1.5">
          <Label htmlFor="client">Posted via</Label>
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger id="client">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clientOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
