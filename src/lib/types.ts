export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'threads'

export type Theme = 'light' | 'dark' | 'dim'

export interface PostAuthor {
  name: string
  handle: string
  avatar: string
  verified: boolean
  verifiedType?: 'blue' | 'gold' | 'gray' // Twitter verification types
  headline?: string // LinkedIn
  connectionDegree?: '1st' | '2nd' | '3rd' // LinkedIn
}

export interface PostMetrics {
  likes: number
  comments: number
  reposts: number
  quotes?: number // Twitter
  bookmarks?: number // Twitter
  views?: number // Twitter
  reactions?: { // LinkedIn/Facebook
    like: number
    celebrate: number
    support: number
    love: number
    insightful: number
    funny: number
  }
}

export interface PostImage {
  url: string
  alt?: string
}

export interface BasePostState {
  platform: Platform
  theme: Theme
  author: PostAuthor
  content: string
  timestamp: Date
  metrics: PostMetrics
  images: PostImage[]
  client?: string // Twitter: "Twitter for iPhone"
  privacy?: 'public' | 'friends' | 'only_me' // Facebook
}

export interface TwitterPostState extends BasePostState {
  platform: 'twitter'
  client: string
}

export interface LinkedInPostState extends BasePostState {
  platform: 'linkedin'
  author: PostAuthor & {
    headline: string
    connectionDegree: '1st' | '2nd' | '3rd'
  }
}

export interface FacebookPostState extends BasePostState {
  platform: 'facebook'
  privacy: 'public' | 'friends' | 'only_me'
}

export interface InstagramPostState extends BasePostState {
  platform: 'instagram'
}

export interface ThreadsPostState extends BasePostState {
  platform: 'threads'
}

export type PostState = TwitterPostState | LinkedInPostState | FacebookPostState | InstagramPostState | ThreadsPostState

export const DEFAULT_AUTHOR: PostAuthor = {
  name: 'John Doe',
  handle: 'johndoe',
  avatar: '/avatars/default.png',
  verified: false,
}

export const DEFAULT_METRICS: PostMetrics = {
  likes: 142,
  comments: 23,
  reposts: 47,
  quotes: 8,
  bookmarks: 12,
  views: 5420,
}

export function createDefaultPostState(platform: Platform): BasePostState {
  return {
    platform,
    theme: 'light',
    author: { ...DEFAULT_AUTHOR },
    content: 'Your post content goes here. Click to edit this text.',
    timestamp: new Date(),
    metrics: { ...DEFAULT_METRICS },
    images: [],
    client: platform === 'twitter' ? 'Twitter for iPhone' : undefined,
    privacy: platform === 'facebook' ? 'public' : undefined,
  }
}
