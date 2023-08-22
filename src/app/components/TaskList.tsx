import React, {ComponentProps, SyntheticEvent, useState} from "react";
import {flushSync} from "react-dom";
import {Task, TaskType, useAppContext} from "../AppContextProvider";

type Props = {
  taskList: Task[];
  type: TaskType;
  setter: React.Dispatch<React.SetStateAction<Task[]>>;
};

const Label = ({children}: ComponentProps<"div">) => {
  return (
    <div>
      <label className={"p-1 bg-green-200 rounded shadow-sm"}>{children}</label>
    </div>
  );
};

const TaskList = ({
  taskList,
  setter,
  type,
  onDrop,
  children,
}: ComponentProps<"div"> & Props) => {
  const {setSelectedTask} = useAppContext();
  const [openForm, updateOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleTaskSubmit = (task: Task) => {
    setter((prev) => [task, ...prev]);
    setDescription("");
    setTitle("");
    updateOpenForm(false);
  };

  return (
    <>
      <div className="flex flex-col h-full gap-2">
        {children}
        {!!taskList.length &&
          taskList.map((task) => {
            return (
              <div
                key={task.id}
                className="p-2 border rounded shadow-sm hover:bg-gray-100"
                draggable
                onDragOver={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
                onDragStart={() => setSelectedTask(task)}
                onDrop={onDrop}
              >
                {task.title}
              </div>
            );
          })}
        <div
          onClick={() => updateOpenForm(true)}
          className="p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
          onDrop={onDrop}
          onDragOver={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          + New
        </div>
      </div>
      {openForm && (
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-gray-100 bg-opacity-60"
          onClick={() => updateOpenForm(false)}
        >
          <div
            className="absolute z-10 flex flex-col justify-center h-64 gap-4 p-5 m-auto -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg cursor-pointer top-1/2 left-1/2 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-end justify-between">
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-b-2"
              />
            </div>
            <div className="flex items-end justify-between">
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-b-2"
              />
            </div>
            <button
              onClick={() =>
                handleTaskSubmit({
                  title,
                  id: title.replaceAll(" ", "_").toLowerCase(),
                  description,
                  status: type,
                })
              }
            >
              submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

TaskList.Label = Label;

export default TaskList;
