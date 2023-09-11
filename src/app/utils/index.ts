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

export const insertTaskAtIndex = (tasks: Task[], newTask: Task): Task[] => {
  const insertIndex: number = parseInt(newTask.index.split("_")[1]);
  tasks.splice(insertIndex, 0, newTask);

  for (let i = insertIndex; i < tasks.length; i++) {
    tasks[i].index = `${tasks[i].status}_${i}`;
  }
  return tasks;
};
