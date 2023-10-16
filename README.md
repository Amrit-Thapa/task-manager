# Task Manager App - Next.js

Welcome to the Task Manager App built with Next.js! This project allows you to manage your tasks by adding, editing, deleting, and moving them between different statuses such as "In Progress," "Backlog," and "Done." This README will guide you through setting up and using the application.

## Data Persistence with IndexedDB

This Task Manager App utilizes IndexedDB to provide data persistence. IndexedDB is a low-level, browser-based database that allows us to store your tasks locally in your web browser. This means that all your tasks will remain available even after you close and reopen the application or refresh the page.

### How it Works

- When you add, edit, delete, or move tasks, the changes are saved to the IndexedDB database.
- The app fetches and displays your tasks from IndexedDB when you load the page, ensuring that your task data is always accessible.

IndexedDB is a powerful tool for client-side data storage, and it enhances the user experience by preserving your tasks across sessions.

Please note that IndexedDB data is specific to the browser and device you are using. Clearing browser data or using a different device may result in a different set of tasks.

## Demo

https://task-manager-flame-psi.vercel.app/

![Logo](./src/app/Task.svg)

#### Adding a Task

- On the app's homepage, you will see a "Add New Task" button. Click on it.
- A form will appear where you can enter the task details, such as title, description, and status.
- Fill in the required information and click the "Add Task" button.
- Your new task will be added to the task section by default.

#### Editing a Task

- To edit a task, find the task you want to edit in the list.
- Click on the task to open the edit form.
- Make the necessary changes and click the "Save" button to update the task.

#### Deleting a Task

- To delete a task, find the task you want to delete in the list.
- Click on the task to open the edit form.
- Scroll down to the bottom of the edit form, and you will find a "Delete" button. Click on it.
- Confirm the deletion, and the task will be removed from the list.

#### Moving a Task

- Tasks can be moved between different statuses: "In Progress," "Backlog," and "Done."
- To move a task, find the task you want to move in the list.
- Click and drag the task to the desired section, and it will be automatically updated with the new status.

## Future Goals

We are committed to continuously improving the Task Manager App. Here are some exciting future goals for the project:

### 1. Offline Support

One of our top priorities is to enhance the user experience by adding offline support. We plan to implement a service worker that will cache the app's assets and data, allowing you to access and manage your tasks even when you are offline. This feature will ensure that you can work on your tasks seamlessly, regardless of your internet connection.

### 2. Creating a Progressive Web App (PWA)

To make the Task Manager App more accessible and user-friendly on mobile devices, we aim to turn it into a Progressive Web App (PWA). This means that you will be able to install the app on your mobile device's home screen, just like a native app, and use it without the need to visit a website. A PWA will provide a smoother and more efficient task management experience on your mobile device.

We are excited about these upcoming features and look forward to delivering an even more robust and user-friendly task management solution in the future. Stay tuned for updates and improvements!

## Run Locally

Clone the project

```bash
  git clone https://github.com/Amrit-Thapa/task-manager
```

Go to the project directory

```bash
  cd task-manager
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
