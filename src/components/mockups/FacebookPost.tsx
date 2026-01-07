'use client'

import React, { forwardRef, useState, useEffect } from 'react'
import { cn, formatNumber, formatDate } from '@/lib/utils'
import { usePostStore } from '@/hooks/usePostStore'
import { DEFAULT_AUTHOR, DEFAULT_METRICS } from '@/lib/types'
import type { Theme, PostAuthor, PostMetrics, PostImage } from '@/lib/types'

// Facebook icons as img tags with data URIs for html2canvas compatibility

// Helper to create img-based icon for html2canvas compatibility
const createFbIcon = (svg: string, className: string) => (
  <img
    src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
    alt=""
    className={className}
  />
)

// Pre-encoded SVG strings for reaction icons (these have gradients)
const FB_LIKE_FILLED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0" stop-color="#18AFFF"/><stop offset="1" stop-color="#0062DF"/></linearGradient><circle cx="8" cy="8" r="8" fill="url(#a)"/><path fill="white" d="M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725.1.163.132.36.089.546-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666z"/></svg>`

const FB_LOVE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0" stop-color="#FF6680"/><stop offset="1" stop-color="#E61739"/></linearGradient><circle cx="8" cy="8" r="8" fill="url(#a)"/><path fill="white" d="M10.473 4c-1.07 0-1.632.67-2.473 1.652C7.16 4.67 6.597 4 5.527 4 4.342 4 3.473 4.88 3.473 5.982c0 2.423 3.88 5.494 4.527 6.018.647-.524 4.527-3.595 4.527-6.018C12.527 4.88 11.658 4 10.473 4"/></svg>`

const FB_CARE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0" stop-color="#F7B125"/><stop offset="1" stop-color="#F09B30"/></linearGradient><circle cx="8" cy="8" r="8" fill="url(#a)"/><path fill="#E6760B" d="M7.5 11.5c-2 0-3.5-1.25-3.5-2.5 0-.75.5-1.5 1.5-1.5.75 0 1.25.5 2 .5s1.25-.5 2-.5c1 0 1.5.75 1.5 1.5 0 1.25-1.5 2.5-3.5 2.5"/><ellipse cx="5.5" cy="6" rx="1" ry="1.5" fill="#231F20"/><ellipse cx="10.5" cy="6" rx="1" ry="1.5" fill="#231F20"/></svg>`

const FB_HAHA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0" stop-color="#FEEA70"/><stop offset="1" stop-color="#F69B30"/></linearGradient><circle cx="8" cy="8" r="8" fill="url(#a)"/><path fill="#2A2622" d="M3 8.5c0 1.5 2.2 3.5 5 3.5s5-2 5-3.5c0-.5-1-1-1.5-1-.25 0-.5.5-1 .5-1 0-1.5-1-2.5-1s-1.5 1-2.5 1c-.5 0-.75-.5-1-.5-.5 0-1.5.5-1.5 1"/><path fill="white" d="M4.5 9c.5 0 1-.25 1.5-.25s1 .25 2 .25 1.5-.25 2-.25.75.25 1.5.25c0 1.5-1.5 2.5-3.5 2.5S4.5 10.5 4.5 9"/><path fill="#2A2622" d="M4 6c0 .5.5 1 1.5 1S7 6.5 7 6c0-.25-.5-.5-.75-.5-.5 0-.75.25-1 .25S4.5 5.5 4 5.5c-.25 0-.75.25-.75.5s.25.5.75.5m5 0c0 .5.5 1 1.5 1s1.5-.5 1.5-1c0-.25-.5-.5-.75-.5-.5 0-.75.25-1 .25S9.5 5.5 9 5.5c-.25 0-.75.25-.75.5s.25.5.75.5"/></svg>`

