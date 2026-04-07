import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getSettings,
  setActiveSendFromDomain,
  setActiveLandingDomain,
  addSendFromDomain,
  removeSendFromDomain,
  addLandingDomain,
  removeLandingDomain,
} from '@/lib/settings-db';

// Verify admin authentication
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  return !!sessionCookie?.value;
}

// GET - Get current settings
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, domain, type } = body;

    let result;

    switch (action) {
      case 'setActiveSendFrom':
        result = await setActiveSendFromDomain(domain);
        break;
      case 'setActiveLanding':
        result = await setActiveLandingDomain(domain);
        break;
      case 'addDomain':
        if (type === 'sendFrom') {
          result = await addSendFromDomain(domain);
        } else if (type === 'landing') {
          result = await addLandingDomain(domain);
        }
        break;
      case 'removeDomain':
        if (type === 'sendFrom') {
          result = await removeSendFromDomain(domain);
        } else if (type === 'landing') {
          result = await removeLandingDomain(domain);
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
