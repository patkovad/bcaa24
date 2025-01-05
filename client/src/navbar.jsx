import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import Icon from '@mdi/react';
import { mdiHome } from '@mdi/js';

function NavBar() {
    const navigate = useNavigate();
  
    return (
      <Navbar
        expand="md"
        bg="info"
        data-bs-theme="dark"
        fixed="top"
        collapseOnSelect={true}
      >
        <Container>
          <Navbar.Brand onClick={() => navigate("")} style={{ marginTop: "-5px" }}>
            <Icon path={mdiHome} size={1} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" size="sm" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                onClick={() => navigate("")}
                active={window.location.pathname === "/"}
                eventKey="dashboard"
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
              onClick={() => navigate("statusList")}
              active={window.location.pathname === "/statusList"}
              eventKey="statusList"
            >
              Status
            </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  
  export default NavBar;