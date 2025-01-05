import { useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/esm/Stack";

import { TaskListContext } from "./task-list-provider";
import TaskItem from "./task-item";

function StatusDetail({
  statusId,
  sum,
  itemList,
  setTaskItemFormData,
  setTaskItemDeleteDialog,
}) {
  const { data } = useContext(TaskListContext);

  return (
    <Accordion.Item eventKey={statusId} style={{ width: "100%" }}>
      <Accordion.Header className="p-0">
        <Stack direction="horizontal" gap={2}>
          <div>{data?.statusMap[statusId].name}</div>
          <div>{sum.toLocaleString("cs")}</div>
        </Stack>
      </Accordion.Header>
      <Accordion.Body>
        <Row>
          {itemList?.map((item) => {
            return (
              <TaskItem
                item={item}
                setTaskItemFormData={setTaskItemFormData}
                setTaskItemDeleteDialog={setTaskItemDeleteDialog}
              />
            );
          })}
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default StatusDetail;