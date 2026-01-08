import type { SerializedMockupState } from '@/lib/mockup-serializer'
import type { Theme, PostAuthor, PostMetrics, PostImage } from '@/lib/types'

// Utility functions (duplicated from utils.ts to avoid client dependencies)
function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) {
    return '0'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

function formatDate(date: Date, platform: string): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (platform === 'twitter') {
    if (diffHours < 24) {
      return `${diffHours}h · ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (platform === 'linkedin' || platform === 'facebook') {
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (platform === 'instagram' || platform === 'threads') {
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return date.toLocaleDateString()
}

// Base CSS styles
const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  img {
    display: block;
    max-width: 100%;
  }
  .flex { display: flex; }
  .flex-1 { flex: 1 1 0%; }
  .flex-col { flex-direction: column; }
  .flex-wrap { flex-wrap: wrap; }
  .flex-shrink-0 { flex-shrink: 0; }
  .items-start { align-items: flex-start; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .justify-center { justify-content: center; }
  .min-w-0 { min-width: 0; }
  .overflow-hidden { overflow: hidden; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .whitespace-pre-wrap { white-space: pre-wrap; }
  .break-words { word-wrap: break-word; overflow-wrap: break-word; }
  .rounded-full { border-radius: 9999px; }
  .rounded-2xl { border-radius: 1rem; }
  .object-cover { object-fit: cover; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .inline-block { display: inline-block; }
  .align-middle { vertical-align: middle; }
  .border-t { border-top-width: 1px; border-top-style: solid; }
  .border { border-width: 1px; border-style: solid; }
`

// Generate verified badge SVG
function getVerifiedBadgeSVG(type: 'blue' | 'gold' | 'gray' = 'blue'): string {
  const colors = { blue: '#1d9bf0', gold: '#e6a500', gray: '#829aab' }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" style="width:18px;height:18px;margin-left:4px;display:inline-block;vertical-align:middle;"><path fill="${colors[type]}" d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>`
}

// Generate icon SVG
function getIconSVG(path: string, color: string, size: string = '20px'): string {
  const encodedColor = color.replace('#', '%23')
  return `<img src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${color}" d="${path}"/></svg>`)}" alt="" style="width:${size};height:${size};" />`
}

// Twitter/X Post HTML
function generateTwitterHTML(mockup: SerializedMockupState): string {
  const timestamp = new Date(mockup.timestamp)
  const isDark = mockup.theme === 'dark' || mockup.theme === 'dim'
  const isDim = mockup.theme === 'dim'

  const bgColor = isDark ? (isDim ? '#15202b' : '#000000') : '#ffffff'
  const textColor = isDark ? '#e7e9ea' : '#0f1419'
  const secondaryColor = isDark ? '#71767b' : '#536471'
  const borderColor = isDark ? '#2f3336' : '#eff3f4'

  const ICON_PATHS = {
    comment: 'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z',
    retweet: 'M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z',
    like: 'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z',
    views: 'M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z',
    bookmark: 'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z',
    share: 'M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z',
    more: 'M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z',
  }

  // Stats row
  let statsHTML = ''
  if (mockup.metrics.reposts > 0 || (mockup.metrics.quotes ?? 0) > 0 || mockup.metrics.likes > 0 || (mockup.metrics.bookmarks ?? 0) > 0) {
    statsHTML = `
      <div style="margin-top:12px;padding:12px 0;display:flex;align-items:center;font-size:15px;border-top:1px solid ${borderColor};">
        ${mockup.metrics.reposts > 0 ? `<div style="display:flex;align-items:center;margin-right:20px;"><span style="font-weight:700;margin-right:4px;color:${textColor}">${formatNumber(mockup.metrics.reposts)}</span><span style="color:${secondaryColor}">Reposts</span></div>` : ''}
        ${mockup.metrics.quotes && mockup.metrics.quotes > 0 ? `<div style="display:flex;align-items:center;margin-right:20px;"><span style="font-weight:700;margin-right:4px;color:${textColor}">${formatNumber(mockup.metrics.quotes)}</span><span style="color:${secondaryColor}">Quotes</span></div>` : ''}
        ${mockup.metrics.likes > 0 ? `<div style="display:flex;align-items:center;margin-right:20px;"><span style="font-weight:700;margin-right:4px;color:${textColor}">${formatNumber(mockup.metrics.likes)}</span><span style="color:${secondaryColor}">Likes</span></div>` : ''}
        ${mockup.metrics.bookmarks && mockup.metrics.bookmarks > 0 ? `<div style="display:flex;align-items:center;"><span style="font-weight:700;margin-right:4px;color:${textColor}">${formatNumber(mockup.metrics.bookmarks)}</span><span style="color:${secondaryColor}">Bookmarks</span></div>` : ''}
      </div>
    `
  }

  // Images
  let imagesHTML = ''
  if (mockup.images.length > 0) {
    if (mockup.images.length === 1) {
      imagesHTML = `<div style="margin-top:12px;border-radius:16px;overflow:hidden;border:1px solid ${borderColor}"><img src="${mockup.images[0].url}" style="width:100%;max-height:510px;object-fit:cover;" /></div>`
    } else if (mockup.images.length === 2) {
      imagesHTML = `<div style="margin-top:12px;border-radius:16px;overflow:hidden;border:1px solid ${borderColor};display:flex;">${mockup.images.map((img, i) => `<img src="${img.url}" style="width:50%;height:286px;object-fit:cover;${i > 0 ? 'margin-left:2px;' : ''}" />`).join('')}</div>`
    }
  }

  return `
    <div id="mockup-container" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;width:598px;background-color:${bgColor};color:${textColor};">
      <div style="padding:12px 16px;">
        <!-- Header -->
        <div style="display:flex;align-items:flex-start;">
          <div style="flex-shrink:0;margin-right:12px;">
            <img src="${mockup.author.avatar || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%231d9bf0%22/><text x=%2250%22 y=%2265%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2240%22>?</text></svg>'}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />
          </div>
          <div style="flex:1;min-width:0;">
            <!-- Name row -->
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;flex-wrap:wrap;">
                <span style="font-weight:700;font-size:15px;line-height:20px;color:${textColor}">${mockup.author.name}</span>
                ${mockup.author.verified ? getVerifiedBadgeSVG(mockup.author.verifiedType || 'blue') : ''}
                <span style="font-size:15px;line-height:20px;margin-left:4px;color:${secondaryColor}">@${mockup.author.handle}</span>
                <span style="margin:0 4px;color:${secondaryColor}">·</span>
                <span style="font-size:15px;color:${secondaryColor}">${formatDate(timestamp, 'twitter').split('·')[1]?.trim() || 'Jun 1'}</span>
              </div>
              <div style="padding:8px;">${getIconSVG(ICON_PATHS.more, secondaryColor)}</div>
            </div>
            <!-- Content -->
            <div style="margin-top:4px;font-size:15px;line-height:20px;white-space:pre-wrap;word-wrap:break-word;color:${textColor}">${mockup.content}</div>
            ${imagesHTML}
            <!-- Timestamp + Client -->
            <div style="margin-top:12px;display:flex;align-items:center;font-size:15px;color:${secondaryColor}">
              <span>${formatDate(timestamp, 'twitter').split('·')[0]?.trim()}</span>
              <span style="margin:0 4px;">·</span>
              <span>${mockup.client || 'Twitter for iPhone'}</span>
            </div>
            ${statsHTML}
            <!-- Actions -->
            <div style="margin-top:4px;padding:4px 0;display:flex;align-items:center;justify-content:space-between;max-width:425px;border-top:1px solid ${borderColor};color:${secondaryColor}">
              <div style="padding:8px;">${getIconSVG(ICON_PATHS.comment, secondaryColor)}</div>
              <div style="padding:8px;">${getIconSVG(ICON_PATHS.retweet, secondaryColor)}</div>
              <div style="padding:8px;">${getIconSVG(ICON_PATHS.like, secondaryColor)}</div>
              <div style="padding:8px;">${getIconSVG(ICON_PATHS.views, secondaryColor)}</div>
              <div style="display:flex;align-items:center;">
                <div style="padding:8px;">${getIconSVG(ICON_PATHS.bookmark, secondaryColor)}</div>
                <div style="padding:8px;">${getIconSVG(ICON_PATHS.share, secondaryColor)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// LinkedIn Post HTML
function generateLinkedInHTML(mockup: SerializedMockupState): string {
  const timestamp = new Date(mockup.timestamp)
  const isDark = mockup.theme === 'dark'

  const bgColor = isDark ? '#1d2226' : '#ffffff'
  const textColor = isDark ? '#ffffff' : '#000000'
  const secondaryColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  const totalReactions = mockup.metrics.reactions
    ? Object.values(mockup.metrics.reactions).reduce((a, b) => a + b, 0)
    : mockup.metrics.likes

  // Globe icon for public
  const globeSVG = `<img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="' + secondaryColor + '" d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 01.22-1.47l.28.27a1 1 0 00.71.29h.8A1.19 1.19 0 016 8.24l.11.85a1.19 1.19 0 01-1.19 1.35H4a5.05 5.05 0 01-1-2.44zm5 5a5.34 5.34 0 01-.57 0A1.18 1.18 0 016.24 12L6 11.13a1.19 1.19 0 01.29-1l.71-.7a1.19 1.19 0 01.84-.35h1.32A1.19 1.19 0 0110.35 10l.29.51a1.19 1.19 0 01-.26 1.44L9.07 13A5 5 0 018 13zm3.56-2.33a3.19 3.19 0 00.36-1.46A1.19 1.19 0 0111 8.44V8a1.18 1.18 0 011.24-1.18A5 5 0 0111.56 10.67z"/></svg>')}" style="width:12px;height:12px;" />`

  // Reaction icons
  const likeReactionSVG = `<img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23378FE9" d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76 2.11 2.11 0 00-.92 1.74 2.14 2.14 0 001 1.8 2.12 2.12 0 00-.74 1.61A2.12 2.12 0 004.38 20h6.88a7 7 0 003.26-.8l1.77-.9a3.32 3.32 0 001.59-1.91l1.75-4.47a2.18 2.18 0 00-.17-2.02z"/></svg>')}" style="width:16px;height:16px;" />`

  // Images
  let imagesHTML = ''
  if (mockup.images.length > 0) {
    if (mockup.images.length === 1) {
      imagesHTML = `<div style="margin-top:12px;"><img src="${mockup.images[0].url}" style="width:100%;max-height:350px;object-fit:cover;" /></div>`
    }
  }

  return `
    <div id="mockup-container" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;width:552px;background-color:${bgColor};color:${textColor};">
      <div style="padding:12px 12px 0;">
        <!-- Header -->
        <div style="display:flex;align-items:flex-start;">
          <div style="flex-shrink:0;margin-right:8px;">
            <img src="${mockup.author.avatar || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%230a66c2%22/><text x=%2250%22 y=%2265%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2240%22>?</text></svg>'}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;">
              <span style="font-weight:600;font-size:14px;line-height:20px;color:${textColor}">${mockup.author.name}</span>
              <span style="margin-left:4px;font-size:14px;color:${secondaryColor}">• ${mockup.author.connectionDegree || '1st'}</span>
            </div>
            <div style="font-size:12px;color:${secondaryColor};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${mockup.author.headline || 'Professional'}</div>
            <div style="display:flex;align-items:center;font-size:12px;color:${secondaryColor}">
              <span>${formatDate(timestamp, 'linkedin')}</span>
              <span style="margin:0 4px;">•</span>
              ${globeSVG}
            </div>
          </div>
        </div>
        <!-- Content -->
        <div style="margin-top:12px;font-size:14px;line-height:20px;white-space:pre-wrap;word-wrap:break-word;color:${textColor}">${mockup.content}</div>
      </div>
      ${imagesHTML}
      <!-- Reactions Bar -->
      <div style="padding:8px 12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;color:${secondaryColor}">
          <div style="display:flex;align-items:center;">
            <div style="display:flex;margin-right:4px;">${likeReactionSVG}</div>
            <span>${formatNumber(totalReactions)}</span>
          </div>
          <div style="display:flex;align-items:center;">
            <span>${formatNumber(mockup.metrics.comments)} comments</span>
            <span style="margin:0 4px;">•</span>
            <span>${formatNumber(mockup.metrics.reposts)} reposts</span>
          </div>
        </div>
      </div>
      <!-- Actions -->
      <div style="padding:4px 8px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid ${borderColor}">
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;color:${secondaryColor}">
          <span style="font-size:14px;font-weight:600;">Like</span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;color:${secondaryColor}">
          <span style="font-size:14px;font-weight:600;">Comment</span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;color:${secondaryColor}">
          <span style="font-size:14px;font-weight:600;">Repost</span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;color:${secondaryColor}">
          <span style="font-size:14px;font-weight:600;">Send</span>
        </div>
      </div>
    </div>
  `
}

// Facebook Post HTML
function generateFacebookHTML(mockup: SerializedMockupState): string {
  const timestamp = new Date(mockup.timestamp)
  const isDark = mockup.theme === 'dark'

  const bgColor = isDark ? '#242526' : '#ffffff'
  const textColor = isDark ? '#e4e6eb' : '#050505'
  const secondaryColor = isDark ? '#b0b3b8' : '#65676b'
  const borderColor = isDark ? '#3e4042' : '#dddfe2'

  const privacyIcon = mockup.privacy === 'public' ? '🌐' : mockup.privacy === 'friends' ? '👥' : '🔒'

  // Images
  let imagesHTML = ''
  if (mockup.images.length > 0) {
    if (mockup.images.length === 1) {
      imagesHTML = `<div style="margin-top:12px;"><img src="${mockup.images[0].url}" style="width:100%;max-height:400px;object-fit:cover;" /></div>`
    }
  }

  return `
    <div id="mockup-container" style="font-family:'Segoe UI Historic','Segoe UI',Helvetica,Arial,sans-serif;width:500px;background-color:${bgColor};color:${textColor};">
      <div style="padding:12px 16px 0;">
        <!-- Header -->
        <div style="display:flex;align-items:flex-start;">
          <div style="flex-shrink:0;margin-right:8px;">
            <img src="${mockup.author.avatar || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%231877f2%22/><text x=%2250%22 y=%2265%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2240%22>?</text></svg>'}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:15px;color:${textColor}">${mockup.author.name}</div>
            <div style="display:flex;align-items:center;font-size:13px;color:${secondaryColor}">
              <span>${formatDate(timestamp, 'facebook')}</span>
              <span style="margin:0 4px;">·</span>
              <span>${privacyIcon}</span>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div style="margin-top:12px;font-size:15px;line-height:20px;white-space:pre-wrap;word-wrap:break-word;color:${textColor}">${mockup.content}</div>
      </div>
      ${imagesHTML}
      <!-- Reactions Bar -->
      <div style="padding:12px 16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;font-size:15px;color:${secondaryColor}">
          <div style="display:flex;align-items:center;">
            <span>👍</span>
            <span style="margin-left:4px;">${formatNumber(mockup.metrics.likes)}</span>
          </div>
          <div>
            <span>${formatNumber(mockup.metrics.comments)} comments</span>
            <span style="margin:0 8px;">·</span>
            <span>${formatNumber(mockup.metrics.reposts)} shares</span>
          </div>
        </div>
      </div>
      <!-- Actions -->
      <div style="margin:0 16px;padding:4px 0;display:flex;align-items:center;justify-content:space-around;border-top:1px solid ${borderColor};border-bottom:1px solid ${borderColor}">
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;color:${secondaryColor}">
          <span style="font-size:15px;font-weight:600;">👍 Like</span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;color:${secondaryColor}">
          <span style="font-size:15px;font-weight:600;">💬 Comment</span>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;color:${secondaryColor}">
          <span style="font-size:15px;font-weight:600;">↗️ Share</span>
        </div>
      </div>
    </div>
  `
}

// Instagram Post HTML
function generateInstagramHTML(mockup: SerializedMockupState): string {
  const timestamp = new Date(mockup.timestamp)
  const isDark = mockup.theme === 'dark'

  const bgColor = isDark ? '#000000' : '#ffffff'
  const textColor = isDark ? '#fafafa' : '#262626'
  const secondaryColor = isDark ? '#a8a8a8' : '#8e8e8e'
  const borderColor = isDark ? '#262626' : '#dbdbdb'

  // Images
  let imagesHTML = ''
  if (mockup.images.length > 0) {
    imagesHTML = `<div><img src="${mockup.images[0].url}" style="width:100%;aspect-ratio:1;object-fit:cover;" /></div>`
  } else {
    imagesHTML = `<div style="width:100%;aspect-ratio:1;background-color:${isDark ? '#262626' : '#fafafa'};display:flex;align-items:center;justify-content:center;color:${secondaryColor}">No image</div>`
  }

  return `
    <div id="mockup-container" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;width:468px;background-color:${bgColor};color:${textColor};">
      <!-- Header -->
      <div style="padding:14px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${borderColor}">
        <div style="display:flex;align-items:center;">
          <img src="${mockup.author.avatar || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23e1306c%22/><text x=%2250%22 y=%2265%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2240%22>?</text></svg>'}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;margin-right:12px;" />
          <span style="font-weight:600;font-size:14px;color:${textColor}">${mockup.author.handle}</span>
          ${mockup.author.verified ? '<span style="margin-left:4px;color:#3897f0;">✓</span>' : ''}
        </div>
        <span style="font-size:16px;color:${textColor}">•••</span>
      </div>
      ${imagesHTML}
      <!-- Actions -->
      <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:16px;">
          <span style="font-size:24px;">♡</span>
          <span style="font-size:24px;">💬</span>
          <span style="font-size:24px;">↗️</span>
        </div>
        <span style="font-size:24px;">🔖</span>
      </div>
      <!-- Likes -->
      <div style="padding:0 16px 8px;">
        <span style="font-weight:600;font-size:14px;color:${textColor}">${formatNumber(mockup.metrics.likes)} likes</span>
      </div>
      <!-- Caption -->
      <div style="padding:0 16px 8px;">
        <span style="font-weight:600;font-size:14px;color:${textColor}">${mockup.author.handle}</span>
        <span style="font-size:14px;color:${textColor};margin-left:4px;">${mockup.content}</span>
      </div>
      <!-- Comments link -->
      <div style="padding:0 16px 8px;">
        <span style="font-size:14px;color:${secondaryColor}">View all ${formatNumber(mockup.metrics.comments)} comments</span>
      </div>
      <!-- Timestamp -->
      <div style="padding:0 16px 16px;">
        <span style="font-size:10px;color:${secondaryColor};text-transform:uppercase;">${formatDate(timestamp, 'instagram')}</span>
      </div>
    </div>
  `
}

// Threads Post HTML
function generateThreadsHTML(mockup: SerializedMockupState): string {
  const timestamp = new Date(mockup.timestamp)
  const isDark = mockup.theme === 'dark'

  const bgColor = isDark ? '#101010' : '#ffffff'
  const textColor = isDark ? '#f3f5f7' : '#000000'
  const secondaryColor = isDark ? '#777777' : '#999999'
  const borderColor = isDark ? '#3d3d3d' : '#e0e0e0'

  // Images
  let imagesHTML = ''
  if (mockup.images.length > 0) {
    imagesHTML = `<div style="margin-top:12px;border-radius:8px;overflow:hidden;"><img src="${mockup.images[0].url}" style="width:100%;max-height:400px;object-fit:cover;" /></div>`
  }

  return `
    <div id="mockup-container" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;width:598px;background-color:${bgColor};color:${textColor};">
      <div style="padding:16px;">
        <!-- Header -->
        <div style="display:flex;align-items:flex-start;">
          <div style="flex-shrink:0;margin-right:12px;">
            <img src="${mockup.author.avatar || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23000000%22/><text x=%2250%22 y=%2265%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2240%22>?</text></svg>'}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" />
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;">
                <span style="font-weight:600;font-size:15px;color:${textColor}">${mockup.author.handle}</span>
                ${mockup.author.verified ? '<span style="margin-left:4px;color:#0095f6;">✓</span>' : ''}
              </div>
              <div style="display:flex;align-items:center;">
                <span style="font-size:15px;color:${secondaryColor}">${formatDate(timestamp, 'threads')}</span>
                <span style="margin-left:12px;font-size:16px;color:${secondaryColor}">•••</span>
              </div>
            </div>
            <!-- Content -->
            <div style="margin-top:4px;font-size:15px;line-height:21px;white-space:pre-wrap;word-wrap:break-word;color:${textColor}">${mockup.content}</div>
            ${imagesHTML}
            <!-- Actions -->
            <div style="margin-top:12px;display:flex;align-items:center;gap:16px;color:${secondaryColor}">
              <span style="font-size:20px;">♡</span>
              <span style="font-size:20px;">💬</span>
              <span style="font-size:20px;">🔄</span>
              <span style="font-size:20px;">↗️</span>
            </div>
            <!-- Stats -->
            <div style="margin-top:8px;display:flex;align-items:center;font-size:15px;color:${secondaryColor}">
              <span>${formatNumber(mockup.metrics.comments)} replies</span>
              <span style="margin:0 4px;">·</span>
              <span>${formatNumber(mockup.metrics.likes)} likes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Main HTML generator function
export function generateMockupHTML(mockup: SerializedMockupState): string {
  let mockupHTML: string

  switch (mockup.platform) {
    case 'twitter':
      mockupHTML = generateTwitterHTML(mockup)
      break
    case 'linkedin':
      mockupHTML = generateLinkedInHTML(mockup)
      break
    case 'facebook':
      mockupHTML = generateFacebookHTML(mockup)
      break
    case 'instagram':
      mockupHTML = generateInstagramHTML(mockup)
      break
    case 'threads':
      mockupHTML = generateThreadsHTML(mockup)
      break
    default:
      mockupHTML = generateTwitterHTML(mockup)
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body style="margin:0;padding:0;background:transparent;">
      ${mockupHTML}
    </body>
    </html>
  `
}
