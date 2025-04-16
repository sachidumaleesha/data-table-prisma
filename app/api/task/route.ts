import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  async function findMany() {
    try {
      const res = await db.task.findMany();
      return NextResponse.json(res);
    } catch (error) {
      console.log(error);
    }
  }
}

export async function DELETE(req: NextRequest) {
  console.log(req)
  const { taskID } = await req.json();
  console.log(taskID)

  try {
    const res = await db.task.delete({
      where: {
        id: taskID.toString(),
      },
    });
    revalidatePath('/payments')
    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
  }
}

export const deleteTask = async (taskId: string) => {
  await db.task.delete({
    where: {
      id: taskId,
    },
  });
};
