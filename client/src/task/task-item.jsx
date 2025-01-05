import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

import Icon from "@mdi/react";
import { mdiPencilOutline, mdiClose } from "@mdi/js";

function TaskItem({ data, setTaskItemFormData, setTaskItemDeleteDialogData }) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Stack direction="horizontal" gap={2} className="align-items-start">
          <div>
            <h6 className="mb-1">{data.name}</h6>
            <p className="text-muted mb-0">{data.description}</p>
          </div>
          <div className="ms-auto d-flex align-items-start" style={{ marginTop: "-7px "}}>
            <Button
              className="border-0 p-1"
              variant="outline-primary"
              size="sm"
              onClick={() => setTaskItemFormData(data)}
            >
              <Icon path={mdiPencilOutline} size={0.8} />
            </Button>
            <Button
              className="border-0 p-1 ms-2"
              variant="outline-danger"
              size="sm"
              onClick={() => setTaskItemDeleteDialogData(data)}
            >
              <Icon path={mdiClose} size={0.8} />
            </Button>
          </div>
        </Stack>
      </Card.Body>
    </Card>
  );
}

export default TaskItem;
