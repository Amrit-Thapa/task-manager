import "./globals.css";
import type {Metadata} from "next";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import {ComponentProps} from "react";
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
      </head>
      <AppContextProvider>
        <body
          className="flex max-w-[1600px] m-auto"
          suppressHydrationWarning={true}
        >
          <Sidebar />
          <div className="w-full px-4 ">
            <Header />
            <div>{children}</div>
          </div>
        </body>
      </AppContextProvider>
    </html>
  );
}
