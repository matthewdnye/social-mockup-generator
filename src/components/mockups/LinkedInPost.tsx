'use client'

import React, { forwardRef, useState, useEffect } from 'react'
import { cn, formatNumber, formatDate } from '@/lib/utils'
import { usePostStore } from '@/hooks/usePostStore'
import { DEFAULT_AUTHOR, DEFAULT_METRICS } from '@/lib/types'
import type { Theme, PostAuthor, PostMetrics, PostImage } from '@/lib/types'

// LinkedIn icons as img tags with data URIs for html2canvas compatibility
const LINKEDIN_ICONS = {
  likeFilled: 'M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76 2.11 2.11 0 00-.92 1.74 2.14 2.14 0 001 1.8 2.12 2.12 0 00-.74 1.61A2.12 2.12 0 004.38 20h6.88a7 7 0 003.26-.8l1.77-.9a3.32 3.32 0 001.59-1.91l1.75-4.47a2.18 2.18 0 00-.17-2.02z',
  likeOutline: 'M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76 2.11 2.11 0 00-.92 1.74 2.14 2.14 0 001 1.8 2.12 2.12 0 00-.74 1.61A2.12 2.12 0 004.38 20h6.88a7 7 0 003.26-.8l1.77-.9a3.32 3.32 0 001.59-1.91l1.75-4.47a2.18 2.18 0 00-.17-2.02zM10 3.74A.76.76 0 0110.76 3a.75.75 0 01.71.51l.49 1.47a9 9 0 002.16 3.51l3.24 3.24a.2.2 0 010 .21l-1.75 4.47a1.32 1.32 0 01-.63.76l-1.77.9a5 5 0 01-2.33.57H4.38a.12.12 0 01-.12-.12.12.12 0 01.12-.12h1a1 1 0 000-2H4.12a.14.14 0 01-.14-.13.14.14 0 01.14-.14H6a1 1 0 000-2H4.12a.16.16 0 01-.14-.14.16.16 0 01.14-.14h1.76a1 1 0 000-2H4.12a.12.12 0 01-.12-.12A.12.12 0 014.12 11H10z',
  celebrate: 'M11.08 5.83l.53.53 1.06-1.06-.53-.53a1 1 0 00-1.42 0l-3.18 3.18a1 1 0 000 1.42l.53.53 1.06-1.06-.53-.53 2.48-2.48zM21 12l-4.37-4.37L12.89 3.9a3 3 0 00-4.24 0L5.47 7.08a3 3 0 000 4.24l3.73 3.74L4.83 19.4a1.5 1.5 0 002.12 2.12l4.34-4.37 3.74 3.73a3 3 0 004.24 0l3.18-3.18a3 3 0 000-4.24L21 12zm-1.41 5.66l-3.18 3.18a1 1 0 01-1.42 0l-8.48-8.49a1 1 0 010-1.42l3.18-3.18a1 1 0 011.42 0l8.48 8.49a1 1 0 010 1.42z',
  support: 'M12.26 21.22l-.26.27-.26-.27C6.61 16.54 3 12.91 3 9.5 3 6.42 5.42 4 8.5 4c1.74 0 3.41.81 4.5 2.09C14.09 4.81 15.76 4 17.5 4 20.58 4 23 6.42 23 9.5c0 3.41-3.61 7.04-8.74 11.72z',
  love: 'M12 21.638l-.846-.681C5.662 16.31 2 13.088 2 9.192 2 6.074 4.463 3.5 7.5 3.5c1.74 0 3.41.81 4.5 2.09C13.09 4.31 14.76 3.5 16.5 3.5 19.537 3.5 22 6.074 22 9.192c0 3.896-3.662 7.118-9.154 11.765l-.846.681z',
  insightful: 'M12 2a9 9 0 00-9 9 8.93 8.93 0 003.61 7.2l-.62 2.48A1.5 1.5 0 007.44 23h9.12a1.5 1.5 0 001.45-1.88l-.55-2.2A9 9 0 0012 2zm4.69 14.24l.8 3.2a.5.5 0 01-.49.62H6.94a.5.5 0 01-.48-.62l.87-3.48A6.92 6.92 0 015 11a7 7 0 1111.69 5.24z',
  funny: 'M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm4-9a1.5 1.5 0 10-1.5-1.5A1.5 1.5 0 0016 11zm-4.5-1.5A1.5 1.5 0 108 11a1.5 1.5 0 003.5-1.5zM12 17.5c2.33 0 4.32-1.45 5.12-3.5H6.88c.8 2.05 2.79 3.5 5.12 3.5z',
  comment: 'M7 9h10v1H7zm0 4h7v-1H7zm16-2a9 9 0 01-9 9h-4l-4.28 4.28a1 1 0 01-1.71-.71V11a9 9 0 019-9 9 9 0 019 9zM9.46 19H14a7 7 0 000-14 7 7 0 00-7 7v7.46l1.29-1.29A1 1 0 019 19a.37.37 0 00.46 0z',
  repost: 'M13.96 5H6c-1.1 0-2 .9-2 2v10l2-2V7h7.96l-2 2.03 1.41 1.41L17.79 6l-4.42-4.41L11.96 3l2 2zm4.04 14H11l2-2.03-1.41-1.41L7.17 20l4.42 4.41L13 22.96l-2-2H18c1.1 0 2-.9 2-2V9l-2 2v8z',
  send: 'M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z',
  more: 'M14 12a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0z',
  globe: 'M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 01.22-1.47l.28.27a1 1 0 00.71.29h.8A1.19 1.19 0 016 8.24l.11.85a1.19 1.19 0 01-1.19 1.35H4a5.05 5.05 0 01-1-2.44zm5 5a5.34 5.34 0 01-.57 0A1.18 1.18 0 016.24 12L6 11.13a1.19 1.19 0 01.29-1l.71-.7a1.19 1.19 0 01.84-.35h1.32A1.19 1.19 0 0110.35 10l.29.51a1.19 1.19 0 01-.26 1.44L9.07 13A5 5 0 018 13zm3.56-2.33a3.19 3.19 0 00.36-1.46A1.19 1.19 0 0111 8.44V8a1.18 1.18 0 011.24-1.18A5 5 0 0111.56 10.67z',
  premium: 'M8 0a8 8 0 108 8 8 8 0 00-8-8zm2.63 11.31L8 10l-2.63 1.31.5-2.93-2.12-2.07 2.93-.43L8 3.25l1.32 2.63 2.93.43-2.12 2.07.5 2.93z',
}

