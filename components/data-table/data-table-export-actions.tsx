"use client";

import type React from "react";

import { useState } from "react";
import {
  DownloadIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Table } from "@tanstack/react-table";

import {
  exportTableToCSV,
  exportTableToPDF,
  exportTableToXLSX,
} from "@/lib/export";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableExportCommandProps<TData> {
  table: Table<TData>;
}

type ExportOption = {
  label: string;
  value: string;
  icon: React.ElementType;
  exportFn: (table: any, options: any) => void;
  defaultFilename: string;
};

export function DataTableExportActions<TData>({
  table,
}: DataTableExportCommandProps<TData>) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [selectedExport, setSelectedExport] = useState<ExportOption | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions: ExportOption[] = [
    {
      label: "PDF",
      value: "pdf",
      icon: FileIcon,
      exportFn: exportTableToPDF,
      defaultFilename: "task_data",
    },
    {
      label: "Excel (XLSX)",
      value: "xlsx",
      icon: FileSpreadsheetIcon,
      exportFn: exportTableToXLSX,
      defaultFilename: "task_data",
    },
    {
      label: "CSV",
      value: "csv",
      icon: FileTextIcon,
      exportFn: exportTableToCSV,
      defaultFilename: "task_data",
    },
  ];

  const handleExport = (option: ExportOption) => {
    setSelectedExport(option);
    setFilename(option.defaultFilename);
    setDialogOpen(true);
    setOpen(false);
  };

  const handleConfirmExport = async () => {
    if (selectedExport && filename) {
      try {
        setIsExporting(true);

        // Simulate a delay to show loading state (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        selectedExport.exportFn(table, {
          filename: filename,
          excludeColumns: ["select", "actions"],
        });

        toast.success(
          `File "${filename}.${selectedExport.value}" has been exported successfully.`
        );
        setDialogOpen(false);
      } catch (error) {
        toast.error("Failed to export file. Please try again.");
        console.error("Export error:", error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center cursor-pointer"
          >
            <DownloadIcon className="size-4 mr-1" aria-hidden="true" />
            Export
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end" alignOffset={8}>
          <Command>
            <CommandInput placeholder="Search export format..." />
            <CommandList>
              <CommandEmpty>No format found.</CommandEmpty>
              <CommandGroup heading="Export Options">
                {exportOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleExport(option)}
                    className="cursor-pointer"
                  >
                    <option.icon className="size-4 mr-2" aria-hidden="true" />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !isExporting && setDialogOpen(open)}
      >
        <DialogContent>
          <div className="mb-2 flex flex-col items-center gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              {selectedExport && (
                <selectedExport.icon
                  className="size-5 stroke-zinc-800 dark:stroke-zinc-100"
                  aria-hidden="true"
                />
              )}
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">
                Export as {selectedExport?.label}
              </DialogTitle>
              <DialogDescription className="sm:text-center">
                Enter a filename for your export
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirmExport();
            }}
          >
            <div className="*:not-first:mt-2">
              <div className="relative">
                <Input
                  id="export-filename"
                  className="peer ps-9"
                  placeholder="Enter filename"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  aria-label="Filename"
                  disabled={isExporting}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  {selectedExport && (
                    <selectedExport.icon size={16} aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isExporting || !filename.trim()}
            >
              {isExporting ? (
                <>
                  <LoaderCircleIcon
                    className="-ms-1 me-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Exporting...
                </>
              ) : (
                "Export"
              )}
            </Button>
          </form>

          <p className="text-muted-foreground text-center text-xs">
            The exported file will contain only visible columns and filtered
            data from the current table view.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
