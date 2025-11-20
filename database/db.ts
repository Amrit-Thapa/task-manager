import Dexie from "dexie";

// Define the types for a Task
interface Task {
  id?: number; // Optional because it will auto-increment
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low"; // Priority can be one of these three
  dueDate: string; // ISO string format for the due date
  completed: boolean; // Whether the task is completed or not
  createdAt: string; // ISO string format for task creation date
}

// Create a new Dexie database
class TaskManagerDB extends Dexie {
  tasks: Dexie.Table<Task, number>; // Define the tasks store with auto-incrementing id

  constructor() {
    super("taskManagerDB");
    this.version(1).stores({
      tasks:
        "++id, title, description, priority, dueDate, completed, createdAt", // Define schema
    });

    this.tasks = this.table("tasks");
  }
}

// Initialize the database
const db = new TaskManagerDB();

// Function to add a new task
export const addTask = async (task: Task): Promise<void> => {
  try {
    await db.tasks.add(task);
    console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Function to get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    return await db.tasks.toArray();
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return [];
  }
};

// Function to get tasks by priority
export const getTasksByPriority = async (
  priority: "High" | "Medium" | "Low",
): Promise<Task[]> => {
  try {
    return await db.tasks.where("priority").equals(priority).toArray();
  } catch (error) {
    console.error("Error retrieving tasks by priority:", error);
    return [];
  }
};

// Function to get tasks by completion status
export const getTasksByCompletionStatus = async (
  completedStatus: boolean,
): Promise<Task[]> => {
  try {
    return await db.tasks.where("completed").equals(completedStatus).toArray();
  } catch (error) {
    console.error("Error retrieving tasks by completion status:", error);
    return [];
  }
};

// Function to update the completion status of a task
export const updateTaskStatus = async (
  id: number,
  newStatus: boolean,
): Promise<void> => {
  try {
    await db.tasks.update(id, {completed: newStatus});
    console.log(`Task with ID ${id} updated successfully`);
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

// Function to delete a task by ID
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await db.tasks.delete(id);
    console.log(`Task with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Example of a task object
const exampleTask: Task = {
  title: "Complete TypeScript Project",
  description: "Work on the task manager app using TypeScript and IndexedDB.",
  priority: "High",
  dueDate: new Date().toISOString(),
  completed: false,
  createdAt: new Date().toISOString(),
};

// Usage example:
addTask(exampleTask); // Add a new task
getAllTasks().then((tasks) => console.log(tasks)); // Get all tasks
getTasksByPriority("High").then((tasks) => console.log(tasks)); // Get tasks with high priority
updateTaskStatus(1, true); // Mark task with ID 1 as completed
deleteTask(1); // Delete task with ID 1
