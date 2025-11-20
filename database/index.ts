import {PrefixIndex, Status, Task} from "@/app/utils/types";

let version = 1;

export enum Store {
  Tasks = "tasks",
}
export enum DBName {
  TaskManager = "taskManager",
}

type UpdateItem = {
  [key in Task["id"]]: {
    status: Status;
    index: PrefixIndex;
  };
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName.TaskManager);

    request.onerror = () => reject("Something went wrong while initiating DB!");

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;

      if (!db.objectStoreNames.contains(Store.Tasks)) {
        const store = db.createObjectStore("tasks", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("priority", "priority", {unique: false});
        store.createIndex("status", "status", {unique: false});
        store.createIndex("dueDate", "dueDate", {unique: false});
        store.createIndex("createdAt", "createdAt", {unique: false});
        console.log("Database schema set up successfully");
      }
    };
  });
};

// create event
export const addData = async (storeName: Store, data: Task): Promise<void> => {
  const db = await initDB();

  const transaction = db.transaction("tasks", "readwrite");

  const store = transaction.objectStore("tasks");

  const request = store.add(data);

  request.onsuccess = () => {
    console.log("Task added successfully");
  };

  request.onerror = (event) => {
    console.error("Error adding task:", event);
  };
};

//  update event
export const updateData = async (
  id: number,
  newStatus: Status,
): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore("tasks");

  const request = store.get(id);

  request.onsuccess = () => {
    const task = request.result as Task;
    task.status = newStatus; // Update the status to the new stage
    task.updatedAt = new Date().toISOString(); // Set the update timestamp

    const updateRequest = store.put(task);

    updateRequest.onsuccess = () => {
      console.log(`Task with ID ${id} status updated to ${newStatus}`);
    };

    updateRequest.onerror = (event) => {
      console.error("Error updating task status:", event);
    };
  };

  request.onerror = (event) => {
    console.error("Error fetching task to update:", event);
  };
};

// export const updateTasks = (
//   storeName: Store,
//   items: UpdateItem,
// ): Promise<string | null> => {
//   return new Promise((resolve) => {
//     request = indexedDB.open(DBName.TaskManager);
//     request.onsuccess = () => {
//       db = request.result;
//       const tx = db.transaction(storeName, "readwrite");
//       const store = tx.objectStore(storeName);
//       const keys = Object.keys(items);
//       let itemsUpdated = 0;

//       keys.forEach((key) => {
//         const getRecord = store.get(+key);

//         getRecord.onerror = (event: Event) => {
//           console.log(
//             "Error getting keys:",
//             (event.target as IDBRequest).result,
//           );
//         };

//         getRecord.onsuccess = () => {
//           const newData = {
//             ...getRecord.result,
//             ...items[+key as keyof UpdateItem],
//           };
//           const updateRequest = store.put(newData);

//           updateRequest.onerror = function (event) {
//             console.error(
//               `Error updating item with key ${key}: ${
//                 (event.target as IDBRequest).error
//               }`,
//             );
//             tx.abort();
//           };

//           updateRequest.onsuccess = function () {
//             itemsUpdated++;
//             if (itemsUpdated === keys.length) {
//               resolve("success");
//             }
//           };
//         };
//       });
//     };
//   });
// };

// read event
export const getAllStoreData = async (): Promise<Task[]> => {
  const db = await initDB();
  const transaction = db.transaction("tasks", "readonly");
  const store = transaction.objectStore("tasks");

  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error("Error getting all tasks:", event);
      reject(new Error("Failed to get tasks."));
    };
  });
};

// delete event and rearrange events
// export const deleteData = (
//   storeName: Store,
//   data: {id: number; updateItems?: {[id: number]: string}},
// ): Promise<boolean> => {
//   console.log(data);
//   return new Promise((resolve, reject) => {
//     request = indexedDB.open(DBName.TaskManager);

//     request.onsuccess = () => {
//       db = request.result;
//       const tx = db.transaction(storeName, "readwrite");
//       const store = tx.objectStore(storeName);

//       let updatePromises = [];

//       updatePromises.push(
//         new Promise((res, rej) => {
//           const req = store.delete(data.id);
//           req.onsuccess = () => {
//             res(true);
//           };

//           req.onerror = () => {
//             rej(false);
//           };
//         }),
//       );

//       if (data.updateItems) {
//         updatePromises = Object.keys(data.updateItems).map((key) => {
//           return new Promise((resolve, reject) => {
//             const getReq = store.get(+key);
//             getReq.onsuccess = () => {
//               const itemToUpdate = getReq.result;
//               if (itemToUpdate) {
//                 const putReq = store.put({
//                   ...itemToUpdate,
//                   index: data.updateItems![+key],
//                 });

//                 putReq.onsuccess = () => {
//                   resolve(true);
//                 };

//                 putReq.onerror = () => {
//                   reject(putReq.error);
//                 };
//               } else {
//                 reject(new Error("Item not found."));
//               }
//             };
//           });
//         });
//       }

//       Promise.all(updatePromises)
//         .then(() => {
//           tx.oncomplete = () => {
//             db.close();
//             console.log("Update operations completed.");
//             resolve(true);
//           };
//         })
//         .catch((error) => {
//           tx.abort();
//           db.close();
//           console.error("Error updating records:", error);
//           reject(error);
//         });
//     };
//   });
// };

const deleteTask = async (id: number): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore("tasks");

  const request = store.delete(id);

  request.onsuccess = () => {
    console.log(`Task with ID ${id} deleted successfully`);
  };

  request.onerror = (event) => {
    console.error("Error deleting task:", event);
  };
};

const getTasksByStatus = async (
  status: "Started" | "In Progress" | "Completed" | "Archived",
): Promise<Task[]> => {
  const db = await initDB();
  const transaction = db.transaction("tasks", "readonly");
  const store = transaction.objectStore("tasks");
  const index = store.index("status");

  const request = index.getAll(status);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error("Error getting tasks by status:", event);
      reject(new Error("Failed to get tasks by status."));
    };
  });
};

export {};
