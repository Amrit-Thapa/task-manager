let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export enum Status {
  inProgress = "in_progress",
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
      console.log({data});

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
      console.log("updating key");
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

// delete event
export const deleteData = (storeName: Store, key: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open(DBName.TaskManager);

    request.onsuccess = () => {
      db = request.result;

      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      res.onsuccess = () => {
        resolve(true);
      };

      res.onerror = () => {
        reject(false);
      };
    };
  });
};

export {};
