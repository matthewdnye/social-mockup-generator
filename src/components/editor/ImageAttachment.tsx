'use client'

import * as React from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

export function ImageAttachment() {
  const { images, addImage, removeImage } = usePostStore()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = React.useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          addImage({
            url: reader.result as string,
            alt: file.name,
          })
        }
        reader.readAsDataURL(file)
      })
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      addImage({
        url: urlInput.trim(),
        alt: 'Image',
      })
      setUrlInput('')
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-gray-900">Images</Label>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-video overflow-hidden rounded-lg border bg-gray-100"
            >
              <img
                src={image.url}
                alt={image.alt || `Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload controls */}
      {images.length < 4 && (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Upload Image ({images.length}/4)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex gap-2">
            <Input
              placeholder="Or paste image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
