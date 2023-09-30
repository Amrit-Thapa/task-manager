import "./globals.css";
import type {Metadata} from "next";
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
          <div className="w-full px-4">
            <div className="flex items-end w-full h-32" id="title-portal"></div>
            <div className="pt-10">{children}</div>
          </div>
        </body>
      </AppContextProvider>
    </html>
  );
}
