import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { siteSettings } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get sidebar settings from site_settings table
    const settings = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'sidebar_widgets'));

    const defaultSettings = {
      companyInfo: true,
      featuredProducts: true,
      valuesPhilosophy: true,
      storeLocator: true,
      teamLeadership: true,
    };

    let sidebarSettings = defaultSettings;
    if (settings.length > 0 && settings[0]?.value) {
      try {
        sidebarSettings = { ...defaultSettings, ...JSON.parse(settings[0].value) };
      } catch (error) {
        console.error('Failed to parse sidebar settings:', error);
      }
    }

    return NextResponse.json({ success: true, data: sidebarSettings });
  } catch (error) {
    console.error('Error fetching sidebar settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sidebar settings' },
      { status: 500 }
    );
  }
}
