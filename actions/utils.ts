import { type Task, Status, Label, Priority } from "@prisma/client";
import { faker } from "@faker-js/faker";
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
import { customAlphabet } from "nanoid";
import { generateId } from "@/lib/id";

export function generateRandomTask(): Task {
  return {
    id: generateId(),
    taskCode: `TASK-${customAlphabet("0123456789", 4)()}`,
    title: faker.hacker
      .phrase()
      .replace(/^./, (letter) => letter.toUpperCase()),
    status: faker.helpers.arrayElement(Object.values(Status)),
    label: faker.helpers.arrayElement(Object.values(Label)),
    priority: faker.helpers.arrayElement(Object.values(Priority)),
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
// export function getStatusIcon(status: Task["status"]) {
//   const statusIcons = {
//     canceled: CrossCircledIcon,
//     done: CheckCircledIcon,
//     "in-progress": StopwatchIcon,
//     todo: QuestionMarkCircledIcon,
//   }

//   return statusIcons[status] || CircleIcon
// }

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
// export function getPriorityIcon(priority: Task["priority"]) {
//   const priorityIcons = {
//     high: ArrowUpIcon,
//     low: ArrowDownIcon,
//     medium: ArrowRightIcon,
//   }

//   return priorityIcons[priority] || CircleIcon
// }
