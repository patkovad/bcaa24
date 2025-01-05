import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Icon from "@mdi/react";
import { mdiPlus, mdiSort } from "@mdi/js";

import { TaskListContext } from "./task-list-provider";
import TaskItem from "./task-item";
import TaskItemForm from "./task-item-form";
import TaskItemDeleteDialog from "./task-item-delete-dialog";

function DashboardContent() {
  const [taskItemFormData, setTaskItemFormData] = useState(null);
  const [taskItemDeleteDialogData, setTaskItemDeleteDialogData] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const { data, statusMap } = useContext(TaskListContext);

  const statusTaskMap = data?.itemList.reduce((map, task) => {
    if (!map[task.statusId]) {
      map[task.statusId] = [];
    }
    map[task.statusId].push(task);
    return map;
  }, {}) || {};

  // Sort tasks by date if sorted state is true
  const sortedStatusTaskMap = Object.keys(statusTaskMap).reduce((sortedMap, statusId) => {
    sortedMap[statusId] = isSorted
      ? [...statusTaskMap[statusId]].sort((a, b) => new Date(a.date) - new Date(b.date))
      : statusTaskMap[statusId];
    return sortedMap;
  }, {});

  return (
    <div style={{ marginTop: "70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="mb-4">Dashboard</h1>
        <Stack direction="horizontal" gap={2} className="mb-3">
          <Button
            variant="success"
            size="sm"
            onClick={() => setTaskItemFormData({})}
            className="d-flex align-items-center"
          >
            <Icon path={mdiPlus} size={0.8} style={{ marginRight: "8px" }} />
            Add Task
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSorted((prev) => !prev)}
            className="d-flex align-items-center"
          >
            <Icon path={mdiSort} size={0.8} style={{ marginRight: "8px" }} />
            Order
          </Button>
        </Stack>
      </div>

      <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
        {Object.keys(sortedStatusTaskMap).map((statusId) => (
          <Card key={statusId} style={{ minWidth: "300px", flex: "1", border: "unset" }}>
            <Card.Header className="bg-primary text-white" style={{ borderRadius: "6px" }}>
              <strong>{statusMap[statusId]?.name || "Unknown Status"}</strong>
            </Card.Header>
            <Card.Body>
              {sortedStatusTaskMap[statusId].map((task) => (
                <TaskItem
                  key={task.id}
                  data={task}
                  setTaskItemFormData={setTaskItemFormData}
                  setTaskItemDeleteDialogData={setTaskItemDeleteDialogData}
                />
              ))}
            </Card.Body>
          </Card>
        ))}
      </div>

      {!!taskItemFormData && (
        <TaskItemForm item={taskItemFormData} onClose={() => setTaskItemFormData(null)} />
      )}

      {!!taskItemDeleteDialogData && (
        <TaskItemDeleteDialog
          item={taskItemDeleteDialogData}
          onClose={() => setTaskItemDeleteDialogData(null)}
        />
      )}
    </div>
  );
}

export default DashboardContent;
