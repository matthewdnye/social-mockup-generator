import { NextRequest, NextResponse } from 'next/server'
import type { ScreenshotRequest } from '@/lib/mockup-serializer'
import { generateMockupHTML } from './html-generator'

// Vercel serverless function config
export const runtime = 'nodejs'
export const maxDuration = 30

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

    // Dynamic import for serverless compatibility
    // Use playwright-aws-lambda for Vercel/AWS Lambda environments
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME

    if (isServerless) {
      const playwrightAws = await import('playwright-aws-lambda')
      browser = await playwrightAws.launchChromium({ headless: true })
    } else {
      const { chromium } = await import('playwright-core')
      browser = await chromium.launch({ headless: true })
    }

    const page = await browser.newPage({
      deviceScaleFactor: scale,
    })

    // Load the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle',
    })

    // Wait for fonts to load
    await page.waitForTimeout(500)

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

    // Return the PNG image - convert Buffer to Uint8Array for NextResponse
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
      await browser.close()
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Screenshot failed'
      },
      { status: 500 }
    )
  }
}
