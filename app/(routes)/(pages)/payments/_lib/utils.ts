import { type Task, Label, Priority, Status } from "@prisma/client";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { Bug } from "lucide-react";

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Status) {
  const statusIcons = {
    TODO: CrossCircledIcon,
    IN_PROGRESS: CheckCircledIcon,
    DONE: StopwatchIcon,
    CANCELLED: QuestionMarkCircledIcon,
  };

  return statusIcons[status] || CircleIcon;
}

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
export function getPriorityIcon(priority: Priority) {
  const priorityIcons = {
    HIGH: ArrowUpIcon,
    LOW: ArrowDownIcon,
    MEDIUM: ArrowRightIcon,
  };

  return priorityIcons[priority] || CircleIcon;
}

export function getLabelIcon(label: Label) {
  const labelIcons = {
    BUG: Bug,
    FEATURE: Bug,
    ENHANCEMENT: Bug,
    DOCUMENTATION: Bug,
  };

  return labelIcons[label] || CircleIcon;
}
