"use client";
import {useEffect} from "react";
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
    selectedTask,
    setSelectedTask,
  } = useAppContext();

  useEffect(() => {
    console.log(selectedTask);
  }, [selectedTask]);

  const handleTaskDrop = (destination: TaskType) => {
    if (!selectedTask) return;
    if (selectedTask.status === destination) return;

    switch (destination) {
      case TaskType.backlog:
        setBacklogTask((prev) => [
          {...selectedTask, status: TaskType.backlog},
          ...prev,
        ]);
        break;
      case TaskType.created:
        setCreatedTask((prev) => [
          {...selectedTask, status: TaskType.created},
          ...prev,
        ]);
        break;
      case TaskType.done:
        setDoneTask((prev) => [
          {...selectedTask, status: TaskType.done},
          ...prev,
        ]);
        break;
      case TaskType["in-progress"]:
        setInProgressTask((prev) => [
          {...selectedTask, status: TaskType["in-progress"]},
          ...prev,
        ]);
        break;
    }
    setSelectedTask(undefined);
  };

  return (
    <div className="grid grid-cols-5 min-h-[calc(100vh-114px)] gap-3 p-2">
      <TaskList
        taskList={createdTask}
        setter={setCreatedTask}
        type={TaskType.created}
        onDrop={() => handleTaskDrop(TaskType.created)}
      >
        <TaskList.Label>Task</TaskList.Label>
      </TaskList>
      <TaskList
        taskList={backlogTask}
        setter={setBacklogTask}
        type={TaskType.backlog}
        onDrop={() => handleTaskDrop(TaskType.backlog)}
      >
        <TaskList.Label>BackLog</TaskList.Label>
      </TaskList>
      <TaskList
        taskList={inProgressTask}
        setter={setInProgressTask}
        type={TaskType["in-progress"]}
        onDrop={() => handleTaskDrop(TaskType["in-progress"])}
      >
        <TaskList.Label>In Progress</TaskList.Label>
      </TaskList>
      <TaskList
        taskList={doneTask}
        setter={setDoneTask}
        type={TaskType.done}
        onDrop={() => handleTaskDrop(TaskType.done)}
      >
        <TaskList.Label>Done</TaskList.Label>
      </TaskList>
      {/* <TaskList taskList={doneTask} setter={setDoneTask}>
        <TaskList.Label>Done</TaskList.Label>
      </TaskList> */}
    </div>
  );
}
