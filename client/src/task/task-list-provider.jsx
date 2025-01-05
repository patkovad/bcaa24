import { createContext, useState, useEffect } from "react";
import FetchHelper from "../fetch-helper.js";

export const TaskListContext = createContext();

function TaskListProvider({ children }) {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [taskListDto, setTaskListDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
  });

  const [statuses, setStatuses] = useState([]);

  async function loadStatuses() {
    const result = await FetchHelper.status.list(); // Assuming this fetches the list of statuses
    if (result.ok) {
      setStatuses(result.data.itemList || []);
    }
  }

  useEffect(() => {
    loadStatuses();
  }, []);


  async function handleLoad() {
    setTaskListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.task.list({ date: selectedMonth });
    setTaskListDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  /* eslint-disable */
  useEffect(() => {
    handleLoad();
  }, [selectedMonth]);
  /* eslint-enable */

  async function handleCreate(dtoIn) {
    setTaskListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.task.create(dtoIn);
    setTaskListDto((current) => {
      if (result.ok) {
        current.data.itemList.push(result.data);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
          statusMap: result.data.statusMap,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleUpdate(dtoIn) {
    setTaskListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.task.update(dtoIn);
    setTaskListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList[itemIndex] = dtoIn;
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
          pendingId: undefined,
        };
      } else {
        return {
          ...current,
          state: "error",
          error: result.data,
          pendingId: undefined,
        };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleDelete(dtoIn) {
    setTaskListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.task.delete(dtoIn);
    setTaskListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList.splice(itemIndex, 1);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  const value = {
    ...taskListDto,
    selectedMonth,
    setSelectedMonth,
    statuses,
    handlerMap: { handleLoad, handleCreate, handleUpdate, handleDelete },
    statusMap: taskListDto.data?.statusMap || {},
  };

  return (
    <TaskListContext.Provider value={value}>
      {children}
    </TaskListContext.Provider>
  );
}

export default TaskListProvider;
