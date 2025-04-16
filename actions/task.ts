import { db } from "@/lib/db";
import { type Task } from "@prisma/client";
import { generateRandomTask } from "./utils";
// import { revalidatePath } from "next/cache";

export async function seedTasks(input: { count: number }) {
  const count = input.count ?? 100;

  try {
    const allTasks: Task[] = [];

    for (let i = 0; i < count; i++) {
      allTasks.push(generateRandomTask());
    }

    await db.task.deleteMany({});
    console.log("🗑️ Deleted all tasks");

    console.log("📝 Inserting tasks", allTasks.length);

    // Insert tasks in batches of 1000
    await db.task.createMany({
      data: allTasks,
    });
  } catch (err) {
    console.error(err);
  }
}

export async function test(){
  return(
    console.log("test")
  )
}

interface DeleteTasksParams {
  ids: string[];
}

export async function deleteTasks({ ids }: DeleteTasksParams) {
  try {
    // Delete tasks with the provided IDs
    await db.task.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    // Revalidate the tasks page to reflect the changes
    // revalidatePath("/payments");

    return { success: true };
  } catch (error) {
    console.error("Error deleting tasks:", error);
    return { error: "Failed to delete tasks. Please try again." };
  }
}
