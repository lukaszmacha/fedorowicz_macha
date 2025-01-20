// libs
import React from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/" className="mx-3">CarBid</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="d-flex justify-content-end">
        <Nav>
          <Nav.Link href="sign-up" className="mx-2">Sign-up</Nav.Link>
          <Nav.Link href="login" className="mx-2">Login</Nav.Link>
          <Nav.Link href="auctions" className="mx-2">Auctions</Nav.Link>
          <Nav.Link href="help" className="mx-2">Help</Nav.Link>
        </Nav>
        <Form className="ms-auto d-flex">
          <FormControl type="text" placeholder="Search" className="me-2" />
          <Button variant="outline-light" className="mx-2">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;