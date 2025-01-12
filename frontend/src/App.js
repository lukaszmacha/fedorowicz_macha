import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="home" className="mx-3">CarBid</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="d-flex justify-content-end">
          <Nav>
            <Nav.Link href="home" className="mx-2">Home</Nav.Link>
            <Nav.Link href="about" className="mx-2">About</Nav.Link>
            <Nav.Link href="contact" className="mx-2">Contact</Nav.Link>
          </Nav>
          <Form className="ms-auto d-flex">
            <FormControl type="text" placeholder="Search" className="me-2" />
            <Button variant="outline-light" className="mx-2">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <header className="App-header">
        <h1>Welcome to My Project</h1>
        <p>
          This is a simple React frontend connected to your Django backend.
        </p>
      </header>
    </div>
  );
}

export default App;