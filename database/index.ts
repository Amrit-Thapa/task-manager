let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export enum Status {
  inProgress = "in-progress",
  done = "done",
  created = "created",
  backlog = "backlog",
}

export type PrefixIndex = `${Status}${"_"}${number}`;

export type Task = {
  title: string;
  id: number;
  index: PrefixIndex;
  description: string;
  status: Status;
};

export enum Store {
  Tasks = "tasks",
}
export enum DBName {
  TaskManager = "taskManager",
}
export const initDB = (): Promise<boolean | IDBDatabase> => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open(DBName.TaskManager);

    request.onupgradeneeded = () => {
      db = request.result;

      if (!db.objectStoreNames.contains(Store.Tasks)) {
        console.log("Creating tasks store");
        db.createObjectStore(Store.Tasks, {keyPath: "id"});
      }
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve(request.result);
    };

    request.onerror = () => reject("Something went wrong while initiating DB!");
  });
};

// create event
export const addTask = <T>(
  storeName: Store,
  data: T,
): Promise<T | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName.TaskManager, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("unknown error");
      }
    };
  });
};

//  update event
export const updateData = <T>(
  storeName: Store,
  key: string,
  data: T,
): Promise<T | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName.TaskManager);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.get(key);

      res.onsuccess = () => {
        const newData = {...res.result, ...data};
        store.put(newData);
        resolve(newData);
      };
      res.onerror = () => {
        resolve(null);
      };
    };
  });
};

export const updateTasks = <T>(
  storeName: Store,
  items: T,
): Promise<string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName.TaskManager);
    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const keys = Object.keys(items);
      let itemsUpdated = 0;

      keys.forEach((key) => {
        const getRecord = store.get(+key);

        getRecord.onerror = (event: Event) => {
          console.log("Error getting keys:", event.target.error);
        };

        getRecord.onsuccess = (event) => {
          const newData = {...getRecord.result, ...items[key]};
          const updateRequest = store.put(newData);

          updateRequest.onerror = function (event) {
            console.error(
              `Error updating item with key ${key}: ${
                (event.target as IDBRequest).error
              }`,
            );
            tx.abort();
          };

          updateRequest.onsuccess = function () {
            itemsUpdated++;
            if (itemsUpdated === keys.length) {
              resolve("success");
            }
          };
        };
      });
    };
  });
};

// read event
export const getAllStoreData = <T>(storeName: Store): Promise<T[]> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName.TaskManager);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};

// delete event and rearrange events
export const deleteData = (
  storeName: Store,
  data: {id: number; updateItems?: {[id: number]: string}},
): Promise<boolean> => {
  console.log(data);
  return new Promise((resolve, reject) => {
    request = indexedDB.open(DBName.TaskManager);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

      let updatePromises = [];

      updatePromises.push(
        new Promise((res, rej) => {
          const req = store.delete(data.id);
          req.onsuccess = () => {
            res(true);
          };

          req.onerror = () => {
            rej(false);
          };
        }),
      );

      if (data.updateItems) {
        updatePromises = Object.keys(data.updateItems).map((key) => {
          return new Promise((resolve, reject) => {
            const getReq = store.get(+key);
            getReq.onsuccess = () => {
              const itemToUpdate = getReq.result;
              if (itemToUpdate) {
                const putReq = store.put({
                  ...itemToUpdate,
                  index: data.updateItems![+key],
                });

                putReq.onsuccess = () => {
                  resolve(true);
                };

                putReq.onerror = () => {
                  reject(putReq.error);
                };
              } else {
                reject(new Error("Item not found."));
              }
            };
          });
        });
      }

      Promise.all(updatePromises)
        .then(() => {
          tx.oncomplete = () => {
            db.close();
            console.log("Update operations completed.");
            resolve(true);
          };
        })
        .catch((error) => {
          tx.abort();
          db.close();
          console.error("Error updating records:", error);
          reject(error);
        });
    };
  });
};

export {};