const FB_WOW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0" stop-color="#FEEA70"/><stop offset="1" stop-color="#F69B30"/></linearGradient><circle cx="8" cy="8" r="8" fill="url(#a)"/><ellipse cx="8" cy="10.5" rx="1.5" ry="2" fill="#2A2622"/><ellipse cx="5" cy="5.5" rx="1.25" ry="1.75" fill="white"/><ellipse cx="11" cy="5.5" rx="1.25" ry="1.75" fill="white"/><ellipse cx="5" cy="5.75" rx=".75" ry="1" fill="#2A2622"/><ellipse cx="11" cy="5.75" rx=".75" ry="1" fill="#2A2622"/><path fill="#9B7523" d="M3.5 4c.25-.5.75-.75 1.5-.75.5 0 1 .25 1.25.5.25-.25.75-.5 1.25-.5s1 .25 1.25.5c.25-.25.75-.5 1.25-.5.75 0 1.25.25 1.5.75-.25-.75-1-.75-1.5-.75-.5 0-.75.25-1 .25-.25 0-.5-.25-1-.25-.25 0-.5.25-.75.25-.25 0-.5-.25-.75-.25s-.5.25-.75.25c-.25 0-.5-.25-1-.25-.5 0-1.25 0-1.5.75"/></svg>`

const FB_SAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0" stop-color="#FEEA70"/><stop offset="1" stop-color="#F69B30"/></linearGradient><circle cx="8" cy="8" r="8" fill="url(#a)"/><path fill="#2A2622" d="M5.5 12c0-.75 1.1-1.5 2.5-1.5s2.5.75 2.5 1.5"/><ellipse cx="5" cy="6.5" rx="1" ry="1.25" fill="#2A2622"/><ellipse cx="11" cy="6.5" rx="1" ry="1.25" fill="#2A2622"/><path fill="#5093D5" d="M5.25 8c.25 0 .5.25.5.75 0 .75-.5 1.5-1.25 2-.25.25-.5.25-.5 0-.25-.5-.25-1 0-1.5.25-.75.75-1.25 1.25-1.25"/><path fill="#9B7523" d="M3 5c.25-.25.75-.5 1.25-.5s1 .25 1.5.75c.25-.5.75-.75 1.5-.75s1.5.5 1.5.75c0-.25.5-.75 1.5-.75s1.25.25 1.5.75c.5-.5 1-.75 1.5-.75s1 .25 1.25.5c-.25-.5-.75-1-1.75-1s-1.5.5-2 .75c-.25-.25-.75-.75-1.75-.75s-1.5.5-1.75.75c-.5-.25-1-.75-2-.75s-1.5.5-1.75 1"/></svg>`

const FB_ANGRY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0" stop-color="#F7B125"/><stop offset="1" stop-color="#DD4A1F"/></linearGradient><circle cx="8" cy="8" r="8" fill="url(#a)"/><path fill="#2A2622" d="M5.5 11c0-.5.5-1 2.5-1s2.5.5 2.5 1"/><ellipse cx="5" cy="7" rx="1" ry="1.25" fill="#2A2622"/><ellipse cx="11" cy="7" rx="1" ry="1.25" fill="#2A2622"/><path fill="#9B3A23" d="M3 5.5c.5-.5 1-.75 2-.75.75 0 1.25.5 1.5.75-.25-.75-.75-1.25-1.5-1.25-1 0-1.75.75-2 1.25m10 0c-.5-.5-1-.75-2-.75-.75 0-1.25.5-1.5.75.25-.75.75-1.25 1.5-1.25 1 0 1.75.75 2 1.25"/></svg>`

