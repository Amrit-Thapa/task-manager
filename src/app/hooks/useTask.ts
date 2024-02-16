import {Reducer, useEffect, useReducer} from "react";
import {
  addData,
  getAllStoreData,
  initDB,
  Store,
  deleteData,
  updateTasks,
} from "../../../database/index";
import {
  deleteFromIndex,
  groupBy,
  insertTaskAtIndex,
  sortItems,
} from "../utils/index";
import {Status, Task} from "../utils/types";

export enum Actions {
  SET_TASKS = "SET_TASKS",
  ADD_TASK = "ADD_TASK",
  UPDATE_TASK = "UPDATE_TASK",
  MOVE_TASK = "MOVE_TASK",
}

type StateActions = {
  type: Actions;
  payload: any;
};

type TaskState = {
  [Status.backlog]: Task[];
  [Status.created]: Task[];
  [Status.done]: Task[];
  [Status.inProgress]: Task[];
};

const reducer = (state: TaskState, action: StateActions) => {
  const {type, payload} = action;
  switch (type) {
    case Actions.SET_TASKS:
      const res = groupBy<Task, Status>(payload, (item) => item.status);
      const backlog = res.get(Status.backlog);
      const created = res.get(Status.created);
      const done = res.get(Status.done);
      const inProgress = res.get(Status.inProgress);
      return {
        created: created ? [...sortItems(created)] : [],
        done: done ? [...sortItems(done)] : [],
        inProgress: inProgress ? [...sortItems(inProgress)] : [],
        backlog: backlog ? [...sortItems(backlog)] : [],
      };

    case Actions.ADD_TASK:
      return {
        ...state,
        [payload.status as Status]: [
          ...state[payload.status as Status],
          payload,
        ],
      };

    case Actions.UPDATE_TASK:
      return {
        ...state,
        [payload.status]: payload.tasks,
      };

    case Actions.MOVE_TASK: {
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
};

const useFetchTask = () => {
  const [taskList, dispatch] = useReducer<Reducer<TaskState, StateActions>>(
    reducer,
    {
      [Status.backlog]: [],
      [Status.created]: [],
      [Status.done]: [],
      [Status.inProgress]: [],
    },
  );

  useEffect(() => {
    fetchAllTask();
  }, []);

  const fetchAllTask = async () => {
    try {
      await initDB();
      const res = await getAllStoreData<Task>(Store.Tasks);
      dispatch({type: Actions.SET_TASKS, payload: res});
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async (task: Task) => {
    await addData(Store.Tasks, task);
    dispatch({
      type: Actions.ADD_TASK,
      payload: task,
    });
  };

  const deleteTask = (task: Task) => {
    const taskCopy = taskList[task.status];
    const index = taskCopy.indexOf(task);
    const {tasks, updateIds} = deleteFromIndex(taskCopy, index);
    deleteData(Store.Tasks, {id: task.id, updateItems: updateIds}).then(() => {
      dispatch({
        type: Actions.UPDATE_TASK,
        payload: {tasks, status: task.status},
      });
    });
  };

  const moveTask = (selectedTask: Task, destination: Status, over?: Task) => {
    if (selectedTask.index === over?.index) return;

    const source = selectedTask.status;
    const sourceList = taskList[source];
    const destinationList = taskList[destination];
    const indexOfSelectedTask = sourceList.indexOf(selectedTask);
    const destinationIndex = over
      ? destinationList.indexOf(over)
      : destinationList.length;

    const {tasks} = deleteFromIndex(sourceList, indexOfSelectedTask);
    const {tasks: DestinationTask, updatedItems} = insertTaskAtIndex(
      destinationList,
      selectedTask,
      destinationIndex,
    );
    if (updatedItems) {
      updateTasks(Store.Tasks, updatedItems).then(() => {
        dispatch({
          type: Actions.MOVE_TASK,
          payload: {[source]: tasks, [destination]: DestinationTask},
        });
      });
    }
  };

  return {
    taskList,
    fetchAllTask,
    addTask,
    moveTask,
    deleteTask,
  };
};

export default useFetchTask;
