import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { expenseSchema } from "./data/schema";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "Expenses",
  description: "A Expense tracker build using Tanstack Table.",
};

async function getData() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/(routes)/(pages)/payments/data/data.json")
  );

  const tasks = JSON.parse(data.toString());

  return z.array(expenseSchema).parse(tasks);
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
