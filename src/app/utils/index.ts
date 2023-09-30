import {Task} from "../../../database/index";

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
): {tasks: Task[]; updatedItem?: {[id: number]: string}[]} => {
  let insertIndex: number = parseInt(newTask.index.split("_")[1]);

  const updateList = <{[id: number]: string}[]>[];

  tasks.splice(insertIndex, 0, newTask);

  for (let i = insertIndex; i < tasks.length; i++) {
    updateList.push({
      [tasks[i].id]: `${tasks[i].status}_${i}`,
    });
    tasks[i].index = `${tasks[i].status}_${i}`;
  }
  return {tasks, updatedItem: updateList};
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
  tasks.splice(taskIndexToDelete, 1);

  for (let i = taskIndexToDelete; i < tasks.length; i++) {
    updateList[tasks[i].id] = `${tasks[i].status}_${i}`;
    tasks[i].index = `${tasks[i].status}_${i}`;
  }

  return {tasks, updateIds: updateList};
};
