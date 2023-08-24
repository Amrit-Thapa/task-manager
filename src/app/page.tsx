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
    selectedTask,
    setSelectedTask,
  } = useAppContext();

  const handleTaskDrop = (destination: TaskType) => {
    if (!selectedTask) return;
    if (selectedTask.task.status === destination) return;

    selectedTask.sourceUpdater((prev) => {
      const temp = prev.filter((item) => item.id !== selectedTask.task.id);
      return temp;
    });

    switch (destination) {
      case TaskType.backlog:
        setBacklogTask((prev) => [
          {...selectedTask.task, status: TaskType.backlog},
          ...prev,
        ]);
        break;
      case TaskType.created:
        setCreatedTask((prev) => [
          {...selectedTask.task, status: TaskType.created},
          ...prev,
        ]);
        break;
      case TaskType.done:
        setDoneTask((prev) => [
          {...selectedTask.task, status: TaskType.done},
          ...prev,
        ]);
        break;
      case TaskType.inProgress:
        setInProgressTask((prev) => [
          {...selectedTask.task, status: TaskType["inProgress"]},
          ...prev,
        ]);
        break;
    }
    setSelectedTask(undefined);
  };

  return (
    <div className="grid grid-cols-5 min-h-[calc(100vh-114px)] gap-3 p-2">
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label>Task</TaskList.Label>
          <span>{createdTask.length}</span>
        </div>
        <TaskList.ListItem
          setter={setCreatedTask}
          type={TaskType.created}
          taskList={createdTask}
          onDrop={() => handleTaskDrop(TaskType.created)}
        />
      </TaskList>
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label className="bg-red-200">BackLog</TaskList.Label>
          <span>{backlogTask.length}</span>
        </div>
        <TaskList.ListItem
          setter={setBacklogTask}
          type={TaskType.backlog}
          taskList={backlogTask}
          onDrop={() => handleTaskDrop(TaskType.backlog)}
        />
      </TaskList>
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label className="bg-blue-200">In Progress</TaskList.Label>
          <span> {inProgressTask.length}</span>
        </div>
        <TaskList.ListItem
          setter={setInProgressTask}
          type={TaskType.inProgress}
          taskList={inProgressTask}
          onDrop={() => handleTaskDrop(TaskType.inProgress)}
        />
      </TaskList>
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label className="bg-purple-200">Done</TaskList.Label>
          <span>{doneTask.length}</span>
        </div>
        <TaskList.ListItem
          setter={setDoneTask}
          type={TaskType.done}
          taskList={doneTask}
          onDrop={() => handleTaskDrop(TaskType.done)}
        />
      </TaskList>
    </div>
  );
}
