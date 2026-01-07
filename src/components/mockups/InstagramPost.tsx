'use client'

import { forwardRef, useState, useEffect } from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { formatNumber, getRelativeTime, encodeColorForSvg } from '@/lib/utils'

interface InstagramPostProps {
  className?: string
}

// Instagram icons as img tags with data URIs for html2canvas compatibility

// Helper to create img-based icon for html2canvas compatibility
const createIgIcon = (svg: string, className: string) => (
  <img
    src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
    alt=""
    className={className}
  />
)

// Instagram icon SVG paths
const IG_ICONS = {
  heartOutline: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  heartFilled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF3040" stroke="%23FF3040" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  comment: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  share: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  bookmarkOutline: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  bookmarkFilled: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  more: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>`,
  verified: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230095F6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
  placeholder: (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
}

// URL-encode color for SVG - using shared helper
const encodeColor = (color: string) => encodeColorForSvg(color)

const HeartIcon = ({ filled = false, color = '#262626' }: { filled?: boolean; color?: string }) => {
  if (filled) {
    return createIgIcon(IG_ICONS.heartFilled, 'h-6 w-6')
  }
  return createIgIcon(IG_ICONS.heartOutline(encodeColor(color)), 'h-6 w-6')
}

const CommentIcon = ({ color = '#262626' }: { color?: string }) =>
  createIgIcon(IG_ICONS.comment(encodeColor(color)), 'h-6 w-6')

const ShareIcon = ({ color = '#262626' }: { color?: string }) =>
  createIgIcon(IG_ICONS.share(encodeColor(color)), 'h-6 w-6')

const BookmarkIcon = ({ filled = false, color = '#262626' }: { filled?: boolean; color?: string }) => {
  if (filled) {
    return createIgIcon(IG_ICONS.bookmarkFilled(encodeColor(color)), 'h-6 w-6')
  }
  return createIgIcon(IG_ICONS.bookmarkOutline(encodeColor(color)), 'h-6 w-6')
}

const MoreIcon = ({ color = '#262626' }: { color?: string }) =>
  createIgIcon(IG_ICONS.more(encodeColor(color)), 'h-6 w-6')

const VerifiedIcon = () =>
  createIgIcon(IG_ICONS.verified, 'h-3 w-3 ml-1')

const PlaceholderIcon = ({ color = '#8E8E8E' }: { color?: string }) =>
  createIgIcon(IG_ICONS.placeholder(encodeColor(color)), 'w-12 h-12 mb-3')

export const InstagramPost = forwardRef<HTMLDivElement, InstagramPostProps>(
  ({ className = '' }, ref) => {
    const [mounted, setMounted] = useState(false)
    const store = usePostStore()

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return (
        <div className="w-[468px] bg-white rounded-lg animate-pulse">
          <div className="h-[600px] bg-gray-200" />
        </div>
      )
    }

    const { theme, author, content: postContent, metrics, images, timestamp } = store

    // Instagram theme colors - Instagram primarily uses white/black
    const themeColors = theme === 'dark'
      ? {
          bg: '#000000',
          cardBg: '#000000',
          text: '#F5F5F5',
          secondaryText: '#A8A8A8',
          border: '#262626',
          actionText: '#F5F5F5',
        }
      : {
          bg: '#FFFFFF',
          cardBg: '#FFFFFF',
          text: '#262626',
          secondaryText: '#8E8E8E',
          border: '#DBDBDB',
          actionText: '#262626',
        }

    // Use shared formatNumber from utils - Instagram uses lowercase suffix
    const formatNumberIg = (num: number): string => {
      const formatted = formatNumber(num)
      return formatted.toLowerCase() // Instagram uses lowercase 'k' and 'm'
    }

    // Placeholder image for posts without images
    const hasImage = images && images.length > 0
    const displayImage = hasImage ? images[0].url : null

    return (
      <div
        ref={ref}
        className={`w-[468px] ${className}`}
        style={{
          backgroundColor: themeColors.cardBg,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* Header - User info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${themeColors.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Avatar with gradient border (Instagram story style) */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                padding: '2px',
                marginRight: '12px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: themeColors.cardBg,
                  padding: '2px',
                }}
              >
                <img
                  src={author.avatar || '/avatars/default.png'}
                  alt={author.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: themeColors.text,
                  }}
                >
                  {author.handle?.replace('@', '') || 'username'}
                </span>
                {author.verified && <VerifiedIcon />}
              </div>
            </div>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <MoreIcon color={themeColors.text} />
          </button>
        </div>

        {/* Image - Instagram is image-first */}
        <div
          style={{
            width: '100%',
            aspectRatio: '1/1',
            backgroundColor: theme === 'dark' ? '#262626' : '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt="Post"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: themeColors.secondaryText,
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <PlaceholderIcon color={themeColors.secondaryText} />
              <span style={{ fontSize: '14px' }}>Add an image to your post</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                marginRight: '16px',
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
              }}
            >
              <ShareIcon color={themeColors.actionText} />
            </button>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            <BookmarkIcon color={themeColors.actionText} />
          </button>
        </div>

        {/* Likes count */}
        <div style={{ padding: '0 16px', marginBottom: '8px' }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: '14px',
              color: themeColors.text,
            }}
          >
            {formatNumberIg(metrics.likes)} likes
          </span>
        </div>

        {/* Caption */}
        <div style={{ padding: '0 16px', marginBottom: '8px' }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: '14px',
              color: themeColors.text,
              marginRight: '4px',
            }}
          >
            {author.handle?.replace('@', '') || 'username'}
          </span>
          <span
            style={{
              fontSize: '14px',
              color: themeColors.text,
              lineHeight: '18px',
            }}
          >
            {postContent}
          </span>
        </div>

        {/* Comments count */}
        {metrics.comments > 0 && (
          <div style={{ padding: '0 16px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '14px',
                color: themeColors.secondaryText,
                cursor: 'pointer',
              }}
            >
              View all {formatNumberIg(metrics.comments)} comments
            </span>
          </div>
        )}

        {/* Timestamp */}
        <div style={{ padding: '0 16px 12px' }}>
          <span
            style={{
              fontSize: '10px',
              color: themeColors.secondaryText,
              textTransform: 'uppercase',
              letterSpacing: '0.2px',
            }}
          >
            {getRelativeTime(timestamp)}
          </span>
        </div>
      </div>
    )
  }
)

InstagramPost.displayName = 'InstagramPost'
