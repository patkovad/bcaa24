import { useContext, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import ListGroup from "react-bootstrap/ListGroup";

import Icon from "@mdi/react";
import { mdiTagPlusOutline } from "@mdi/js";

import { StatusListContext } from "./status-list-provider";
import PendingItem from "./pending-item";
import StatusItem from "./status-item";
import StatusItemForm from "./status-item-form";
import StatusItemDeleteDialog from "./status-item-delete-dialog";

function StatusListContent() {
  const [statusItemFormData, setStatusItemFormData] = useState();
  const [statusItemDeleteDialog, setStatusItemDeleteDialog] = useState();
  const { state, data } = useContext(StatusListContext);

  return (
    <Card className="border-0">
      {!!statusItemFormData ? (
        <StatusItemForm
          data={statusItemFormData}
          onClose={() => setStatusItemFormData()}
        />
      ) : null}
      {!!statusItemDeleteDialog ? (
        <StatusItemDeleteDialog
          data={statusItemDeleteDialog}
          onClose={() => setStatusItemDeleteDialog()}
        />
      ) : null}
      <Card.Header
        className="sticky-top "
        bsPrefix="bg-white"
        style={{ top: "56px", padding: "8px" }}
      >
        <Stack direction="horizontal" gap={3}>
          <div>Categories</div>
          <div className=" ms-auto">
            <Button
              className="me-auto"
              variant="success"
              size="sm"
              disable={state === "pending"}
              p={2}
              onClick={() => setStatusItemFormData({})}
            >
              <Icon path={mdiTagPlusOutline} size={0.8} /> Add status
            </Button>
          </div>
        </Stack>
      </Card.Header>
      <Card.Body className="px-0" style={{ position: "relative", top: "40px" }}>
        {state === "pending" && !data
          ? [0, 1, 2, 3].map((item) => <PendingItem key={item} />)
          : null}
        {data?.itemList ? (
          <ListGroup className="border-1">
            {data.itemList.map((item) => (
              <StatusItem
                key={item.id}
                data={item}
                setStatusItemFormData={setStatusItemFormData}
                setStatusItemDeleteDialog={setStatusItemDeleteDialog}
              />
            ))}
          </ListGroup>
        ) : null}
      </Card.Body>
    </Card>
  );
}

export default StatusListContent;