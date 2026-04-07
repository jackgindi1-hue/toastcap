import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createToken,
  getToken,
  getTokenForLead,
  validateAndConsumeClick,
  validateTokenForPage,
  progressTokenStatus,
} from '@/lib/tokens-db';

// Verify admin authentication
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  return !!sessionCookie?.value;
}

// GET - Get token info or validate
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const leadId = searchParams.get('leadId');
  const page = searchParams.get('page') as 'quote' | 'upload' | 'dlvc' | 'thank-you' | null;
  const consumeClick = searchParams.get('consumeClick') === 'true';

  // Validate token for page (public endpoint for page validation)
  if (token && page) {
    if (page === 'quote' && consumeClick) {
      const result = await validateAndConsumeClick(token);
      return NextResponse.json(result);
    }
    const result = await validateTokenForPage(token, page);
    return NextResponse.json(result);
  }

  // Get token by token string (public)
  if (token) {
    const tokenData = await getToken(token);
    if (!tokenData) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    return NextResponse.json(tokenData);
  }

  // Get token for lead (admin only)
  if (leadId) {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const tokenData = await getTokenForLead(leadId);
    return NextResponse.json(tokenData || { error: 'No token found for lead' });
  }

  return NextResponse.json({ error: 'Missing token or leadId parameter' }, { status: 400 });
}

// POST - Create new token for a lead
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, maxClicks = 3 } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
    }

    const token = await createToken(leadId, maxClicks);

    if (!token) {
      return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
    }

    return NextResponse.json(token);
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}

// PUT - Progress token status (called after form submission)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, page } = body;

    if (!token || !page) {
      return NextResponse.json({ error: 'Missing token or page' }, { status: 400 });
    }

    if (!['quote', 'upload', 'dlvc'].includes(page)) {
      return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
    }

    const updatedToken = await progressTokenStatus(token, page);

    if (!updatedToken) {
      return NextResponse.json({ error: 'Failed to progress token' }, { status: 500 });
    }

    return NextResponse.json(updatedToken);
  } catch (error) {
    console.error('Error progressing token:', error);
    return NextResponse.json({ error: 'Failed to progress token' }, { status: 500 });
  }
}
