"use client";
"use memo";

import React from "react";
import { Columns } from "./columns";
import { DataTableFilterField } from "@/types";
import { Label, Priority, Status, type Task } from "@prisma/client";
import { getLabelIcon, getPriorityIcon, getStatusIcon } from "../_lib/utils";
import { DataTable } from "@/components/data-table/data-table";

interface TaskDataTableProps<TData> {
  data: TData[];
}

export default function TaskTable<TData extends Task>({
  data,
}: TaskDataTableProps<TData>) {
  const columns = React.useMemo(() => Columns, []);
  const filterFields: DataTableFilterField<Task>[] = [
    {
      label: "Title",
      value: "title",
      placeholder: "Filter titles...",
    },
    {
      label: "Status",
      value: "status",
      options: Object.values(Status).map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Priority",
      value: "priority",
      options: Object.values(Priority).map((priority) => ({
        label: priority[0]?.toUpperCase() + priority.slice(1),
        value: priority,
        icon: getPriorityIcon(priority),
        withCount: true,
      })),
    },
    {
      label: "Label",
      value: "label",
      options: Object.values(Label).map((label) => ({
        label: label[0]?.toUpperCase() + label.slice(1),
        value: label,
        icon: getLabelIcon(label),
        withCount: true,
      })),
    },
  ];
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
      <DataTable data={data} columns={columns} filterFields={filterFields} />
    </div>
  );
}
