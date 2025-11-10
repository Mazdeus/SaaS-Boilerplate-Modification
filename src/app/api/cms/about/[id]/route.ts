import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { aboutSection } from '@/models/SchemaCMS';
import { eq } from 'drizzle-orm';
import { requireAdminAuth } from '@/utils/auth-server';

// Force dynamic rendering for CMS API routes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id, 10);
    const body = await request.json();
    const { title, whoWeAre, whatWeDo, mission, vision, statsClients, statsProjects, statsYears, statsTeam } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const [updatedAbout] = await db
      .update(aboutSection)
      .set({
        title,
        whoWeAre: whoWeAre || null,
        whatWeDo: whatWeDo || null,
        mission: mission || null,
        vision: vision || null,
        statsClients: statsClients || 0,
        statsProjects: statsProjects || 0,
        statsYears: statsYears || 0,
        statsTeam: statsTeam || 0,
        updatedAt: new Date(),
      })
      .where(eq(aboutSection.id, id))
      .returning();

    if (!updatedAbout) {
      return NextResponse.json(
        { success: false, error: 'About section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedAbout });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update about section' },
      { status: 500 }
    );
  }
}
