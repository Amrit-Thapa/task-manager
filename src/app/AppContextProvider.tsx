"use client";
import React, {createContext, useState, useContext} from "react";

export enum TaskType {
  "inProgress" = "in-progress",
  done = "done",
  created = "created",
  backlog = "backlog",
}

export type Task = {
  title: string;
  id: number;
  index: number;
  description: string;
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

type SelectedTask = {
  sourceUpdater: React.Dispatch<React.SetStateAction<Task[]>>;
  task: Task;
};

type appContext = {
  selectedTask: SelectedTask | undefined;
  createdTask: Task[];
  inProgressTask: Task[];
  backlogTask: Task[];
  doneTask: Task[];

  setSelectedTask: React.Dispatch<
    React.SetStateAction<SelectedTask | undefined>
  >;
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
  const [selectedTask, setSelectedTask] = useState<SelectedTask | undefined>();

  return (
    <AppContext.Provider
      value={{
        createdTask,
        inProgressTask,
        backlogTask,
        doneTask,
        selectedTask,

        setSelectedTask,
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
