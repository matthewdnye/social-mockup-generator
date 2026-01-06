'use client'

import React, { forwardRef, useState, useEffect } from 'react'
import { cn, formatNumber, formatDate } from '@/lib/utils'
import { usePostStore } from '@/hooks/usePostStore'
import { DEFAULT_AUTHOR, DEFAULT_METRICS } from '@/lib/types'
import type { Theme, PostAuthor, PostMetrics, PostImage } from '@/lib/types'

// Twitter/X Icons as SVG components
const VerifiedBadge = ({ type = 'blue' }: { type?: 'blue' | 'gold' | 'gray' }) => {
  const colors = {
    blue: '#1d9bf0',
    gold: '#e6a500',
    gray: '#829aab',
  }
  return (
    <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] ml-1 flex-shrink-0" style={{ minWidth: '18px' }}>
      <path
        fill={colors[type]}
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  )
}

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
    />
  </svg>
)

const RetweetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
    />
  </svg>
)

const LikeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
    />
  </svg>
)

const ViewsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"
    />
  </svg>
)

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"
    />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
    />
  </svg>
)

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
    />
  </svg>
)

export interface TwitterPostProps {
  // All props are optional - will use Zustand store when not provided
  theme?: Theme
  author?: PostAuthor
  content?: string
  timestamp?: Date
  metrics?: PostMetrics
  images?: PostImage[]
  client?: string
  editable?: boolean
  onContentChange?: (content: string) => void
  onAuthorChange?: (author: Partial<PostAuthor>) => void
  onMetricsChange?: (metrics: Partial<PostMetrics>) => void
}

