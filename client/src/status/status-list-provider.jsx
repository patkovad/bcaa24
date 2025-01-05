import { createContext, useState, useEffect } from "react";

import FetchHelper from "../fetch-helper.js";

export const StatusListContext = createContext();

function StatusListProvider({ children }) {
  const [statusListDto, setStatusListDto] = useState({
    state: "ready", // ready / pending / error
    data: null,
    error: null,
  });

  console.log(statusListDto);

  async function handleLoad() {
    setStatusListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.status.list();
    setStatusListDto((current) => {
      if (result.ok) {
        return {
          ...current,
          state: "ready",
          data: result.data,
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  async function handleCreate(dtoIn) {
    setStatusListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.status.create(dtoIn);
    setStatusListDto((current) => {
      if (result.ok) {
        current.data.itemList.push(result.data);
        return {
          ...current,
          state: "ready",
          data: { itemList: current.data.itemList.slice() },
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  async function handleUpdate(dtoIn) {
    setStatusListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.status.update(dtoIn);
    setStatusListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList[itemIndex] = dtoIn;
        return {
          ...current,
          state: "ready",
          data: { itemList: current.data.itemList.slice() },
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
  }

  async function handleDelete(dtoIn) {
    setStatusListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.status.delete(dtoIn);
    setStatusListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList.splice(itemIndex, 1);
        return {
          ...current,
          state: "ready",
          data: { itemList: current.data.itemList.slice() },
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  useEffect(() => {
    handleLoad();
  }, []);

  const value = {
    ...statusListDto,
    handlerMap: { handleLoad, handleCreate, handleUpdate, handleDelete },
  };

  return (
    <StatusListContext.Provider value={value}>
      {children}
    </StatusListContext.Provider>
  );
}

export default StatusListProvider;