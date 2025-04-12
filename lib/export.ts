import { type Table } from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string;
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | "select" | "actions")[];

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean;
  } = {}
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers (column names)
  const headers = table
    .getVisibleLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as keyof TData | "select" | "actions"));

  // Build CSV content
  const csvContent = [
    headers.join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header);
          // Handle values that might contain commas or newlines
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(",")
    ),
  ].join("\n");

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTableToXLSX<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {}
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers (column names)
  const headers = table
    .getVisibleLeafColumns()
    .map((column) => column.id)
    .filter(
      (id) =>
        !excludeColumns.includes(id as keyof TData | "select" | "actions")
    );

  // Retrieve rows
  const rows = (onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getRowModel().rows
  ).map((row) =>
    headers.map((header) => {
      const cellValue = row.getValue(header);
      return typeof cellValue === "string"
        ? cellValue
        : cellValue != null
        ? String(cellValue)
        : "";
    })
  );

  // Combine headers and rows
  const worksheetData = [headers, ...rows];

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write workbook and trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportTableToPDF<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {}
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers
  const headers = table
    .getVisibleLeafColumns()
    .map((column) => column.id)
    .filter(
      (id) =>
        !excludeColumns.includes(id as keyof TData | "select" | "actions")
    );

  // Retrieve rows
  const rows = (onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getRowModel().rows
  ).map((row) =>
    headers.map((header) => {
      const cellValue = row.getValue(header);
      return typeof cellValue === "string"
        ? cellValue
        : cellValue != null
        ? String(cellValue)
        : "";
    })
  );

  // Create PDF document
  const doc = new jsPDF();

  // Generate table in PDF
  autoTable(doc, {
    head: [headers],
    body: rows,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  // Save the PDF
  doc.save(`${filename}.pdf`);
}
