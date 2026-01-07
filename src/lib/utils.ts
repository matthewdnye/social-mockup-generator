import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

export function formatDate(date: Date, format: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'threads' = 'twitter'): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const month = months[date.getMonth()]
  const fullMonth = fullMonths[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12

  switch (format) {
    case 'twitter':
      return `${hour12}:${minutes} ${ampm} · ${month} ${day}, ${year}`
    case 'linkedin':
      return `${day}h`
    case 'facebook':
      return `${fullMonth} ${day} at ${hour12}:${minutes} ${ampm}`
    case 'instagram':
      return `${day} ${month.toUpperCase()}`
    case 'threads':
      return `${day}h`
    default:
      return `${month} ${day}, ${year}`
  }
}

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`

  return formatDate(date)
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Encode a color value for use in SVG data URIs
 * Replaces # with %23 for URL compatibility
 */
export function encodeColorForSvg(color: string | null | undefined, fallback = '#000000'): string {
  return (color || fallback).replaceAll('#', '%23')
}
