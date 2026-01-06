'use client'

import * as React from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AvatarUpload() {
  const { author, setAuthor } = usePostStore()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAuthor({ avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor({ avatar: e.target.value })
  }

  return (
    <div className="space-y-3">
      <Label>Profile Photo</Label>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
          {author.avatar && (
            <img
              src={author.avatar}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      <Input
        placeholder="Or enter image URL"
        value={author.avatar || ''}
        onChange={handleUrlChange}
      />
    </div>
  )
}
