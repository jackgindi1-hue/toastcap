import { NextResponse } from 'next/server';
import { supabase, CREATE_LEADS_TABLE_SQL } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/setup-supabase - Create the leads table
export async function GET() {
  try {
    // Execute the SQL to create the table
    const { error } = await supabase.rpc('exec_sql', {
      sql: CREATE_LEADS_TABLE_SQL,
    });

    if (error) {
      // If the RPC doesn't exist, we need to create the table manually
      // Let's try a direct approach - just check if we can query the table
      const { error: queryError } = await supabase.from('leads').select('id').limit(1);

      if (queryError && queryError.code === '42P01') {
        // Table doesn't exist - user needs to create it manually
        return NextResponse.json({
          success: false,
          message: 'Please create the leads table manually in Supabase SQL Editor',
          sql: CREATE_LEADS_TABLE_SQL,
        });
      } else if (queryError) {
        return NextResponse.json({
          success: false,
          error: queryError.message,
        }, { status: 500 });
      }

      // Table exists
      return NextResponse.json({
        success: true,
        message: 'Leads table already exists',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Leads table created successfully',
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      sql: CREATE_LEADS_TABLE_SQL,
    }, { status: 500 });
  }
}