// Icon path data for simple icons
const FB_ICON_PATHS = {
  likeOutline: 'M1 7.5c0-.83.67-1.5 1.5-1.5h1c.28 0 .5.22.5.5v7c0 .28-.22.5-.5.5h-1A1.5 1.5 0 0 1 1 12.5v-5zm4.5-1h2.22c.55 0 1.07.24 1.43.65l.23.26c.16.18.24.41.24.65v.74c0 .28.22.5.5.5h1.53c.83 0 1.4.85 1.08 1.63l-1.14 2.85a1.5 1.5 0 0 1-1.4.97H5.5V6.5z',
  thumbsUp: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
  comment: 'M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
  share: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z',
  more: 'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  public: 'M8 0a8 8 0 108 8 8 8 0 00-8-8zm5.78 4.28a6.94 6.94 0 011.16 3.47h-2.81a14.4 14.4 0 00-.65-3.76 8.52 8.52 0 002.3.29zm-3.85-2.8a6.94 6.94 0 012 2.51 7.53 7.53 0 01-2-.24V1.48zM9.07 1.48v2.35a11.42 11.42 0 01-2.14.19 11.35 11.35 0 01-2.14-.19v-2.35a6.94 6.94 0 014.28 0zm-5.14.51a7.53 7.53 0 012 .24v2.02a14.4 14.4 0 00-.65 3.76H2.06a6.94 6.94 0 011.87-6.02zm-1.87 7h2.81a14.4 14.4 0 00.65 3.76 8.52 8.52 0 00-2.3-.29 6.94 6.94 0 01-1.16-3.47zm3.87 5.49a6.94 6.94 0 01-2-2.51 7.53 7.53 0 012 .24v2.27zm1.14.03v-2.35a11.42 11.42 0 012.14-.19 11.35 11.35 0 012.14.19v2.35a6.94 6.94 0 01-4.28 0zm5.14-.51a7.53 7.53 0 01-2-.24V11.3a14.4 14.4 0 00.65-3.76h2.81a6.94 6.94 0 01-1.46 3.47v2.49z',
  friends: 'M8 6.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3 14.5a1.5 1.5 0 01-1.5-1.5c0-2.49 2.69-4.5 6.5-4.5s6.5 2.01 6.5 4.5a1.5 1.5 0 01-1.5 1.5H3z',
  onlyMe: 'M8 0a4 4 0 00-4 4v2H3a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1h-1V4a4 4 0 00-4-4zm2 6H6V4a2 2 0 114 0v2z',
}

