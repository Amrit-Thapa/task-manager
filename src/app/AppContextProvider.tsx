"use client";
import React, {createContext, useState, useContext} from "react";
import {Task} from "../../database";

export enum Status {
  inProgress = "inProgress",
  done = "done",
  created = "created",
  backlog = "backlog",
}

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
  selectedTask: Task | undefined;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
};

export const AppContext = createContext<appContext>({} as appContext);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
  const [selectedTask, setSelectedTask] = useState<Task>();

  return (
    <AppContext.Provider
      value={{
        selectedTask,
        setSelectedTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
