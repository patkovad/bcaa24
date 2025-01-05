import Container from "react-bootstrap/esm/Container";
import StatusListProvider from "./status-list-provider";
import StatusListContent from "./status-list-content";

function StatusList() {
  return (
    <Container>
      <StatusListProvider>
        <StatusListContent />
      </StatusListProvider>
    </Container>
  );
}

export default StatusList;