// Helper to create img-based icon for html2canvas compatibility
const createIcon = (path: string, color: string, viewBox: string, className: string) => {
  const encodedColor = color.replace('#', '%23')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="${encodedColor}" d="${path}"/></svg>`
  return (
    <img
      src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
      alt=""
      className={className}
    />
  )
}

// LinkedIn Reaction Icons
const LikeIcon = ({ filled = false, color = '#000000' }: { filled?: boolean; color?: string }) => {
  const iconColor = filled ? '#378FE9' : color
  return createIcon(filled ? LINKEDIN_ICONS.likeFilled : LINKEDIN_ICONS.likeOutline, iconColor, '0 0 24 24', 'w-4 h-4')
}

const CelebrateIcon = () => createIcon(LINKEDIN_ICONS.celebrate, '#44712E', '0 0 24 24', 'w-4 h-4')
const SupportIcon = () => createIcon(LINKEDIN_ICONS.support, '#715B8D', '0 0 24 24', 'w-4 h-4')
const LoveIcon = () => createIcon(LINKEDIN_ICONS.love, '#DF704D', '0 0 24 24', 'w-4 h-4')
const InsightfulIcon = () => createIcon(LINKEDIN_ICONS.insightful, '#F5BB5C', '0 0 24 24', 'w-4 h-4')
const FunnyIcon = () => createIcon(LINKEDIN_ICONS.funny, '#63A7D4', '0 0 24 24', 'w-4 h-4')

const CommentIcon = ({ color = '#000000' }: { color?: string }) => createIcon(LINKEDIN_ICONS.comment, color, '0 0 24 24', 'w-5 h-5')
const RepostIcon = ({ color = '#000000' }: { color?: string }) => createIcon(LINKEDIN_ICONS.repost, color, '0 0 24 24', 'w-5 h-5')
const SendIcon = ({ color = '#000000' }: { color?: string }) => createIcon(LINKEDIN_ICONS.send, color, '0 0 24 24', 'w-5 h-5')
const MoreIcon = ({ color = '#000000' }: { color?: string }) => createIcon(LINKEDIN_ICONS.more, color, '0 0 24 24', 'w-6 h-6')
const GlobeIcon = ({ color = '#000000' }: { color?: string }) => createIcon(LINKEDIN_ICONS.globe, color, '0 0 16 16', 'w-3 h-3')

// LinkedIn Premium Badge
const PremiumBadge = () => createIcon(LINKEDIN_ICONS.premium, '#C37D16', '0 0 16 16', 'w-4 h-4 ml-1')

export interface LinkedInPostProps {
  theme?: Theme
  author?: PostAuthor
  content?: string
  timestamp?: Date
  metrics?: PostMetrics
  images?: PostImage[]
  editable?: boolean
  onContentChange?: (content: string) => void
  onAuthorChange?: (author: Partial<PostAuthor>) => void
  onMetricsChange?: (metrics: Partial<PostMetrics>) => void
}

export const LinkedInPost = forwardRef<HTMLDivElement, LinkedInPostProps>(
  (props, ref) => {
    const [mounted, setMounted] = useState(false)
    const store = usePostStore()

    useEffect(() => {
      setMounted(true)
    }, [])

    // Default values
    const defaultTheme: Theme = 'light'
    const defaultContent = 'Excited to share some thoughts on professional growth and career development. What strategies have worked best for you? #Leadership #CareerGrowth'
    const defaultTimestamp = new Date()
    const defaultImages: PostImage[] = []
    const defaultAuthor: PostAuthor = {
      name: 'John Doe',
      handle: 'johndoe',
      avatar: '/avatars/default.png',
      verified: false,
      headline: 'Senior Software Engineer at Tech Company',
      connectionDegree: '1st',
    }
    const defaultMetrics: PostMetrics = {
      likes: 142,
      comments: 23,
      reposts: 47,
      reactions: {
        like: 89,
        celebrate: 23,
        support: 12,
        love: 8,
        insightful: 7,
        funny: 3,
      },
    }

    // Use props or store values
    const theme = props.theme ?? (mounted ? store.theme : defaultTheme)
    const author = props.author ?? (mounted ? { ...store.author, headline: store.author.headline || defaultAuthor.headline, connectionDegree: store.author.connectionDegree || defaultAuthor.connectionDegree } : defaultAuthor)
    const content = props.content ?? (mounted ? store.content : defaultContent)
    const timestamp = props.timestamp ?? (mounted ? store.timestamp : defaultTimestamp)
    const metrics = props.metrics ?? (mounted ? { ...store.metrics, reactions: store.metrics.reactions || defaultMetrics.reactions } : defaultMetrics)
    const images = props.images ?? (mounted ? store.images : defaultImages)
    const editable = props.editable ?? false
    const onContentChange = props.onContentChange
    const onAuthorChange = props.onAuthorChange
    const onMetricsChange = props.onMetricsChange

    const isDark = theme === 'dark'
    const bgColor = isDark ? '#1d2226' : '#ffffff'
    const textColor = isDark ? '#ffffff' : '#000000'
    const secondaryColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
    const tertiaryColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
    const actionColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'

    const totalReactions = metrics.reactions
      ? Object.values(metrics.reactions).reduce((a, b) => a + b, 0)
      : metrics.likes

    // Get top 3 reaction types for display
    const topReactions = metrics.reactions
      ? Object.entries(metrics.reactions)
          .filter(([, count]) => count > 0)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([type]) => type)
      : ['like']

    const reactionIcons: Record<string, React.ReactNode> = {
      like: <LikeIcon filled />,
      celebrate: <CelebrateIcon />,
      support: <SupportIcon />,
      love: <LoveIcon />,
      insightful: <InsightfulIcon />,
      funny: <FunnyIcon />,
    }

    return (
      <div
        ref={ref}
        className="font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] w-[552px]"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {/* Post Container */}
        <div className="p-3 pb-0">
          {/* Header */}
          <div className="flex items-start">
            {/* Avatar */}
            <div className="flex-shrink-0 mr-2">
              <img
                src={author.avatar || '/avatars/default.png'}
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230a66c2"/><text x="50" y="65" text-anchor="middle" fill="white" font-size="40">?</text></svg>'
                }}
              />
            </div>

            {/* Author Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span
                      className={cn(
                        'font-semibold text-sm leading-5 hover:underline cursor-pointer hover:text-[#0a66c2]',
                        editable && 'outline-dashed outline-2 outline-transparent hover:outline-blue-400/30 focus:outline-blue-400/60 rounded px-0.5'
                      )}
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onBlur={(e) => onAuthorChange?.({ name: e.currentTarget.textContent || '' })}
                      style={{ color: textColor }}
                    >
                      {author.name}
                    </span>
                    {author.verified && <PremiumBadge />}
                    <span className="ml-1 text-sm" style={{ color: secondaryColor }}>
                      • {author.connectionDegree || '1st'}
                    </span>
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: secondaryColor }}
                  >
                    {author.headline || 'Professional'}
                  </div>
                  <div className="flex items-center text-xs" style={{ color: secondaryColor }}>
                    <span>{formatDate(timestamp, 'linkedin')}</span>
                    <span className="mx-1">•</span>
                    <GlobeIcon color={secondaryColor} />
                  </div>
                </div>
                <button className="p-2 -m-2 rounded-full hover:bg-black/5 transition-colors" style={{ color: actionColor }}>
                  <MoreIcon color={actionColor} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn(
              'mt-3 text-sm leading-5 whitespace-pre-wrap break-words',
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
          <div className="mt-3">
            {images.length === 1 && (
              <img
                src={images[0].url}
                alt={images[0].alt || 'Post image'}
                className="w-full max-h-[350px] object-cover"
              />
            )}
            {images.length === 2 && (
              <div className="flex">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.alt || `Image ${i + 1}`}
                    className="w-1/2 h-[200px] object-cover"
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
                    className="h-[150px] object-cover"
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
          <div className="flex items-center justify-between text-xs" style={{ color: secondaryColor }}>
            <div className="flex items-center">
              {/* Reaction icons */}
              <div className="flex -space-x-1">
                {topReactions.map((type, i) => (
                  <div
                    key={type}
                    className="w-4 h-4 rounded-full flex items-center justify-center bg-white border border-white"
                    style={{ zIndex: 3 - i }}
                  >
                    {reactionIcons[type]}
                  </div>
                ))}
              </div>
              <span className="ml-1 hover:underline hover:text-[#0a66c2] cursor-pointer">
                {formatNumber(totalReactions)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="hover:underline hover:text-[#0a66c2] cursor-pointer">
                {formatNumber(metrics.comments)} comments
              </span>
              <span className="mx-1">•</span>
              <span className="hover:underline hover:text-[#0a66c2] cursor-pointer">
                {formatNumber(metrics.reposts)} reposts
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="px-2 py-1 flex items-center justify-between border-t"
          style={{ borderColor }}
        >
          <button
            className="flex-1 flex items-center justify-center py-3 rounded hover:bg-black/5 transition-colors"
            style={{ color: actionColor }}
          >
            <LikeIcon color={actionColor} />
            <span className="ml-1 text-sm font-semibold">Like</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center py-3 rounded hover:bg-black/5 transition-colors"
            style={{ color: actionColor }}
          >
            <CommentIcon color={actionColor} />
            <span className="ml-1 text-sm font-semibold">Comment</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center py-3 rounded hover:bg-black/5 transition-colors"
            style={{ color: actionColor }}
          >
            <RepostIcon color={actionColor} />
            <span className="ml-1 text-sm font-semibold">Repost</span>
          </button>
          <button
            className="flex-1 flex items-center justify-center py-3 rounded hover:bg-black/5 transition-colors"
            style={{ color: actionColor }}
          >
            <SendIcon color={actionColor} />
            <span className="ml-1 text-sm font-semibold">Send</span>
          </button>
        </div>
      </div>
    )
  }
)

LinkedInPost.displayName = 'LinkedInPost'

export default LinkedInPost
