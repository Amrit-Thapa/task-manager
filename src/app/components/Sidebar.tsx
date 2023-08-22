"use client";
import React from "react";
import {useAppContext} from "../AppContextProvider";

const Sidebar = () => {
  const {projects} = useAppContext();

  return (
    <div className="hidden h-screen gap-5 p-2 border md:flex md:flex-col w-36">
      <a href="/">Tasks</a>
      <a href="/dashboard">Dashboard</a>
    </div>
  );
};

export default Sidebar;
