import React, {ComponentProps, useState} from "react";
import {twMerge} from "tailwind-merge";
import {PiTrashThin} from "react-icons/pi";
import {Task, Status} from "../../../database/index";
import {useAppContext} from "../AppContextProvider";

type Props = {
  taskList: Task[];
  type: Status;
  onDropItem: (task?: Task) => void;
  addTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
} & ComponentProps<"div">;

const Label = ({children, className}: ComponentProps<"div">) => {
  return (
    <div>
      <label
        className={twMerge(
          "p-1 bg-green-200 rounded shadow-sm flex gap-2 justify-center items-center",
          className,
        )}
      >
        {children}
      </label>
    </div>
  );
};

const ListItem = ({taskList, onDropItem, addTask, type, deleteTask}: Props) => {
  const {selectedTask, setSelectedTask} = useAppContext();
  const [openForm, updateOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleTaskSubmit = (task: Task) => {
    console.log({task});
    addTask(task);
    setTitle("");
    updateOpenForm(false);
  };

  return (
    <>
      {!!taskList.length &&
        taskList.map((task) => {
          return (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 border rounded shadow-sm hover:bg-gray-100 group"
              draggable
              onDragOver={(event) => {
                event.preventDefault();
                if (task.id !== selectedTask?.id) {
                  event.target.style.borderTop = "thick solid #77AAFF";
                }
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                event.target.style.borderTop = "none";
              }}
              onDragStart={() => setSelectedTask(task)}
              onDrop={() => onDropItem(task)}
            >
              {task.title}
              <PiTrashThin
                className="hidden hover:cursor-pointer group-hover:block"
                onClick={() => {
                  deleteTask(task);
                }}
              />
            </div>
          );
        })}

      {openForm && (
        <div className="border rounded shadow-sm hover:bg-gray-100">
          <input
            type="text"
            className="w-full h-full p-2 border rounded focus:outline-none"
            value={title}
            onKeyUp={(e) => {
              if (e.code === "Enter") {
                handleTaskSubmit({
                  title: title || "Untitled",
                  id: Date.now(),
                  index: `${type}_${taskList.length}`,
                  description,
                  status: type,
                });
              }
            }}
            autoFocus
            onBlur={() => {
              handleTaskSubmit({
                title: title || "Untitled",
                id: Date.now(),
                index: `${type}_${taskList.length}`,
                description,
                status: type,
              });
            }}
            placeholder="Type name..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      )}
      <div
        onClick={() => updateOpenForm(true)}
        className="p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
        onDrop={() => onDropItem()}
        onDragEnd={(event) => {
          event.preventDefault();
          // event.target.style.borderTop = "none";
        }}
        onDragOver={(event) => {
          event.stopPropagation();
          event.preventDefault();
          // event.target.style.borderTop = "2px solid #95DCFF";
        }}
      >
        +New
      </div>
    </>
  );
};

const TaskList = ({children}: ComponentProps<"div">) => {
  return <div className="flex flex-col h-full gap-2">{children}</div>;
};

TaskList.Label = Label;
TaskList.ListItem = ListItem;

export default TaskList;
