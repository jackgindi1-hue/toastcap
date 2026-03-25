import { NextRequest, NextResponse } from 'next/server';
import { createLeadsBulk } from '@/lib/leads-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds for large imports

interface ImportedLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  source?: string;
}

// POST /api/leads/import - Bulk import leads using Supabase
export async function POST(request: NextRequest) {
  try {
    const { leads } = await request.json() as { leads: ImportedLead[] };

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'No leads provided' }, { status: 400 });
    }

    console.log(`📥 Import: Bulk importing ${leads.length} leads via Supabase`);

    // Format all leads for bulk insert
    const formattedLeads = leads.map(lead => {
      // Format phone number
      let formattedPhone = lead.phone || '';
      if (formattedPhone) {
        const digits = formattedPhone.replace(/\D/g, '');
        if (digits.length === 10) {
          formattedPhone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length === 11 && digits.startsWith('1')) {
          formattedPhone = `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
        }
      }

      return {
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        email: lead.email || '',
        phone: formattedPhone,
        businessName: lead.businessName || '',
        businessType: lead.businessType || '',
        stage: 'quote' as const,
        status: 'new' as const,
        tags: [] as any[],
      };
    });

    // BULK INSERT - all leads in one database call!
    const result = await createLeadsBulk(formattedLeads);

    console.log(`📥 Import: Complete - ${result.created} leads imported`);

    return NextResponse.json({
      success: true,
      imported: result.created,
      skipped: 0,
      failed: result.errors.length,
      total: leads.length,
      errors: result.errors.slice(0, 50),
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import leads' },
      { status: 500 }
    );
  }
}
