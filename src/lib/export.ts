import type { SerializedMockupState, ScreenshotRequest } from './mockup-serializer'

export interface ExportOptions {
  scale?: number // 1 = 1x, 2 = 2x (retina)
  backgroundColor?: string
  filename?: string
}

export interface PlaywrightExportOptions {
  scale?: 1 | 2 | 3
  filename?: string
}

/**
 * Wait for all images within an element to fully load
 * Includes timeout protection to prevent infinite hanging on slow/broken images
 */
async function waitForImages(element: HTMLElement, timeoutMs = 5000): Promise<void> {
  const images = element.querySelectorAll('img')

  const imageLoadPromises = Array.from(images).map((img) => {
    // If image is already complete and loaded successfully, resolve immediately
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve()
    }

    // Otherwise, wait for load or error
    return new Promise<void>((resolve) => {
      const handleLoad = () => {
        img.removeEventListener('load', handleLoad)
        img.removeEventListener('error', handleError)
        resolve()
      }
      const handleError = () => {
        img.removeEventListener('load', handleLoad)
        img.removeEventListener('error', handleError)
        resolve() // Continue even if image fails
      }
      img.addEventListener('load', handleLoad)
      img.addEventListener('error', handleError)
    })
  })

  // Race between all images loading and a timeout
  // Clear timeout when images complete to prevent timer accumulation
  let timeoutId: ReturnType<typeof setTimeout>
  const timeoutPromise = new Promise<void>((resolve) => {
    timeoutId = setTimeout(resolve, timeoutMs)
  })

  await Promise.race([
    Promise.all(imageLoadPromises).then(() => clearTimeout(timeoutId)),
    timeoutPromise,
  ])

  // Ensure cleanup regardless of which promise won
  clearTimeout(timeoutId!)
}

export async function exportToImage(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob | null> {
  // Dynamically import html2canvas only on client
  const html2canvas = (await import('html2canvas')).default

  const { scale = 2 } = options

  // Wait for all images to load before capturing
  await waitForImages(element)

  const canvas = await html2canvas(element, {
    scale,
    // Don't override backgroundColor - let the wrapper's actual bg show through
    // This ensures WYSIWYG: what you see is what you get
    useCORS: true,
    allowTaint: true,
    logging: false,
    // Remove any dashed borders from editable elements
    onclone: (clonedDoc) => {
      const editables = clonedDoc.querySelectorAll('[contenteditable]')
      editables.forEach((el) => {
        (el as HTMLElement).style.outline = 'none'
      })
      // Remove any hover/focus styles
      const allElements = clonedDoc.querySelectorAll('*')
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        if (htmlEl.style.outlineStyle === 'dashed') {
          htmlEl.style.outline = 'none'
        }
      })
    },
  })

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/png',
      1.0
    )
  })
}

export function downloadImage(blob: Blob, filename: string = 'social-mockup.png'): void {
  // Use native browser API for downloading
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportAndDownload(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const { filename = 'social-mockup.png' } = options

  const blob = await exportToImage(element, options)
  if (blob) {
    downloadImage(blob, filename)
  }
}

export function generateFilename(platform: string, authorHandle: string): string {
  const timestamp = new Date().toISOString().split('T')[0]
  return `${platform}-${authorHandle}-${timestamp}.png`
}

/**
 * Export mockup using Playwright server-side screenshot API
 * This provides true WYSIWYG rendering using a real browser engine
 */
export async function exportViaPlaywright(
  mockup: SerializedMockupState,
  options: PlaywrightExportOptions = {}
): Promise<Blob | null> {
  const { scale = 2 } = options

  try {
    const requestBody: ScreenshotRequest = {
      mockup,
      scale,
    }

    const response = await fetch('/api/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Screenshot failed: ${response.status}`)
    }

    return await response.blob()
  } catch (error) {
    console.error('Playwright export failed:', error)
    return null
  }
}

/**
 * Export and download using Playwright API
 */
export async function exportAndDownloadViaPlaywright(
  mockup: SerializedMockupState,
  options: PlaywrightExportOptions = {}
): Promise<void> {
  const { filename = 'social-mockup.png' } = options

  const blob = await exportViaPlaywright(mockup, options)
  if (blob) {
    downloadImage(blob, filename)
  }
}
