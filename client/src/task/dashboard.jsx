import Container from "react-bootstrap/esm/Container";
import TaskListProvider from "./task-list-provider";
import DashboardContent from "./dashboard-content";

function Dashboard() {
  return (
    <Container>
      <TaskListProvider>
        <DashboardContent />
      </TaskListProvider>
    </Container>
  );
}

export default Dashboard;