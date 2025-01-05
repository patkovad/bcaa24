import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { StatusListContext } from "./status-list-provider.jsx";

function StatusItemForm({ data, onClose }) {
  const { state, handlerMap } = useContext(StatusListContext);
  const [name, setName] = useState(data?.name || ''); // Uložení name do stavu
  const [error, setError] = useState(null); // Pro chybové hlášení

  // Funkce pro validaci před odesláním
  const validate = () => {
    if (!name || name.length < 1 || name.length > 255) {
      setError("Name must be between 1 and 255 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validace před odesláním
    if (!validate()) return;

    const statusData = { name };

    if (data?.id) {
      // Pokud má data id, provádí aktualizaci
      await handlerMap.handleUpdate({ id: data.id, ...statusData });
    } else {
      // Pokud nemá id, provádí vytvoření
      await handlerMap.handleCreate(statusData);
    }

    onClose();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{data?.id ? "Update" : "Add"} status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={state === "pending"}
            required
          />
          {error && <Form.Text className="text-danger">{error}</Form.Text>}
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
            variant="success"
            type="submit"
            disabled={state === "pending"}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default StatusItemForm;
