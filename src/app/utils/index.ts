import {Task} from "../../../database/index";
import {Status} from "../AppContextProvider";

export const groupBy = <T, K>(
  array: T[],
  keySelector: (item: T) => K,
): Map<K, T[]> => {
  const map = new Map<K, T[]>();

  for (const item of array) {
    const key = keySelector(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
  }

  return map;
};

export const insertTaskAtIndex = (
  tasks: Task[],
  newTask: Task,
): {
  tasks: Task[];
  updatedItems?: {
    [id: number]: {
      index: Task["index"];
      status: Status;
    };
  };
} => {
  const index = newTask.index.split("_")[1];
  let insertIndex = parseInt(index);

  const updatedItems: {
    [id: number]: {
      index: Task["index"];
      status: Status;
    };
  } = {};

  tasks
    .sort((a, b) => +a.index.split("_")[1] - +b.index.split("_")[1])
    .splice(insertIndex, 0, newTask);

  for (let i = insertIndex; i < tasks.length; i++) {
    updatedItems[tasks[i].id] = {
      index: `${tasks[i].status}_${i}` as Task["index"],
      status: tasks[i].status,
    };
    tasks[i].index = `${tasks[i].status}_${i}`;
  }
  return {tasks, updatedItems};
};

export const deleteFromIndex = (
  tasks: Task[],
  indexToDelete: string,
): {tasks: Task[]; updateIds?: {[id: number]: string}} => {
  const taskIndexToDelete: number = parseInt(indexToDelete.split("_")[1]);

  if (isNaN(taskIndexToDelete)) {
    return {tasks};
  }

  const updateList = <{[id: number]: string}>{};
  tasks
    .sort((a, b) => +a.index.split("_")[1] - +b.index.split("_")[1])
    .splice(taskIndexToDelete, 1);

  for (let i = taskIndexToDelete; i < tasks.length; i++) {
    updateList[tasks[i].id] = `${tasks[i].status}_${i}`;
    tasks[i].index = `${tasks[i].status}_${i}`;
  }

  return {tasks, updateIds: updateList};
};
