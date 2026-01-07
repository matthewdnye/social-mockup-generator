import { NextResponse } from 'next/server'

interface LeadData {
  firstName: string
  lastName: string
  email: string
  capturedAt: string
}

const HIGHLEVEL_BASE_URL = 'https://services.leadconnectorhq.com'
const HIGHLEVEL_VERSION = '2021-07-28'

export async function POST(request: Request) {
  try {
    const data: LeadData = await request.json()

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get HighLevel credentials from environment
    const accessToken = process.env.HIGHLEVEL_API_KEY
    const locationId = process.env.HIGHLEVEL_LOCATION_ID

    if (!accessToken || !locationId) {
      console.error('HighLevel credentials not configured')
      // Still return success to client - we captured locally
      return NextResponse.json({ success: true, crm: false })
    }

    // Create contact in HighLevel V2 API
    const contactResponse = await fetch(`${HIGHLEVEL_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Version': HIGHLEVEL_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        locationId: locationId,
        source: 'Social Mockup Generator',
        tags: ['social-mockup-generator', 'lead-capture'],
      }),
    })

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json().catch(() => ({}))
      console.error('HighLevel API error:', {
        status: contactResponse.status,
        error: errorData,
      })

      // If it's a duplicate contact error (422), that's fine
      if (contactResponse.status === 422) {
        return NextResponse.json({ success: true, crm: true, existing: true })
      }

      return NextResponse.json(
        { success: true, crm: false, error: 'CRM submission failed' },
        { status: 200 }
      )
    }

    const contact = await contactResponse.json()
    console.log('Contact created in HighLevel:', contact.contact?.id)

    return NextResponse.json({
      success: true,
      crm: true,
      contactId: contact.contact?.id,
    })
  } catch (error) {
    console.error('Error processing lead capture:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
