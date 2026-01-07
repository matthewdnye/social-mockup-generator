'use client'

import { forwardRef, useState, useEffect } from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { formatNumber, getRelativeTime, encodeColorForSvg } from '@/lib/utils'

interface ThreadsPostProps {
  className?: string
}

// Threads icons as img tags with data URIs for html2canvas compatibility

// Helper to create img-based icon for html2canvas compatibility
const createThreadsIcon = (svg: string, className: string) => (
  <img
    src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
    alt=""
    className={className}
  />
)

// Threads icon SVG templates
const THREADS_ICONS = {
  heartOutline: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartFilled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF3040" stroke="%23FF3040" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  comment: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  repost: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  share: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  more: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>`,
  verified: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230095F6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
}

// URL-encode color for SVG - using shared helper
const encodeColor = (color: string) => encodeColorForSvg(color)

const HeartIcon = ({ filled = false, color = '#000000' }: { filled?: boolean; color?: string }) => {
  if (filled) {
    return createThreadsIcon(THREADS_ICONS.heartFilled, 'h-5 w-5')
  }
  return createThreadsIcon(THREADS_ICONS.heartOutline(encodeColor(color)), 'h-5 w-5')
}

const CommentIcon = ({ color = '#000000' }: { color?: string }) =>
  createThreadsIcon(THREADS_ICONS.comment(encodeColor(color)), 'h-5 w-5')

const RepostIcon = ({ color = '#000000' }: { color?: string }) =>
  createThreadsIcon(THREADS_ICONS.repost(encodeColor(color)), 'h-5 w-5')

const ShareIcon = ({ color = '#000000' }: { color?: string }) =>
  createThreadsIcon(THREADS_ICONS.share(encodeColor(color)), 'h-5 w-5')

const MoreIcon = ({ color = '#000000' }: { color?: string }) =>
  createThreadsIcon(THREADS_ICONS.more(encodeColor(color)), 'h-5 w-5')

const VerifiedIcon = () =>
  createThreadsIcon(THREADS_ICONS.verified, 'h-3.5 w-3.5 ml-1')

export const ThreadsPost = forwardRef<HTMLDivElement, ThreadsPostProps>(
  ({ className = '' }, ref) => {
    const [mounted, setMounted] = useState(false)
    const store = usePostStore()

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return (
        <div className="w-[598px] bg-white rounded-lg animate-pulse">
          <div className="h-[300px] bg-gray-200" />
        </div>
      )
    }

    const { theme, author, content: postContent, metrics, images, timestamp } = store

    // Threads theme colors - very similar to Instagram/Meta aesthetic
    const themeColors = theme === 'dark'
      ? {
          bg: '#101010',
          cardBg: '#101010',
          text: '#F5F5F5',
          secondaryText: '#777777',
          border: '#333333',
          actionText: '#F5F5F5',
        }
      : {
          bg: '#FFFFFF',
          cardBg: '#FFFFFF',
          text: '#000000',
          secondaryText: '#999999',
          border: '#E0E0E0',
          actionText: '#000000',
        }

    // Image handling
    const hasImage = images && images.length > 0
    const displayImage = hasImage ? images[0].url : null

    return (
      <div
        ref={ref}
        className={`w-[598px] ${className}`}
        style={{
          backgroundColor: themeColors.cardBg,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* Main post container */}
        <div
          style={{
            padding: '16px',
            borderBottom: `1px solid ${themeColors.border}`,
          }}
        >
          {/* Header row: Avatar + Content */}
          <div style={{ display: 'flex' }}>
            {/* Left column: Avatar + Thread line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '12px' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${themeColors.border}`,
                  flexShrink: 0,
                }}
              >
                <img
                  src={author.avatar || '/avatars/default.png'}
                  alt={author.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>

            {/* Right column: Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: '15px',
                      color: themeColors.text,
                    }}
                  >
                    {author.handle?.replace('@', '') || 'username'}
                  </span>
                  {author.verified && <VerifiedIcon />}
                  <span
                    style={{
                      fontSize: '15px',
                      color: themeColors.secondaryText,
                      marginLeft: '8px',
                    }}
                  >
                    {getRelativeTime(timestamp)}
                  </span>
                </div>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <MoreIcon color={themeColors.text} />
                </button>
              </div>

              {/* Post text */}
              <div
                style={{
                  marginTop: '4px',
                  fontSize: '15px',
                  lineHeight: '20px',
                  color: themeColors.text,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {postContent}
              </div>

              {/* Image (if present) */}
              {displayImage && (
                <div
                  style={{
                    marginTop: '12px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  <img
                    src={displayImage}
                    alt="Post"
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}

              {/* Action buttons row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '12px',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <HeartIcon color={themeColors.actionText} />
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CommentIcon color={themeColors.actionText} />
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <RepostIcon color={themeColors.actionText} />
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ShareIcon color={themeColors.actionText} />
                </button>
              </div>

              {/* Metrics row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '8px',
                  fontSize: '14px',
                  color: themeColors.secondaryText,
                }}
              >
                {metrics.comments > 0 && (
                  <span style={{ marginRight: '12px' }}>
                    {formatNumber(metrics.comments)} replies
                  </span>
                )}
                {metrics.likes > 0 && (
                  <span>
                    {formatNumber(metrics.likes)} likes
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ThreadsPost.displayName = 'ThreadsPost'
