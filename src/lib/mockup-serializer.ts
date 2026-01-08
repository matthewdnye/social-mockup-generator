import type { Platform, Theme, PostAuthor, PostMetrics, PostImage } from './types'

/**
 * Serializable mockup state for sending to the screenshot API
 * All Date objects converted to ISO strings for JSON serialization
 */
export interface SerializedMockupState {
  platform: Platform
  theme: Theme
  author: PostAuthor
  content: string
  timestamp: string // ISO date string
  metrics: PostMetrics
  images: PostImage[]
  client?: string
  privacy?: 'public' | 'friends' | 'only_me'
}

export interface ScreenshotRequest {
  mockup: SerializedMockupState
  scale?: 1 | 2 | 3
}

export interface ScreenshotResponse {
  success: boolean
  error?: string
}

/**
 * Serialize the current mockup state for the screenshot API
 */
export function serializeMockupState(state: {
  platform: Platform
  theme: Theme
  author: PostAuthor
  content: string
  timestamp: Date
  metrics: PostMetrics
  images: PostImage[]
  client?: string
  privacy?: 'public' | 'friends' | 'only_me'
}): SerializedMockupState {
  return {
    platform: state.platform,
    theme: state.theme,
    author: { ...state.author },
    content: state.content,
    timestamp: state.timestamp.toISOString(),
    metrics: { ...state.metrics },
    images: [...state.images],
    client: state.client,
    privacy: state.privacy,
  }
}

/**
 * Deserialize mockup state from API request
 */
export function deserializeMockupState(serialized: SerializedMockupState): {
  platform: Platform
  theme: Theme
  author: PostAuthor
  content: string
  timestamp: Date
  metrics: PostMetrics
  images: PostImage[]
  client?: string
  privacy?: 'public' | 'friends' | 'only_me'
} {
  return {
    platform: serialized.platform,
    theme: serialized.theme,
    author: serialized.author,
    content: serialized.content,
    timestamp: new Date(serialized.timestamp),
    metrics: serialized.metrics,
    images: serialized.images,
    client: serialized.client,
    privacy: serialized.privacy,
  }
}
