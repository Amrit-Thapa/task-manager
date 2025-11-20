export enum Status {
  inProgress = "inProgress",
  done = "done",
  created = "created",
  backlog = "backlog",
}

export type PrefixIndex = `${Status}${"_"}${number}`;

export type Task = {
  id?: number; // Optional because it will auto-increment
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low"; // Priority of the task
  dueDate: string; // ISO string format for the due date
  status: Status; // Status to track the task's current stage
  createdAt: string; // ISO string format for task creation date
  updatedAt?: string;
};
