import { Metadata } from "next";
import { db } from "@/lib/db";
import TaskTable from "./_components/task-table";

export const metadata: Metadata = {
  title: "Task",
  description: "A Task tracker build using Tanstack Table.",
};
async function getData() {
  const taskData = await db.task.findMany();
  return taskData;
}
export default async function Page() {
  const data = await getData();

  return (
    <div>
      <TaskTable data={data} />
    </div>
  );
}
