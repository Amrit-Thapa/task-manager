"use client";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {MdOutlineDoneAll} from "react-icons/md";
import {LuListTodo} from "react-icons/lu";
import {AiOutlineStop} from "react-icons/ai";
import {TbProgressCheck} from "react-icons/tb";
import {
  getAllStoreData,
  initDB,
  Store,
  Task,
  Status,
  addTask,
  deleteData,
  DBName,
} from "../../database/index";
import {useAppContext} from "./AppContextProvider";
import TaskList from "./components/TaskList";
import {deleteFromIndex, groupBy, insertTaskAtIndex} from "./utils/index";

export default function Home() {
  const {selectedTask, setSelectedTask} = useAppContext();

  const [taskList, setTaskList] = useState<Task[]>([]);
  const [createdList, setCreatedList] = useState<Task[]>();
  const [doneList, setDoneList] = useState<Task[]>();
  const [inprogressList, setInprogressList] = useState<Task[]>();
  const [backlogList, setBacklogList] = useState<Task[]>();
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    const groupedTask = groupBy<Task, Status>(taskList, (item) => item.status);

    setBacklogList(groupedTask.get(Status.backlog));
    setInprogressList(groupedTask.get(Status.inProgress));
    setDoneList(groupedTask.get(Status.done));
    setCreatedList(groupedTask.get(Status.created));
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

  useLayoutEffect(() => {
    ref.current = document.getElementById("title-portal");
  }, []);

  // Todo update this function
  const handleTaskDrop = (destination: Status, task?: Task) => {
    if (!selectedTask) return;

    const groupedTask = groupBy<Task, Status>(
      taskList.filter((item) => item.id !== selectedTask.id),
      (item) => item.status,
    );

    const {tasks, updatedItem} = insertTaskAtIndex(
      groupedTask.get(destination) || [],
      {
        ...selectedTask,
        status: destination,
        index: `${destination}_${
          task
            ? parseInt(task.index.split("_")[1])
            : (groupedTask.get(destination) || []).length
        }`,
      },
    );

    groupedTask.set(destination, tasks);

    setTaskList([
      ...(groupedTask.get(Status.backlog) || []),
      ...(groupedTask.get(Status.created) || []),
      ...(groupedTask.get(Status.inProgress) || []),
      ...(groupedTask.get(Status.done) || []),
    ] as Task[]);
    setSelectedTask(undefined);
  };

  const handleTaskAdd = async (task: Task) => {
    await addTask<Task>(Store.Tasks, task);
    setTaskList((prev) => [...prev, task]);
  };

  const handleDeleteTask = (task: Task) => {
    const groupedTask = groupBy<Task, Status>(taskList, (item) => item.status);

    const {tasks, updateIds} = deleteFromIndex(
      groupedTask.get(task.status) || [],
      task.index,
    );
    groupedTask.set(task.status, tasks);

    deleteData(Store.Tasks, {id: task.id, updateItems: updateIds}).then(() => {
      setTaskList([
        ...(groupedTask.get(Status.backlog) || []),
        ...(groupedTask.get(Status.created) || []),
        ...(groupedTask.get(Status.inProgress) || []),
        ...(groupedTask.get(Status.done) || []),
      ] as Task[]);
    });
  };

  return (
    <>
      <div className="grid grid-cols-5 min-h-[calc(100vh-114px)] gap-3 pt-10 border-t">
        <TaskList>
          <div className="flex items-center gap-2">
            <TaskList.Label>
              Task
              <LuListTodo />
            </TaskList.Label>
            <span>{createdList?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={handleTaskAdd}
            type={Status.created}
            taskList={createdList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) => handleTaskDrop(Status.created, task)}
          />
        </TaskList>
        <TaskList>
          <div className="flex gap-2">
            <TaskList.Label className="bg-blue-200">
              In Progress
              <TbProgressCheck />
            </TaskList.Label>
            <span>{inprogressList?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={handleTaskAdd}
            type={Status.inProgress}
            taskList={inprogressList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) => handleTaskDrop(Status.inProgress, task)}
          />
        </TaskList>
        <TaskList>
          <div className="flex gap-2">
            <TaskList.Label className="bg-purple-200">
              Done
              <MdOutlineDoneAll />
            </TaskList.Label>
            <span>{doneList?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={handleTaskAdd}
            type={Status.done}
            taskList={doneList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) => handleTaskDrop(Status.done, task)}
          />
        </TaskList>
        <TaskList>
          <div className="flex items-center gap-2">
            <TaskList.Label className="bg-red-200">
              BackLog
              <AiOutlineStop />
            </TaskList.Label>
            <span>{backlogList?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={handleTaskAdd}
            type={Status.backlog}
            taskList={backlogList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) => handleTaskDrop(Status.backlog, task)}
          />
        </TaskList>
      </div>
    </>
  );
}
