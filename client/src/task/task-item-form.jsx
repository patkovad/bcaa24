import { useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { TaskListContext } from "./task-list-provider.jsx";

function TaskItemForm({ item, onClose }) {
  const { state, statuses, handlerMap } = useContext(TaskListContext);

  return (
    <Modal show={true} onHide={onClose}>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData(e.target);
          const values = Object.fromEntries(formData);

          let result;
          if (item?.id) {
            result = await handlerMap.handleUpdate({
              id: item.id,
              ...values,
            });
          } else {
            result = await handlerMap.handleCreate({ ...values });
          }
          if (result.ok) {
            onClose();
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{item?.id ? "Update" : "Add"} Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            defaultValue={item?.name}
            disabled={state === "pending"}
            required
          />

          <Form.Label style={{paddingTop: "20px"}}>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            defaultValue={item?.description || ""}
            disabled={state === "pending"}
          />

          <Form.Label style={{paddingTop: "20px"}}>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            defaultValue={
              item?.date
                ? new Date(item?.date).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10)
            }
            disabled={state === "pending"}
            required
          />

          <Form.Label style={{paddingTop: "20px"}}>Status</Form.Label>
          <Form.Select
            name="statusId"
            defaultValue={item?.statusId}
            disabled={state === "pending" || statuses.length === 0}
            required
          >
            <option value="">Select status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={state === "pending"}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={state === "pending"}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TaskItemForm;
