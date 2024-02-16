import {Status, Task} from "./types";

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
  index: number,
): {
  tasks: Task[];
  updatedItems?: {
    [id: number]: {
      index: Task["index"];
      status: Status;
    };
  };
} => {
  const status = tasks[0].status;
  const updatedItems: {
    [id: number]: {
      index: Task["index"];
      status: Status;
    };
  } = {};
  if (tasks.length < index) {
    return {
      tasks: tasks.splice(index, 0, {
        ...newTask,
        index: `${status}_${index}`,
        status: status,
      }),
      updatedItems,
    };
  }
  tasks.splice(index, 0, newTask);

  for (let i = index; i < tasks.length; i++) {
    tasks[i] = {
      ...tasks[i],
      index: `${status}_${i}`,
      status: status,
    };

    updatedItems[tasks[i].id] = {
      index: `${tasks[i].status}_${i}`,
      status: tasks[i].status,
    };
  }
  return {tasks, updatedItems};
};

export const deleteFromIndex = (
  tasks: Task[],
  indexToDelete: number,
): {tasks: Task[]; updateIds?: {[id: number]: string}} => {
  const updateList = <{[id: number]: string}>{};
  tasks.splice(indexToDelete, 1);
  for (let i = indexToDelete; i < tasks.length; i++) {
    tasks[i].index = `${tasks[i].status}_${i}`;
    updateList[tasks[i].id] = `${tasks[i].status}_${i}`;
  }

  return {tasks, updateIds: updateList};
};

export const sortItems = (data: Task[]) => {
  return data.sort((a, b) => +a.index.split("_")[1] - +b.index.split("_")[1]);
};
