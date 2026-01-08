import { NextRequest, NextResponse } from 'next/server'
import type { ScreenshotRequest } from '@/lib/mockup-serializer'
import { generateMockupHTML } from './html-generator'

// Vercel serverless function config
export const runtime = 'nodejs'
export const maxDuration = 60

// Chromium release URL for @sparticuz/chromium-min
const CHROMIUM_REMOTE_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar'

export async function POST(request: NextRequest) {
  let browser = null

  try {
    const body: ScreenshotRequest = await request.json()
    const { mockup, scale = 2 } = body

    if (!mockup || !mockup.platform) {
      return NextResponse.json(
        { success: false, error: 'Missing mockup data' },
        { status: 400 }
      )
    }

    // Generate complete HTML for the mockup
    const html = generateMockupHTML(mockup)

    // Import puppeteer-core
    const puppeteer = await import('puppeteer-core')

    // In serverless (Vercel), use @sparticuz/chromium-min with remote executable
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME

    if (isServerless) {
      const chromium = await import('@sparticuz/chromium-min')
      const executablePath = await chromium.default.executablePath(CHROMIUM_REMOTE_URL)

      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        executablePath,
        headless: true,
      })
    } else {
      // Local development - use system Chrome
      // Try common Chrome paths
      const possiblePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      ]

      let execPath = ''
      for (const p of possiblePaths) {
        try {
          const fs = await import('fs')
          if (fs.existsSync(p)) {
            execPath = p
            break
          }
        } catch {
          // ignore
        }
      }

      if (!execPath) {
        throw new Error('Chrome executable not found for local development')
      }

      browser = await puppeteer.default.launch({
        executablePath: execPath,
        headless: true,
      })
    }

    const page = await browser.newPage()
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: scale,
    })

    // Load the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready)
    await new Promise((r) => setTimeout(r, 300))

    // Get the mockup element
    const element = await page.$('#mockup-container')

    if (!element) {
      throw new Error('Mockup container not found')
    }

    // Take screenshot of just the mockup element
    const screenshot = await element.screenshot({
      type: 'png',
      omitBackground: false,
    })

    await browser.close()
    browser = null

    // Return the PNG image - cast to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(screenshot), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${mockup.platform}-mockup.png"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Screenshot error:', error)

    if (browser) {
      try {
        await browser.close()
      } catch {
        // ignore cleanup errors
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Screenshot failed',
      },
      { status: 500 }
    )
  }
}
