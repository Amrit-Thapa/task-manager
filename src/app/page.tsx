"use client";
import {useEffect, useState} from "react";
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
  updateTasks,
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

  useEffect(() => {
    const groupedTask = groupBy<Task, Status>(taskList, (item) => item.status);

    setBacklogList(
      groupedTask
        .get(Status.backlog)
        ?.sort((a, b) => +a.index.split("_")[1] - +b.index.split("_")[1]),
    );
    setInprogressList(
      groupedTask
        .get(Status.inProgress)
        ?.sort((a, b) => +a.index.split("_")[1] - +b.index.split("_")[1]),
    );
    setDoneList(
      groupedTask
        .get(Status.done)
        ?.sort((a, b) => +a.index.split("_")[1] - +b.index.split("_")[1]),
    );
    setCreatedList(
      groupedTask
        .get(Status.created)
        ?.sort((a, b) => +a.index.split("_")[1] - +b.index.split("_")[1]),
    );
  }, [taskList]);

  const handleAddTask = async (task: Task) => {
    await addTask<Task>(Store.Tasks, task);
    setTaskList((prev) => [...prev, task]);
  };

  const handleTaskDrop = async (
    destinationStatus: Status,
    selectedTask: Task,
    task?: Task,
  ) => {
    if (!selectedTask) return;

    const groupedTask = groupBy<Task, Status>(
      taskList.filter((item) => item.id !== selectedTask.id),
      (item) => item.status,
    );

    const {tasks, updatedItems} = insertTaskAtIndex(
      groupedTask.get(destinationStatus) || [],
      {
        ...selectedTask,
        status: destinationStatus,
        index: `${destinationStatus}_${
          task
            ? parseInt(task.index.split("_")[1])
            : (groupedTask.get(destinationStatus) || []).length
        }`,
      },
    );

    await updateTasks(Store.Tasks, updatedItems!);

    groupedTask.set(destinationStatus, tasks);

    setTaskList([
      ...(groupedTask.get(Status.backlog) || []),
      ...(groupedTask.get(Status.created) || []),
      ...(groupedTask.get(Status.inProgress) || []),
      ...(groupedTask.get(Status.done) || []),
    ] as Task[]);
    setSelectedTask(undefined);
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
      <div className="grid grid-cols-5 gap-3 min-w-[750px]  pt-10 border-t">
        <TaskList>
          <div className="flex items-center gap-2">
            <TaskList.Label>
              Task
              <LuListTodo />
            </TaskList.Label>
            <span>{createdList?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={handleAddTask}
            type={Status.created}
            taskList={createdList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) =>
              handleTaskDrop(Status.created, selectedTask, task)
            }
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
            addTask={handleAddTask}
            type={Status.inProgress}
            taskList={inprogressList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) =>
              handleTaskDrop(Status.inProgress, selectedTask, task)
            }
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
            addTask={handleAddTask}
            type={Status.done}
            taskList={doneList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) =>
              handleTaskDrop(Status.done, selectedTask, task)
            }
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
            addTask={handleAddTask}
            type={Status.backlog}
            taskList={backlogList || []}
            deleteTask={handleDeleteTask}
            onDropItem={(task) =>
              handleTaskDrop(Status.backlog, selectedTask, task)
            }
          />
        </TaskList>
      </div>
    </>
  );
}
