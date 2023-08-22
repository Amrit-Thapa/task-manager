"use client";
import {TaskType, useAppContext} from "./AppContextProvider";
import TaskList from "./components/TaskList";

export default function Home() {
  const {
    createdTask,
    setCreatedTask,
    backlogTask,
    setBacklogTask,
    inProgressTask,
    setInProgressTask,
    doneTask,
    setDoneTask,
  } = useAppContext();

  return (
    <div className="grid grid-cols-5 min-h-[calc(100vh-114px)] gap-3 p-2">
      <TaskList
        taskList={createdTask}
        setter={setCreatedTask}
        type={TaskType.created}
      >
        <TaskList.Label>Task</TaskList.Label>
      </TaskList>
      <TaskList
        taskList={backlogTask}
        setter={setBacklogTask}
        type={TaskType.backlog}
      >
        <TaskList.Label>BackLog</TaskList.Label>
      </TaskList>
      <TaskList
        taskList={inProgressTask}
        setter={setInProgressTask}
        type={TaskType["in-progress"]}
      >
        <TaskList.Label>In Progress</TaskList.Label>
      </TaskList>
      <TaskList taskList={doneTask} setter={setDoneTask} type={TaskType.done}>
        <TaskList.Label>Done</TaskList.Label>
      </TaskList>
      {/* <TaskList taskList={doneTask} setter={setDoneTask}>
        <TaskList.Label>Done</TaskList.Label>
      </TaskList> */}
    </div>
  );
}
