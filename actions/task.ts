import { db } from "@/lib/db";
import { type Task } from "@prisma/client";
import { generateRandomTask } from "./utils";

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
