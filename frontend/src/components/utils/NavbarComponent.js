// libs
import React, { useState } from 'react'
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom' // Add useLocation

// local components
import handleLogout from './LogoutAction'

const NavbarComponent = () => {
    const isAuth = localStorage.getItem('accessToken') !== null
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const location = useLocation() // Add this hook

    const handleSearch = (e) => {
        e.preventDefault()

        // Store search query
        sessionStorage.setItem('searchQuery', searchQuery)

        // If already on offer-browser, just trigger a re-render
        if (location.pathname === '/offer-browser') {
            // Force OfferBrowserPage to re-fetch with new search
            window.location.reload()
        } else {
            // Navigate to offer-browser if on a different page
            navigate('/offer-browser')
        }
    }

    return (
        <Navbar bg='dark' variant='dark' expand='lg'>
            <Navbar.Brand as={Link} to='/' className='mx-3'>
                CarBid
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse
                id='basic-navbar-nav'
                className='d-flex justify-content-end'>
                <Nav>
                    {(!isAuth && (
                        <>
                            <Nav.Link as={Link} to='/sign-up' className='mx-2'>
                                Sign-up
                            </Nav.Link>
                            <Nav.Link as={Link} to='/login' className='mx-2'>
                                Login
                            </Nav.Link>
                        </>
                    )) || (
                        <>
                            <Nav.Link
                                onClick={() => handleLogout(navigate)}
                                className='mx-2'>
                                Log out
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to='/offer/create'
                                className='mx-2'>
                                Add offer
                            </Nav.Link>
                        </>
                    )}
                    <Nav.Link as={Link} to='/offer-browser' className='mx-2'>
                        Browse offers
                    </Nav.Link>
                    <Nav.Link as={Link} to='/help' className='mx-2'>
                        Help
                    </Nav.Link>
                </Nav>
                <Form className='ms-auto d-flex' onSubmit={handleSearch}>
                    <FormControl
                        type='text'
                        placeholder='Search (e.g. BMW X1)'
                        className='me-2'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        variant='outline-light'
                        type='submit'
                        className='mx-2'>
                        Search
                    </Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavbarComponent
