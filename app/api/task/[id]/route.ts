import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskID = id;

  try {
    const res = await db.task.delete({
      where: {
        id: taskID.toString(),
      },
    });

    // Revalidate the path after deleting the task
    await revalidatePath('/payments');

    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
  }
}