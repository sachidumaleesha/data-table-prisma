"use client";
import { DownloadIcon } from "lucide-react";
import { type Table } from "@tanstack/react-table";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";

// import { CreateTaskDialog } from "./create-task-dialog";
// import { DeleteTasksDialog } from "./delete-tasks-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableExportActions<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center gap-2">
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        // @ts-expect-error - bcoz we are also Drawer Component for Mobile view
        // and on Drawer Component its mandatory to pass open & openChange prop
        <DeleteTasksDialog
          tasks={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null} */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
        className="cursor-pointer"
      >
        <DownloadIcon className="size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
