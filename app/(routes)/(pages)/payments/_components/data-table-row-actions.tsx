import type { Row } from "@tanstack/react-table";
import { CircleAlertIcon, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { labels } from "../data/data";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { type Task } from "@prisma/client";
import { deleteTasks } from "@/actions/task";
import { db } from "@/lib/db";
import axios from "axios";

interface DataTableRowActionsProps {
  row: Row<Task>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const task = row.original;
  const [isDialogBoxOpen, setIsDialogBoxOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // const taskId = row.id;
      // const response = await axios.delete(`/api/task/${taskId}`);
      // if (response.status === 200) {
      //   toast.success("Task deleted successfully");
      // } else {
      //   toast.error("Failed to delete task");
      // }

      // await db.task.delete({
      //   where: {
      //     id: task.id,
      //   },
      // });

      // Simulate deletion with a timeout if no onDelete handler is provided
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // const taskId = task.id;
      // const res = db.task.delete({
      //   where:{
      //     id: taskId
      //   }
      // })

      const taskId = task.id;
      const res = await axios.delete(`/api/task/${taskId}`)
      console.log(res)
      toast.success("Task deleted successfully");
      console.log("Deleted task:", task.id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          console.error("Task not found");
        } else if (error.response.status === 500) {
          console.error("Server error");
        } else {
          console.error("Error deleting task:", error.message);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
      setIsDialogBoxOpen(false); // Close dialog after deletion completes (success or error)
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
          {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              Labels
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.label}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem
                    key={label.value}
                    value={label.value}
                    className="cursor-pointer"
                  >
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDialogBoxOpen(true)}
            className="cursor-pointer"
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={isDialogBoxOpen}>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlertIcon className="opacity-80" size={16} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              disabled={isDeleting}
              onClick={() => setIsDialogBoxOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 cursor-pointer hover:bg-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
