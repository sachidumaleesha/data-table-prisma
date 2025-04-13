"use client";

import React, { useState } from "react";
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
  filterFields = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("createdAt")?.setFilterValue([from, to]);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left side filters */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 w-full">
        {searchableColumns.map(
          (column) =>
            table.getColumn(column.value ? String(column.value) : "") && (
              <Input
                key={String(column.value)}
                placeholder={column.placeholder}
                value={
                  (table
                    .getColumn(String(column.value))
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(String(column.value))
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-full md:w-64 col-span-2"
              />
            )
        )}

        {filterableColumns.map(
          (column) =>
            table.getColumn(column.value ? String(column.value) : "") && (
              <DataTableFacetedFilter
                key={String(column.value)}
                column={table.getColumn(
                  column.value ? String(column.value) : ""
                )}
                title={column.label}
                options={column.options ?? []}
              />
            )
        )}

        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="h-9 cursor-pointer hidden md:flex"
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

      {/* Right side controls */}
      <div className="grid grid-cols-2 md:flex gap-2 items-center w-full md:w-auto justify-end">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button variant="outline" size="sm" className="order-4 md:order-1">
            <TrashIcon className="mr-1 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
        <CreateTaskDialog />
        <DataTableExportActions table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
