export interface ExportOptions {
  scale?: number // 1 = 1x, 2 = 2x (retina)
  backgroundColor?: string
  filename?: string
}

export async function exportToImage(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob | null> {
  // Dynamically import html2canvas only on client
  const html2canvas = (await import('html2canvas')).default

  const { scale = 2, backgroundColor = '#ffffff' } = options

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
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

export async function downloadImage(blob: Blob, filename: string = 'social-mockup.png'): Promise<void> {
  // Dynamically import file-saver only on client
  const { saveAs } = await import('file-saver')
  saveAs(blob, filename)
}

export async function exportAndDownload(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const { filename = 'social-mockup.png' } = options

  const blob = await exportToImage(element, options)
  if (blob) {
    const { saveAs } = await import('file-saver')
    saveAs(blob, filename)
  }
}

export function generateFilename(platform: string, authorHandle: string): string {
  const timestamp = new Date().toISOString().split('T')[0]
  return `${platform}-${authorHandle}-${timestamp}.png`
}