// Helper to create simple path-based icon
const createPathIcon = (path: string, color: string, viewBox: string, className: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="${color.replace('#', '%23')}" d="${path}"/></svg>`
  return createFbIcon(svg, className)
}

// Facebook Reaction Icons
const LikeIcon = ({ filled = false, color = '#000000' }: { filled?: boolean; color?: string }) => {
  if (filled) {
    return createFbIcon(FB_LIKE_FILLED_SVG, 'w-4 h-4')
  }
  return createPathIcon(FB_ICON_PATHS.likeOutline, color, '0 0 16 16', 'w-4 h-4')
}

const LoveReaction = () => createFbIcon(FB_LOVE_SVG, 'w-4 h-4')
const CareReaction = () => createFbIcon(FB_CARE_SVG, 'w-4 h-4')
const HahaReaction = () => createFbIcon(FB_HAHA_SVG, 'w-4 h-4')
const WowReaction = () => createFbIcon(FB_WOW_SVG, 'w-4 h-4')
const SadReaction = () => createFbIcon(FB_SAD_SVG, 'w-4 h-4')
const AngryReaction = () => createFbIcon(FB_ANGRY_SVG, 'w-4 h-4')

// Facebook Like/Reaction Icons
const ThumbsUpIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.thumbsUp, color, '0 0 24 24', 'w-5 h-5')
const CommentIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.comment, color, '0 0 24 24', 'w-5 h-5')
const ShareIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.share, color, '0 0 24 24', 'w-5 h-5')
const MoreIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.more, color, '0 0 24 24', 'w-6 h-6')
const CloseIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.close, color, '0 0 24 24', 'w-5 h-5')

// Privacy icons
const PublicIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.public, color, '0 0 16 16', 'w-3 h-3')
const FriendsIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.friends, color, '0 0 16 16', 'w-3 h-3')
const OnlyMeIcon = ({ color = '#000000' }: { color?: string }) => createPathIcon(FB_ICON_PATHS.onlyMe, color, '0 0 16 16', 'w-3 h-3')

export interface FacebookPostProps {
  theme?: Theme
  author?: PostAuthor
  content?: string
  timestamp?: Date
  metrics?: PostMetrics
  images?: PostImage[]
  privacy?: 'public' | 'friends' | 'only_me'
  editable?: boolean
  onContentChange?: (content: string) => void
  onAuthorChange?: (author: Partial<PostAuthor>) => void
  onMetricsChange?: (metrics: Partial<PostMetrics>) => void
}

export const FacebookPost = forwardRef<HTMLDivElement, FacebookPostProps>(
  (props, ref) => {
    const [mounted, setMounted] = useState(false)
    const store = usePostStore()

    useEffect(() => {
      setMounted(true)
    }, [])

    // Default values
    const defaultTheme: Theme = 'light'
    const defaultContent = 'Just had an amazing experience! Sometimes the little things in life make all the difference. Feeling grateful today. 💙'
    const defaultTimestamp = new Date()
    const defaultImages: PostImage[] = []
    const defaultPrivacy: 'public' | 'friends' | 'only_me' = 'public'
    const defaultAuthor: PostAuthor = {
      name: 'John Doe',
      handle: 'johndoe',
      avatar: '/avatars/default.png',
      verified: false,
    }
    const defaultMetrics: PostMetrics = {
      likes: 142,
      comments: 23,
      reposts: 47,
      reactions: {
        like: 89,
        celebrate: 0,
        support: 0,
        love: 32,
        insightful: 0,
        funny: 21,
      },
    }

    // Use props or store values
    const theme = props.theme ?? (mounted ? store.theme : defaultTheme)
    const author = props.author ?? (mounted ? store.author : defaultAuthor)
    const content = props.content ?? (mounted ? store.content : defaultContent)
    const timestamp = props.timestamp ?? (mounted ? store.timestamp : defaultTimestamp)
    const metrics = props.metrics ?? (mounted ? { ...store.metrics, reactions: store.metrics.reactions || defaultMetrics.reactions } : defaultMetrics)
    const images = props.images ?? (mounted ? store.images : defaultImages)
    const privacy = props.privacy ?? (mounted ? store.privacy : defaultPrivacy)
    const editable = props.editable ?? false
    const onContentChange = props.onContentChange
    const onAuthorChange = props.onAuthorChange
    const onMetricsChange = props.onMetricsChange

    const isDark = theme === 'dark'
    const bgColor = isDark ? '#242526' : '#ffffff'
    const textColor = isDark ? '#e4e6eb' : '#050505'
    const secondaryColor = isDark ? '#b0b3b8' : '#65676b'
    const borderColor = isDark ? '#3e4042' : '#dddfe2'
    const hoverBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'

    const totalReactions = metrics.reactions
      ? metrics.reactions.like + (metrics.reactions.love || 0) + (metrics.reactions.funny || 0)
      : metrics.likes

    // Get privacy icon
    const PrivacyIcon = () => {
      switch (privacy) {
        case 'friends':
          return <FriendsIcon color={secondaryColor} />
        case 'only_me':
          return <OnlyMeIcon color={secondaryColor} />
        default:
          return <PublicIcon color={secondaryColor} />
      }
    }

    return (
      <div
        ref={ref}
        className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif] w-[500px] rounded-lg shadow-sm"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        {/* Post Container */}
        <div className="p-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 mr-2">
                <img
                  src={author.avatar || '/avatars/default.png'}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%231877f2"/><text x="50" y="65" text-anchor="middle" fill="white" font-size="40">?</text></svg>'
                  }}
                />
              </div>

              {/* Author Info */}
              <div>
                <div className="flex items-center">
                  <span
                    className={cn(
                      'font-semibold text-[15px] leading-5 hover:underline cursor-pointer',
                      editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                    )}
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) => onAuthorChange?.({ name: e.currentTarget.textContent || '' })}
                    style={{ color: textColor }}
                  >
                    {author.name}
                  </span>
                  {author.verified && (
                    <img
                      src={`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#1877f2"/><path fill="white" d="M6.5 11.5L3.5 8.5l1-1 2 2 5-5 1 1z"/></svg>')}`}
                      alt="Verified"
                      className="w-[15px] h-[15px] ml-1"
                    />
                  )}
                </div>
                <div className="flex items-center text-[13px]" style={{ color: secondaryColor }}>
                  <span>{formatDate(timestamp, 'facebook')}</span>
                  <span className="mx-1">·</span>
                  <PrivacyIcon />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center">
              <button className="p-2 -m-2 rounded-full hover:bg-black/5 transition-colors">
                <MoreIcon color={secondaryColor} />
              </button>
              <button className="p-2 -m-2 rounded-full hover:bg-black/5 transition-colors ml-1">
                <CloseIcon color={secondaryColor} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn(
              'mt-3 text-[15px] leading-[20px] whitespace-pre-wrap break-words',
              editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
            )}
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => onContentChange?.(e.currentTarget.textContent || '')}
            style={{ color: textColor }}
          >
            {content}
          </div>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="mt-1">
            {images.length === 1 && (
              <img
                src={images[0].url}
                alt={images[0].alt || 'Post image'}
                className="w-full max-h-[500px] object-cover"
              />
            )}
            {images.length === 2 && (
              <div className="flex">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.alt || `Image ${i + 1}`}
                    className="w-1/2 h-[250px] object-cover"
                    style={{ marginLeft: i > 0 ? '2px' : 0 }}
                  />
                ))}
              </div>
            )}
            {images.length >= 3 && (
              <div className="flex flex-wrap">
                {images.slice(0, 4).map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.alt || `Image ${i + 1}`}
                    className="h-[200px] object-cover"
                    style={{
                      marginLeft: i % 2 === 1 ? '2px' : 0,
                      marginTop: i >= 2 ? '2px' : 0,
                      width: i % 2 === 1 ? 'calc(50% - 2px)' : '50%'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reactions Bar */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between text-[15px]" style={{ color: secondaryColor }}>
            <div className="flex items-center">
              {/* Reaction icons */}
              <div className="flex -space-x-1">
                <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center z-[3]">
                  <LikeIcon filled />
                </div>
                <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center z-[2]">
                  <LoveReaction />
                </div>
                <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center z-[1]">
                  <HahaReaction />
                </div>
              </div>
              <span className="ml-2 hover:underline cursor-pointer">
                {formatNumber(totalReactions)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="hover:underline cursor-pointer mr-2">
                {formatNumber(metrics.comments)} comments
              </span>
              <span className="hover:underline cursor-pointer">
                {formatNumber(metrics.reposts)} shares
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="px-3 py-1 flex items-center justify-between border-t"
          style={{ borderColor }}
        >
          <button
            className="flex-1 flex items-center justify-center py-2 rounded-md transition-colors"
            style={{ color: secondaryColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ThumbsUpIcon color={secondaryColor} />
            <span className="ml-2 text-[15px] font-semibold">Like</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center py-2 rounded-md transition-colors"
            style={{ color: secondaryColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <CommentIcon color={secondaryColor} />
            <span className="ml-2 text-[15px] font-semibold">Comment</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center py-2 rounded-md transition-colors"
            style={{ color: secondaryColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ShareIcon color={secondaryColor} />
            <span className="ml-2 text-[15px] font-semibold">Share</span>
          </button>
        </div>
      </div>
    )
  }
)

FacebookPost.displayName = 'FacebookPost'

export default FacebookPost
