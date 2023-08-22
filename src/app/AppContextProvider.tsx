"use client";
import React, {createContext, useState, useContext} from "react";

export enum TaskType {
  "in-progress",
  "done",
  "created",
  "backlog",
}

export type Task = {
  title: string;
  id: string;
  description: string;
  time?: number;
  status: TaskType;
};
export type Project = {
  id: string;
  title: string;
  description: string;
  createdTask: Task[];
  inProgressTask: Task[];
  backlogTask: Task[];
  doneTask: Task[];
};

type appContext = {
  selectedTask: Task;
  createdTask: Task[];
  inProgressTask: Task[];
  backlogTask: Task[];
  doneTask: Task[];

  setCreatedTask: React.Dispatch<React.SetStateAction<Task[]>>;
  setInProgressTask: React.Dispatch<React.SetStateAction<Task[]>>;
  setBacklogTask: React.Dispatch<React.SetStateAction<Task[]>>;
  setDoneTask: React.Dispatch<React.SetStateAction<Task[]>>;
};

export const AppContext = createContext<appContext>({} as appContext);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
  const [createdTask, setCreatedTask] = useState<Task[]>([]);
  const [inProgressTask, setInProgressTask] = useState<Task[]>([]);
  const [backlogTask, setBacklogTask] = useState<Task[]>([]);
  const [doneTask, setDoneTask] = useState<Task[]>([]);

  return (
    <AppContext.Provider
      value={{
        createdTask,
        inProgressTask,
        backlogTask,
        doneTask,

        setCreatedTask,
        setInProgressTask,
        setBacklogTask,
        setDoneTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
