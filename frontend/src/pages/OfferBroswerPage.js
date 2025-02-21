// libs
import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap'

// local components
import NavbarComponent from '../components/utils/NavbarComponent'
import OfferList from '../components/offer/OfferList'
import apiEndpoint from '../components/utils/ApiEndpoint'

// assets
import 'bootstrap/dist/css/bootstrap.min.css'

const OfferBrowserPage = () => {
    const currentYear = new Date().getFullYear()
    const [offers, setOffers] = useState([])
    const [errors, setErrors] = useState({
        yearRange: '',
        priceRange: '',
    })
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        price_from: '',
        price_to: '',
        year_from: '',
        year_to: '',
        condition: '',
        body_type: '',
        fuel_type: '',
    })

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prevFilters) => {
            const newFilters = {
                ...prevFilters,
                [name]: value,
            }

            // Validate year range
            if (name === 'year_from' || name === 'year_to') {
                if (newFilters.year_from && newFilters.year_to) {
                    setErrors((prev) => ({
                        ...prev,
                        yearRange:
                            Number(newFilters.year_from) >
                            Number(newFilters.year_to)
                                ? 'Year From cannot be greater than Year To'
                                : '',
                    }))
                }
            }

            // Validate price range
            if (name === 'price_from' || name === 'price_to') {
                if (newFilters.price_from && newFilters.price_to) {
                    setErrors((prev) => ({
                        ...prev,
                        priceRange:
                            Number(newFilters.price_from) >
                            Number(newFilters.price_to)
                                ? 'Price From cannot be greater than Price To'
                                : '',
                    }))
                }
            }

            return newFilters
        })
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        // Validate before submitting
        if (errors.yearRange || errors.priceRange) {
            return
        }

        try {
            // Create query string from non-empty filters
            const queryParams = Object.entries(filters)
                .filter(([_, value]) => value !== '')
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&')

            const response = await apiEndpoint.get(`/offers/?${queryParams}`)
            setOffers(response.data.results)
        } catch (error) {
            console.error('Error fetching filtered offers:', error)
        }
    }

    useEffect(() => {
        const performSearch = async (searchString) => {
            try {
                const words = searchString.trim().split(/\s+/)
                const searchPromises = words.flatMap((word) => [
                    apiEndpoint.get(
                        `/offers/?brand=${encodeURIComponent(word)}`
                    ),
                    apiEndpoint.get(
                        `/offers/?brand=${encodeURIComponent(word)}`
                    ),
                ])

                const responses = await Promise.all(searchPromises)
                const allOffers = responses
                    .flatMap((response) => response.data.results)
                    .reduce((unique, offer) => {
                        if (!unique.some((item) => item.id === offer.id)) {
                            unique.push(offer)
                        }
                        return unique
                    }, [])

                setOffers(allOffers)
            } catch (error) {
                console.error('Search error:', error)
                setOffers([])
            }
        }

        const fetchOffers = async () => {
            try {
                // Check for search query
                const searchQuery = sessionStorage.getItem('searchQuery')
                if (searchQuery) {
                    await performSearch(searchQuery)
                    // Clear the query after search
                    sessionStorage.removeItem('searchQuery')
                } else {
                    // Fetch all offers if no search query
                    const response = await apiEndpoint.get('/offers/')
                    setOffers(response.data.results)
                }
            } catch (error) {
                console.error('Error fetching offers:', error)
            }
        }

        fetchOffers()
    }, [])

    return (
        <div className='App'>
            <NavbarComponent />
            <header className='App-header'>
                <Container className='mt-4'>
                    <Card className='mb-4'>
                        <Card.Body>
                            <Form onSubmit={handleSearch}>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Brand</Form.Label>
                                            <Form.Control
                                                placeholder='e.g. BMW'
                                                type='text'
                                                name='brand'
                                                value={filters.brand}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Model</Form.Label>
                                            <Form.Control
                                                placeholder='e.g. i8'
                                                type='text'
                                                name='model'
                                                value={filters.model}
                                                onChange={handleFilterChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Condition</Form.Label>
                                            <Form.Select
                                                name='condition'
                                                value={filters.condition}
                                                onChange={handleFilterChange}>
                                                <option value=''>Any</option>
                                                <option value='NEW'>New</option>
                                                <option value='USED'>
                                                    Used
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={3}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Price From</Form.Label>
                                            <Form.Control
                                                placeholder='e.g. 5000'
                                                type='number'
                                                name='price_from'
                                                value={filters.price_from}
                                                onChange={handleFilterChange}
                                                min={1000}
                                                isInvalid={!!errors.priceRange}
                                            />
                                            <Form.Text className='text-muted'>
                                                Minimum price: 1000
                                            </Form.Text>
                                            {errors.priceRange && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.priceRange}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Price To</Form.Label>
                                            <Form.Control
                                                placeholder='e.g. 25000'
                                                type='number'
                                                name='price_to'
                                                value={filters.price_to}
                                                onChange={handleFilterChange}
                                                min={1000}
                                                isInvalid={!!errors.priceRange}
                                            />
                                            {errors.priceRange && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.priceRange}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Year From</Form.Label>
                                            <Form.Control
                                                placeholder='e.g. 2003'
                                                type='number'
                                                name='year_from'
                                                value={filters.year_from}
                                                onChange={handleFilterChange}
                                                min={1900}
                                                max={currentYear}
                                                isInvalid={!!errors.yearRange}
                                            />
                                            <Form.Text className='text-muted'>
                                                Year minimum is 1900
                                            </Form.Text>
                                            {errors.yearRange && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.yearRange}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Year To</Form.Label>
                                            <Form.Control
                                                placeholder='e.g. 2012'
                                                type='number'
                                                name='year_to'
                                                value={filters.year_to}
                                                onChange={handleFilterChange}
                                                min={1900}
                                                max={currentYear}
                                                isInvalid={!!errors.yearRange}
                                            />
                                            <Form.Text className='text-muted'>
                                                Year maximum is {currentYear}
                                            </Form.Text>
                                            {errors.yearRange && (
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.yearRange}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Body Type</Form.Label>
                                            <Form.Select
                                                name='body_type'
                                                value={filters.body_type}
                                                onChange={handleFilterChange}>
                                                <option value=''>Any</option>
                                                <option value='SEDAN'>
                                                    Sedan
                                                </option>
                                                <option value='COMBI'>
                                                    Estate
                                                </option>
                                                <option value='SUV'>SUV</option>
                                                <option value='HATCHBACK'>
                                                    Hatchback
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Fuel Type</Form.Label>
                                            <Form.Select
                                                name='fuel_type'
                                                value={filters.fuel_type}
                                                onChange={handleFilterChange}>
                                                <option value=''>Any</option>
                                                <option value='PETROL'>
                                                    Petrol
                                                </option>
                                                <option value='DIESEL'>
                                                    Diesel
                                                </option>
                                                <option value='HYBRID'>
                                                    Hybrid
                                                </option>
                                                <option value='ELECTRIC'>
                                                    Electric
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button
                                    variant='primary'
                                    type='submit'
                                    className='w-100'>
                                    Search
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <OfferList offers={offers} />
                    </div>
                </Container>
            </header>
        </div>
    )
}

export default OfferBrowserPage