export const TwitterPost = forwardRef<HTMLDivElement, TwitterPostProps>(
  (props, ref) => {
    // Track if component has mounted (for SSR hydration)
    const [mounted, setMounted] = useState(false)

    // Get state from Zustand store
    const store = usePostStore()

    useEffect(() => {
      setMounted(true)
    }, [])

    // Default values for SSR
    const defaultTheme: Theme = 'light'
    const defaultContent = 'Your post content goes here. Click to edit this text and make it your own!'
    const defaultTimestamp = new Date()
    const defaultImages: PostImage[] = []
    const defaultClient = 'Twitter for iPhone'

    // Use props if provided, otherwise use store values (or defaults for SSR)
    const theme = props.theme ?? (mounted ? store.theme : defaultTheme)
    const author = props.author ?? (mounted ? store.author : DEFAULT_AUTHOR)
    const content = props.content ?? (mounted ? store.content : defaultContent)
    const timestamp = props.timestamp ?? (mounted ? store.timestamp : defaultTimestamp)
    const metrics = props.metrics ?? (mounted ? store.metrics : DEFAULT_METRICS)
    const images = props.images ?? (mounted ? store.images : defaultImages)
    const client = props.client ?? (mounted ? store.client : defaultClient)
    const editable = props.editable ?? false
    const onContentChange = props.onContentChange
    const onAuthorChange = props.onAuthorChange
    const onMetricsChange = props.onMetricsChange

    const isDark = theme === 'dark' || theme === 'dim'
    const isDim = theme === 'dim'

    const bgColor = isDark ? (isDim ? '#15202b' : '#000000') : '#ffffff'
    const textColor = isDark ? '#e7e9ea' : '#0f1419'
    const secondaryColor = isDark ? '#71767b' : '#536471'
    const borderColor = isDark ? '#2f3336' : '#eff3f4'

    return (
      <div
        ref={ref}
        className="font-twitter w-[598px]"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Post Container */}
        <div className="px-4 py-3">
          {/* Header: Avatar + Name + Handle + More */}
          <div className="flex items-start">
            {/* Avatar */}
            <div className="flex-shrink-0 mr-3">
              <img
                src={author.avatar || '/avatars/default.png'}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%231d9bf0"/><text x="50" y="65" text-anchor="middle" fill="white" font-size="40">?</text></svg>'
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 overflow-visible">
              {/* Name row */}
              <div className="flex items-center justify-between overflow-visible">
                <div className="flex items-center flex-wrap overflow-visible">
                  <span
                    className={cn(
                      'font-bold text-[15px] leading-5',
                      editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                    )}
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) => onAuthorChange?.({ name: e.currentTarget.textContent || '' })}
                    style={{ color: textColor }}
                  >
                    {author.name}
                  </span>
                  {author.verified && <VerifiedBadge type={author.verifiedType || 'blue'} />}
                  <span
                    className={cn(
                      'text-[15px] leading-5 ml-1',
                      editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                    )}
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) => onAuthorChange?.({ handle: e.currentTarget.textContent?.replace('@', '') || '' })}
                    style={{ color: secondaryColor }}
                  >
                    @{author.handle}
                  </span>
                  <span className="mx-1" style={{ color: secondaryColor }}>·</span>
                  <span className="text-[15px]" style={{ color: secondaryColor }}>
                    {formatDate(timestamp, 'twitter').split('·')[1]?.trim() || 'Jun 1'}
                  </span>
                </div>
                <button className="p-2 -m-2 rounded-full hover:bg-blue-500/10 transition-colors">
                  <MoreIcon />
                </button>
              </div>

              {/* Post text */}
              <div
                className={cn(
                  'mt-1 text-[15px] leading-5 whitespace-pre-wrap break-words',
                  editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                )}
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) => onContentChange?.(e.currentTarget.textContent || '')}
                style={{ color: textColor }}
              >
                {content}
              </div>

              {/* Images */}
              {images.length > 0 && (
                <div className="mt-3 rounded-2xl overflow-hidden border" style={{ borderColor }}>
                  {images.length === 1 && (
                    <img
                      src={images[0].url}
                      alt={images[0].alt || 'Post image'}
                      className="w-full max-h-[510px] object-cover"
                    />
                  )}
                  {images.length === 2 && (
                    <div className="flex">
                      {images.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt={img.alt || `Image ${i + 1}`}
                          className="w-1/2 h-[286px] object-cover"
                          style={{ marginLeft: i > 0 ? '2px' : 0 }}
                        />
                      ))}
                    </div>
                  )}
                  {images.length === 3 && (
                    <div className="flex">
                      <img
                        src={images[0].url}
                        alt={images[0].alt || 'Image 1'}
                        className="w-1/2 h-[286px] object-cover"
                      />
                      <div className="w-1/2 flex flex-col" style={{ marginLeft: '2px' }}>
                        {images.slice(1).map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt={img.alt || `Image ${i + 2}`}
                            className="w-full h-[142px] object-cover"
                            style={{ marginTop: i > 0 ? '2px' : 0 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {images.length >= 4 && (
                    <div className="flex flex-wrap">
                      {images.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt={img.alt || `Image ${i + 1}`}
                          className="w-1/2 h-[142px] object-cover"
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

              {/* Timestamp + Client */}
              <div className="mt-3 flex items-center text-[15px]" style={{ color: secondaryColor }}>
                <span>{formatDate(timestamp, 'twitter').split('·')[0]?.trim()}</span>
                <span className="mx-1">·</span>
                <span className="hover:underline cursor-pointer">{client}</span>
              </div>

              {/* Stats row */}
              {(metrics.reposts > 0 || (metrics.quotes ?? 0) > 0 || metrics.likes > 0 || (metrics.bookmarks ?? 0) > 0) && (
                <div
                  className="mt-3 py-3 flex items-center text-[15px] border-t"
                  style={{ borderColor }}
                >
                  {metrics.reposts > 0 && (
                    <div className="flex items-center mr-5">
                      <span
                        className={cn(
                          'font-bold mr-1',
                          editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                        )}
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) => onMetricsChange?.({ reposts: parseInt(e.currentTarget.textContent || '0') || 0 })}
                        style={{ color: textColor }}
                      >
                        {formatNumber(metrics.reposts)}
                      </span>
                      <span style={{ color: secondaryColor }}>Reposts</span>
                    </div>
                  )}
                  {metrics.quotes && metrics.quotes > 0 && (
                    <div className="flex items-center mr-5">
                      <span
                        className={cn(
                          'font-bold mr-1',
                          editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                        )}
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) => onMetricsChange?.({ quotes: parseInt(e.currentTarget.textContent || '0') || 0 })}
                        style={{ color: textColor }}
                      >
                        {formatNumber(metrics.quotes)}
                      </span>
                      <span style={{ color: secondaryColor }}>Quotes</span>
                    </div>
                  )}
                  {metrics.likes > 0 && (
                    <div className="flex items-center mr-5">
                      <span
                        className={cn(
                          'font-bold mr-1',
                          editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                        )}
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) => onMetricsChange?.({ likes: parseInt(e.currentTarget.textContent || '0') || 0 })}
                        style={{ color: textColor }}
                      >
                        {formatNumber(metrics.likes)}
                      </span>
                      <span style={{ color: secondaryColor }}>Likes</span>
                    </div>
                  )}
                  {metrics.bookmarks && metrics.bookmarks > 0 && (
                    <div className="flex items-center">
                      <span
                        className={cn(
                          'font-bold mr-1',
                          editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                        )}
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) => onMetricsChange?.({ bookmarks: parseInt(e.currentTarget.textContent || '0') || 0 })}
                        style={{ color: textColor }}
                      >
                        {formatNumber(metrics.bookmarks)}
                      </span>
                      <span style={{ color: secondaryColor }}>Bookmarks</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div
                className="mt-1 py-1 flex items-center justify-between max-w-[425px] border-t"
                style={{ borderColor, color: secondaryColor }}
              >
                <button className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors group">
                  <CommentIcon />
                </button>
                <button className="p-2 rounded-full hover:bg-green-500/10 hover:text-green-500 transition-colors group">
                  <RetweetIcon />
                </button>
                <button className="p-2 rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-colors group">
                  <LikeIcon />
                </button>
                <button className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors group">
                  <ViewsIcon />
                </button>
                <div className="flex items-center">
                  <button className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors group">
                    <BookmarkIcon />
                  </button>
                  <button className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors group">
                    <ShareIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

TwitterPost.displayName = 'TwitterPost'

export default TwitterPost
