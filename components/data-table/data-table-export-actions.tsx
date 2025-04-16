"use client";

import type React from "react";

import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DownloadIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the form schema with Zod
const exportFormSchema = z.object({
  filename: z.string().min(1, "Filename is required").max(100),
});

type ExportFormValues = z.infer<typeof exportFormSchema>;

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
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // Separate state variables for different UI components
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desktopDialogOpen, setDesktopDialogOpen] = useState(false);
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);

  const [selectedExport, setSelectedExport] = useState<ExportOption | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: {
      filename: "",
    },
  });

  const exportOptions: ExportOption[] = [
    {
      label: "PDF",
      value: "pdf",
      icon: FileIcon,
      exportFn: exportTableToPDF,
      defaultFilename: "data",
    },
    {
      label: "Excel (XLSX)",
      value: "xlsx",
      icon: FileSpreadsheetIcon,
      exportFn: exportTableToXLSX,
      defaultFilename: "data",
    },
    {
      label: "CSV",
      value: "csv",
      icon: FileTextIcon,
      exportFn: exportTableToCSV,
      defaultFilename: "data",
    },
  ];

  const handleDesktopExport = (option: ExportOption) => {
    setSelectedExport(option);
    form.setValue("filename", option.defaultFilename);
    setDesktopDialogOpen(true);
    setPopoverOpen(false);
  };

  const handleMobileExport = (option: ExportOption) => {
    setSelectedExport(option);
    form.setValue("filename", option.defaultFilename);
    setMobileDialogOpen(true);
    // Keep the first drawer open - removed setDrawerOpen(false)
  };

  const handleConfirmExport = async (values: ExportFormValues) => {
    if (selectedExport) {
      try {
        setIsExporting(true);

        // Simulate a delay to show loading state (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        selectedExport.exportFn(table, {
          filename: values.filename,
          excludeColumns: ["select", "actions"],
        });

        toast.success(
          `File "${values.filename}.${selectedExport.value}" has been exported successfully.`
        );

        // Close both drawers after successful export
        if (isDesktop) {
          setDesktopDialogOpen(false);
        } else {
          setMobileDialogOpen(false);
          setDrawerOpen(false);
        }
      } catch (error) {
        toast.error("Failed to export file. Please try again.");
        console.error("Export error:", error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  const ExportForm = () => (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(handleConfirmExport)}
      >
        <FormField
          control={form.control}
          name="filename"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <div className="flex rounded-md shadow-xs">
                  <FormControl>
                    <div className="relative flex w-full">
                      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                        {selectedExport && (
                          <selectedExport.icon
                            size={16}
                            className="text-muted-foreground/80"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <Input
                        {...field}
                        className="peer ps-9 rounded-e-none"
                        placeholder="Enter filename"
                        aria-label="Filename"
                        disabled={isExporting}
                      />
                      <span className="border-input bg-background text-muted-foreground inline-flex items-center rounded-e-md border border-l-0 px-3 text-sm">
                        {selectedExport ? `.${selectedExport.value}` : ""}
                      </span>
                    </div>
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isExporting}
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
    </Form>
  );

  // Desktop view with Popover and Dialog
  if (isDesktop) {
    return (
      <>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                      onSelect={() => handleDesktopExport(option)}
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

        {/* Desktop Dialog */}
        <Dialog
          open={desktopDialogOpen}
          onOpenChange={(open) => !isExporting && setDesktopDialogOpen(open)}
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

            <ExportForm />

            <p className="text-muted-foreground text-center text-xs">
              The exported file will contain only visible columns and filtered
              data from the current table view.
            </p>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Mobile view with two Drawers
  return (
    <>
      {/* First Drawer - Export Options */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center cursor-pointer"
          >
            <DownloadIcon className="size-4 mr-1" aria-hidden="true" />
            Export
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Export Table Data</DrawerTitle>
            <DrawerDescription>
              Choose a format to export your table data
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2">
            <div className="space-y-2">
              {exportOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                  onClick={() => handleMobileExport(option)}
                >
                  <option.icon className="size-4 mr-2" aria-hidden="true" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Second Drawer - Filename Input */}
      <Drawer
        open={mobileDialogOpen}
        onOpenChange={(open) => !isExporting && setMobileDialogOpen(open)}
      >
        <DrawerContent>
          <DrawerHeader className="text-center">
            <div className="flex items-center justify-center">
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
            </div>
            <div>
              <DrawerTitle>Export as {selectedExport?.label}</DrawerTitle>
              <DrawerDescription>
                Enter a filename for your export
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="px-4">
            <ExportForm />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setMobileDialogOpen(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
            </DrawerClose>
            <p className="text-muted-foreground text-center text-xs mt-4">
              The exported file will contain only visible columns and filtered
              data from the current table view.
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
