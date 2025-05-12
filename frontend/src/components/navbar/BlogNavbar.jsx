import React from "react";
import { Button, Container, Navbar, Form, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import GoogleLogin from "../../auth/GoogleLogin";
import Logout from "../../auth/Logout";
import "./styles.css";

const NavBar = ({ token, setToken, searchQuery, onSearchChange }) => {
  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Cerca un articolo"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)} 
            className="me-2"
            data-testid="search-input"
          />
        </Form>

        <Nav className="align-items-center">
          {!token ? (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
              <GoogleLogin />
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/me">Profilo</Nav.Link>
              <Button as={Link} to="/new" className="bg-dark ms-2">
                + Nuovo Articolo
              </Button>
              <Logout setToken={setToken} />
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
