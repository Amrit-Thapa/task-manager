import "./globals.css";
import type {Metadata} from "next";
import {ComponentProps} from "react";
import {FaRegHandPointRight} from "react-icons/fa";
import {BiTask} from "react-icons/bi";
import {AppContextProvider} from "./AppContextProvider";

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
        <body suppressHydrationWarning={true}>
          <div className="max-w-[1440px] m-auto">
            <section className="p-5 md:mt-32">
              <div className="flex items-end gap-2">
                <BiTask className="p-0 h-14 w-14" />
                <div className="font-sans text-5xl bold">Tasks</div>
              </div>
              <ul className="mt-10">
                <li>
                  <FaRegHandPointRight className="inline mr-2" />
                  Click + New to create a new task directly on this board.{" "}
                </li>
                <li>
                  <FaRegHandPointRight className="inline mr-2" />
                  Click an existing task to add additional context or subtasks.
                </li>
              </ul>
            </section>
            <section className="p-5 mt-10">{children}</section>
          </div>
        </body>
      </AppContextProvider>
    </html>
  );
}
