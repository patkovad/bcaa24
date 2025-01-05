import { useContext, useState } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { TaskListContext } from "./task-list-provider.jsx";

function TaskItemDeleteDialog({ item, onClose }) {
  const [errorState, setErrorState] = useState(null);
  const { state, handlerMap } = useContext(TaskListContext);

  const handleDeleteTask = async () => {
    try {
      const result = await handlerMap.handleDelete({ id: item.id });

      if (result.ok) {
        onClose();
      } else if (result.code === "taskNotFound") {
        setErrorState("Task not found. It may have already been deleted.");
      } else if (result.code === "failedToRemoveTask") {
        setErrorState("Failed to delete task. Please try again later.");
      } else if (result.code === "dtoInIsNotValid") {
        setErrorState("Invalid request. Please contact support.");
      } else {
        setErrorState("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setErrorState("Network error. Please check your connection.");
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!errorState && <Alert variant="danger">{errorState}</Alert>}
        {`Do you really want to delete task "${item.name}"?`}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={state === "pending"}
        >
          Close
        </Button>
        <Button
          variant="danger"
          disabled={state === "pending"}
          onClick={handleDeleteTask}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskItemDeleteDialog;
