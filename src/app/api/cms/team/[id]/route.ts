import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { teamMember } from '@/models/SchemaCMS';
import { eq } from 'drizzle-orm';
import { requireAdminAuth } from '@/utils/auth-server';

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
    const { name, position, bio, photoUrl, linkedinUrl, order, isActive } = body;

    if (!name || !position) {
      return NextResponse.json(
        { success: false, error: 'Name and position are required' },
        { status: 400 }
      );
    }

    const [updatedTeamMember] = await db
      .update(teamMember)
      .set({
        name,
        position,
        bio: bio || null,
        photoUrl: photoUrl || null,
        linkedinUrl: linkedinUrl || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(teamMember.id, id))
      .returning();

    if (!updatedTeamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTeamMember });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id, 10);

    const [deletedTeamMember] = await db
      .delete(teamMember)
      .where(eq(teamMember.id, id))
      .returning();

    if (!deletedTeamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedTeamMember });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
