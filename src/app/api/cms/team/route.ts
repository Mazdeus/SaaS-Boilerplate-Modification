import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { teamMember } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const allTeamMembers = await db.select().from(teamMember).orderBy(teamMember.order);
    return NextResponse.json({ success: true, data: allTeamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
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
    const { name, position, bio, photoUrl, linkedinUrl, order, isActive } = body;

    if (!name || !position) {
      return NextResponse.json(
        { success: false, error: 'Name and position are required' },
        { status: 400 }
      );
    }

    const [newTeamMember] = await db
      .insert(teamMember)
      .values({
        name,
        position,
        bio: bio || null,
        photoUrl: photoUrl || null,
        linkedinUrl: linkedinUrl || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: newTeamMember }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
