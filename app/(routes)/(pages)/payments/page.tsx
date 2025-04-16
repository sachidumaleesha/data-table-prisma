import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import TaskTable from "./_components/task-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export const metadata: Metadata = {
  title: "Task",
  description: "A Task tracker build using Tanstack Table.",
};

function getData() {
  // Return the promise directly, don't await it here
  return db.task.findMany();
}

export default function Page() {
  // Get the promise, but don't await it
  const dataPromise = getData();

  return (
    <div>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={4}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/* Pass the promise to the child component */}
          <TaskTable dataPromise={dataPromise} />
        </React.Suspense>
    </div>
  );
}
