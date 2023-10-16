import "./globals.css";
import type {Metadata} from "next";
import {ComponentProps} from "react";
import Image from "next/image";
import {MdOutlineAddTask} from "react-icons/md";
import {AppContextProvider} from "./AppContextProvider";
import TaskIcon from "./Task.svg";

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "App to track and organize your task at one place",
};

export default function RootLayout({children}: ComponentProps<"body">) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./favicon.ico" />
      </head>
      <AppContextProvider>
        <body
          className="flex max-w-[1600px] m-auto"
          suppressHydrationWarning={true}
        >
          <div className="w-full p-4">
            <div className="flex flex-col items-start gap-5">
              <div className="flex items-center justify-center gap-2 text-4xl">
                <Image src={TaskIcon} height={50} width={50} alt="TaskManger" />
                Plan Your Tasks
              </div>
              <div>
                <li>
                  Click + New to create a new task directly on this board.{" "}
                </li>
                <li>
                  Click an existing task to add additional context or subtasks.
                </li>
              </div>
            </div>
            <div className="pt-10">{children}</div>
          </div>
        </body>
      </AppContextProvider>
    </html>
  );
}
