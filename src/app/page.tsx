"use client";
import {MdOutlineDoneAll} from "react-icons/md";
import {LuListTodo} from "react-icons/lu";
import {AiOutlineStop} from "react-icons/ai";
import {TbProgressCheck} from "react-icons/tb";
import {useAppContext} from "./AppContextProvider";
import TaskList from "./components/TaskList";
import {Status} from "./utils/types";
import useTask from "./hooks/useTask";

export default function Home() {
  const {selectedTask} = useAppContext();
  const {addTask, taskList, deleteTask, moveTask} = useTask();

  return (
    <>
      <div className="grid grid-cols-5 gap-3 min-w-[750px] pt-10 border-t">
        <TaskList>
          <div className="flex items-center gap-2">
            <TaskList.Label>
              Task
              <LuListTodo />
            </TaskList.Label>
            <span>{taskList.created?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={addTask}
            type={Status.created}
            taskList={taskList.created || []}
            deleteTask={deleteTask}
            onDropItem={(task) =>
              selectedTask && moveTask(selectedTask, Status.created, task)
            }
          />
        </TaskList>
        <TaskList>
          <div className="flex gap-2">
            <TaskList.Label className="bg-blue-200">
              In Progress
              <TbProgressCheck />
            </TaskList.Label>
            <span>{taskList.inProgress?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={addTask}
            type={Status.inProgress}
            taskList={taskList.inProgress || []}
            deleteTask={deleteTask}
            onDropItem={(task) =>
              selectedTask && moveTask(selectedTask, Status.inProgress, task)
            }
          />
        </TaskList>
        <TaskList>
          <div className="flex gap-2">
            <TaskList.Label className="bg-purple-200">
              Done
              <MdOutlineDoneAll />
            </TaskList.Label>
            <span>{taskList.done?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={addTask}
            type={Status.done}
            taskList={taskList.done || []}
            deleteTask={deleteTask}
            onDropItem={(task) =>
              selectedTask && moveTask(selectedTask, Status.done, task)
            }
          />
        </TaskList>
        <TaskList>
          <div className="flex items-center gap-2">
            <TaskList.Label className="bg-red-200">
              BackLog
              <AiOutlineStop />
            </TaskList.Label>
            <span>{taskList.backlog?.length || 0}</span>
          </div>
          <TaskList.ListItem
            addTask={addTask}
            type={Status.backlog}
            taskList={taskList.backlog || []}
            deleteTask={deleteTask}
            onDropItem={(task) =>
              selectedTask && moveTask(selectedTask, Status.backlog, task)
            }
          />
        </TaskList>
      </div>
    </>
  );
}
