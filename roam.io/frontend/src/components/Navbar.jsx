// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
} from "react-bootstrap";
import mainLogo from "../assets/main_logo.png";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={mainLogo}
            alt="Logo"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
            className="me-2"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            {/* Always-visible links */}
            <Nav.Link as={Link} to="/survey">Survey</Nav.Link>
            <Nav.Link as={Link} to="/hotels">Hotels</Nav.Link>
            <Nav.Link as={Link} to="/flights">Flights</Nav.Link>

            {/* Auth-dependent section */}
            {!user ? (
              <Button
                as={Link}
                to="/login"
                variant="primary"
                className="ms-3"
              >
                Sign in / Create Account
              </Button>
            ) : (
              <NavDropdown
                title={user.email}
                id="user-dropdown"
                align="end"
                className="ms-3"
              >
                <NavDropdown.Item as={Link} to="/user">
                  Account
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/plans">
                  My Plans
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/calendar">
                  My Calendar
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item onClick={handleLogout}>
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
