import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { siteSettings } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

// Tambahkan export untuk mengatasi static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Check if the setting already exists
    const existingSetting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'sidebar_widgets'));

    const settingsValue = JSON.stringify(settings);

    if (existingSetting.length > 0) {
      // Update existing setting
      await db
        .update(siteSettings)
        .set({
          value: settingsValue,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, 'sidebar_widgets'));
    } else {
      // Create new setting
      await db.insert(siteSettings).values({
        key: 'sidebar_widgets',
        value: settingsValue,
        type: 'json',
        description: 'Controls visibility of sidebar widgets on public pages',
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error saving sidebar settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save sidebar settings' },
      { status: 500 }
    );
  }
}
