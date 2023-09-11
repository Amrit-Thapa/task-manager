"use client";
import {useEffect, useState} from "react";
import {
  getAllStoreData,
  initDB,
  Store,
  Task,
  Status,
} from "../../database/index";
import {useAppContext} from "./AppContextProvider";
import TaskList from "./components/TaskList";
import {groupBy, insertTaskAtIndex} from "./utils/index";

export default function Home() {
  const {selectedTask, setSelectedTask} = useAppContext();

  const [taskList, setTaskList] = useState<Task[]>([]);
  const [createdList, setCreatedList] = useState<Task[]>();
  const [doneList, setDoneList] = useState<Task[]>();
  const [inprogressList, setInprogressList] = useState<Task[]>();
  const [backlogList, setBacklogList] = useState<Task[]>();

  useEffect(() => {
    if (taskList.length) {
      const groupedTask = groupBy<Task, Status>(
        taskList,
        (item) => item.status,
      );

      setBacklogList([...(groupedTask.get(Status.backlog) || [])]);
      setInprogressList(groupedTask.get(Status.inProgress));
      setDoneList(groupedTask.get(Status.done));
      setCreatedList(groupedTask.get(Status.created));
    }
  }, [taskList]);

  useEffect(() => {
    (async () => {
      try {
        await initDB();
        const res = await getAllStoreData<Task>(Store.Tasks);
        setTaskList(res);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleTaskDrop = (destination: Status, task?: Task) => {
    if (!selectedTask) return;

    const groupedTask = groupBy<Task, Status>(
      taskList.filter((item) => item.id !== selectedTask.id),
      (item) => item.status,
    );
    groupedTask.set(
      destination,
      insertTaskAtIndex(groupedTask.get(destination) || [], {
        ...selectedTask,
        status: destination,
        index: `${destination}_${
          task
            ? parseInt(task.index.split("_")[1])
            : (groupedTask.get(destination) || []).length
        }`,
      }),
    );

    setTaskList([
      ...(groupedTask.get(Status.backlog) || []),
      ...(groupedTask.get(Status.created) || []),
      ...(groupedTask.get(Status.inProgress) || []),
      ...(groupedTask.get(Status.done) || []),
    ] as Task[]);
    setSelectedTask(undefined);
  };

  return (
    <div className="grid grid-cols-5 min-h-[calc(100vh-114px)] gap-3 p-2">
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label>Task</TaskList.Label>
          <span>{createdList?.length || 0}</span>
        </div>
        <TaskList.ListItem
          setter={setTaskList}
          type={Status.created}
          taskList={createdList || []}
          onDropItem={(task) => handleTaskDrop(Status.created, task)}
        />
      </TaskList>
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label className="bg-red-200">BackLog</TaskList.Label>
          <span>{backlogList?.length || 0}</span>
        </div>
        <TaskList.ListItem
          setter={setTaskList}
          type={Status.backlog}
          taskList={backlogList || []}
          onDropItem={(task) => handleTaskDrop(Status.backlog, task)}
        />
      </TaskList>
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label className="bg-blue-200">In Progress</TaskList.Label>
          <span>{inprogressList?.length || 0}</span>
        </div>
        <TaskList.ListItem
          setter={setTaskList}
          type={Status.inProgress}
          taskList={inprogressList || []}
          onDropItem={(task) => handleTaskDrop(Status.inProgress, task)}
        />
      </TaskList>
      <TaskList>
        <div className="flex gap-2">
          <TaskList.Label className="bg-purple-200">Done</TaskList.Label>
          <span>{doneList?.length || 0}</span>
        </div>
        <TaskList.ListItem
          setter={setTaskList}
          type={Status.done}
          taskList={doneList || []}
          onDropItem={(task) => handleTaskDrop(Status.done, task)}
        />
      </TaskList>
    </div>
  );
}
