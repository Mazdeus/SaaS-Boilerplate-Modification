import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { aboutSection } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const aboutData = await db.select().from(aboutSection);
    return NextResponse.json({ success: true, data: aboutData });
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, whoWeAre, whatWeDo, mission, vision, statsClients, statsProjects, statsYears, statsTeam } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const [newAbout] = await db
      .insert(aboutSection)
      .values({
        title,
        whoWeAre: whoWeAre || null,
        whatWeDo: whatWeDo || null,
        mission: mission || null,
        vision: vision || null,
        statsClients: statsClients || 0,
        statsProjects: statsProjects || 0,
        statsYears: statsYears || 0,
        statsTeam: statsTeam || 0,
      })
      .returning();

    return NextResponse.json({ success: true, data: newAbout }, { status: 201 });
  } catch (error) {
    console.error('Error creating about:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create about' },
      { status: 500 }
    );
  }
}
