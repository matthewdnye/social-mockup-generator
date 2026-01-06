'use client'

import { create } from 'zustand'
import type { Platform, Theme, PostAuthor, PostMetrics, PostImage } from '@/lib/types'
import { DEFAULT_AUTHOR, DEFAULT_METRICS } from '@/lib/types'

interface PostStore {
  // State
  platform: Platform
  theme: Theme
  author: PostAuthor
  content: string
  timestamp: Date
  metrics: PostMetrics
  images: PostImage[]
  client: string
  privacy: 'public' | 'friends' | 'only_me'

  // Actions
  setPlatform: (platform: Platform) => void
  setTheme: (theme: Theme) => void
  setAuthor: (author: Partial<PostAuthor>) => void
  setContent: (content: string) => void
  setTimestamp: (timestamp: Date) => void
  setMetrics: (metrics: Partial<PostMetrics>) => void
  addImage: (image: PostImage) => void
  removeImage: (index: number) => void
  setClient: (client: string) => void
  setPrivacy: (privacy: 'public' | 'friends' | 'only_me') => void
  randomizeMetrics: () => void
  reset: () => void
}

const getInitialState = () => ({
  platform: 'twitter' as Platform,
  theme: 'light' as Theme,
  author: { ...DEFAULT_AUTHOR },
  content: 'Your post content goes here. Click to edit this text and make it your own!',
  timestamp: new Date(),
  metrics: { ...DEFAULT_METRICS },
  images: [] as PostImage[],
  client: 'Twitter for iPhone',
  privacy: 'public' as const,
})

// Simple store without persist - SSR safe
export const usePostStore = create<PostStore>()((set) => ({
  ...getInitialState(),

  setPlatform: (platform) => set({ platform }),

  setTheme: (theme) => set({ theme }),

  setAuthor: (author) =>
    set((state) => ({
      author: { ...state.author, ...author },
    })),

  setContent: (content) => set({ content }),

  setTimestamp: (timestamp) => set({ timestamp }),

  setMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),

  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),

  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),

  setClient: (client) => set({ client }),

  setPrivacy: (privacy) => set({ privacy }),

  randomizeMetrics: () =>
    set({
      metrics: {
        likes: Math.floor(Math.random() * 50000),
        comments: Math.floor(Math.random() * 1000),
        reposts: Math.floor(Math.random() * 5000),
        quotes: Math.floor(Math.random() * 500),
        bookmarks: Math.floor(Math.random() * 2000),
        views: Math.floor(Math.random() * 500000),
      },
    }),

  reset: () => set(getInitialState()),
}))
