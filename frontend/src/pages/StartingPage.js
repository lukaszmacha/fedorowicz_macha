import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Offer } from '../components/offer/OfferTile';
import { OfferList } from '../components/offer/OfferList';

function StartingPage() {
  const [offerValues, setOfferValues] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:1331/api/offers/')
      .then(response => {
        if (Array.isArray(response.data.results)) {
          setOfferValues(response.data.results.slice(0, 4));
        } else {
          console.error('Expected an array but got:', response.data.results);
        }
      })
      .catch(error => {
        console.error('Error fetching offers:', error);
      });
  }, []);

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="home" className="mx-3">CarBid</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="d-flex justify-content-end">
          <Nav>
            <Nav.Link href="home" className="mx-2">Sign-up</Nav.Link>
            <Nav.Link href="about" className="mx-2">Login</Nav.Link>
            <Nav.Link href="contact" className="mx-2">Auctions</Nav.Link>
            <Nav.Link href="contact" className="mx-2">Help</Nav.Link>
          </Nav>
          <Form className="ms-auto d-flex">
            <FormControl type="text" placeholder="Search" className="me-2" />
            <Button variant="outline-light" className="mx-2">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <header className="App-header">
        <h1>Welcome to CarBid!</h1>
        <p className="fs-4">Find and bid on your dream car today.</p>
        <br/>
        <div className="container px-5">
          <div className="row justify-content-center mb-4">
            <div className="col-12">
              <h1 className="text-center">Top offers</h1>
            </div>
          </div>
          <div className="row g-3" style={{ height: '500px' }}>
            <div className="col-md-6">
              <div className="h-100">
                {offerValues.length > 0 && (
                  <Offer
                    id={offerValues[0].id}
                    title={offerValues[0].id}
                    price={offerValues[0].price}
                    startTime={offerValues[0].start_time}
                    // description={offerValues[0].description}
                    description="Main offer description. Very nice car please buy it. I actually need to make this longer so I can see how it looks like when it wraps around to the next line. Maybe even a third line."
                    photosLinks={offerValues[0].photos}
                    variant='square'
                  />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="h-100">
                <OfferList offers={offerValues.slice(1)} />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default StartingPage;