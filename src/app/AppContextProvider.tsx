"use client";
import React, {createContext, useState, useContext} from "react";
import {Task} from "./utils/types";

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
