"use client";

import { useState } from "react";
import { DataTableFilterField } from "@/types";

import { Cross2Icon } from "@radix-ui/react-icons";
import { TrashIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { CalendarDatePicker } from "@/components/data-table/calendar-date-picker";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTableExportActions } from "@/components/data-table/data-table-export-actions";
import { CreateTaskDialog } from "./create-dialog-box";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = []
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
    table.getColumn("date")?.setFilterValue([from, to]);
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter labels..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("title")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { label: "To Do", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
              { label: "Cancelled", value: "CANCELLED" },
            ]}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={[
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ]}
          />
        )}
        {table.getColumn("label") && (
          <DataTableFacetedFilter
            column={table.getColumn("label")}
            title="Label"
            options={[
              { label: "Bug", value: "BUG" },
              { label: "Feature", value: "FEATURE" },
              { label: "Enhancement", value: "ENHANCEMENT" },
              { label: "Documentation", value: "DOCUMENTATION" },
            ]}
          />
        )}
        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="h-9 cursor-pointer"
          variant="outline"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 cursor-pointer"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" size="sm" className="cursor-pointer">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <CreateTaskDialog />
        <DataTableExportActions table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
