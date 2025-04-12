import { Metadata } from "next";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Task",
  description: "A Task tracker build using Tanstack Table.",
};

async function getData() {
  const taskData = await db.task.findMany()
  return taskData
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your expenses for this month!
          </p>
        </div>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
