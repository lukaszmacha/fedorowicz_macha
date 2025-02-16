// libs
import React, { useState } from 'react'
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap'

// local components
import NavbarComponent from '../components/utils/NavbarComponent'
import apiEndpoint from '../components/utils/ApiEndpoint'

// assets
import 'bootstrap/dist/css/bootstrap.min.css'

const AddOfferPage = () => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        generation: '',
        production_year: '',
        price: '',
        condition: 'NOWY',
        body_type: 'SEDAN',
        fuel_type: 'BENZYNA',
        description: '',
        other_info: '',
        place: '',
        photos: [],
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleFileChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            photos: Array.from(e.target.files),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await apiEndpoint.post('/offer/create/', formData)
            if (response.status === 201 && response.data.payment_link) {
                window.location.href = response.data.payment_link.url
            } else {
                console.error('Payment link not received from server')
            }
        } catch (error) {
            console.error('Error creating offer:', error)
        }
    }

    return (
        <div className='App'>
            <NavbarComponent />
            <header className='App-header'>
                <h1>Login</h1>
                <Container className='mt-4'>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    {/* Left Column - Form Fields */}
                                    <Col md={8}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Brand
                                                    </Form.Label>
                                                    <Form.Control
                                                        type='text'
                                                        name='brand'
                                                        value={formData.brand}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Model
                                                    </Form.Label>
                                                    <Form.Control
                                                        type='text'
                                                        name='model'
                                                        value={formData.model}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Generation
                                                    </Form.Label>
                                                    <Form.Control
                                                        type='text'
                                                        name='generation'
                                                        value={
                                                            formData.generation
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Production Year
                                                    </Form.Label>
                                                    <Form.Control
                                                        type='number'
                                                        name='production_year'
                                                        value={
                                                            formData.production_year
                                                        }
                                                        onChange={handleChange}
                                                        min={1900}
                                                        max={new Date().getFullYear()}
                                                        required
                                                    />
                                                    <Form.Text className='text-muted'>
                                                        Year must be between
                                                        1900 and{' '}
                                                        {new Date().getFullYear()}
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Price
                                                    </Form.Label>
                                                    <Form.Control
                                                        type='number'
                                                        step='0.01'
                                                        name='price'
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        min={1000.0}
                                                        required
                                                    />
                                                    <Form.Text className='text-muted'>
                                                        Price must be at least
                                                        1000.00
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Condition
                                                    </Form.Label>
                                                    <Form.Select
                                                        name='condition'
                                                        value={
                                                            formData.condition
                                                        }
                                                        onChange={handleChange}>
                                                        <option value='NOWY'>
                                                            New
                                                        </option>
                                                        <option value='UZYWANY'>
                                                            Used
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Body Type
                                                    </Form.Label>
                                                    <Form.Select
                                                        name='body_type'
                                                        value={
                                                            formData.body_type
                                                        }
                                                        onChange={handleChange}>
                                                        <option value='SEDAN'>
                                                            Sedan
                                                        </option>
                                                        <option value='KOMBI'>
                                                            Kombi
                                                        </option>
                                                        <option value='SUV'>
                                                            SUV
                                                        </option>
                                                        <option value='HATCHBACK'>
                                                            Hatchback
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>
                                                        Fuel Type
                                                    </Form.Label>
                                                    <Form.Select
                                                        name='fuel_type'
                                                        value={
                                                            formData.fuel_type
                                                        }
                                                        onChange={handleChange}>
                                                        <option value='BENZYNA'>
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

                                        <Form.Group className='mb-3'>
                                            <Form.Label>Place</Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='place'
                                                value={formData.place}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className='mb-3'>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                rows={3}
                                                name='description'
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className='mb-3'>
                                            <Form.Label>
                                                Other Information
                                            </Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                rows={2}
                                                name='other_info'
                                                value={formData.other_info}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Right Column - Photos */}
                                    <Col md={4}>
                                        <Card className='p-3'>
                                            <Form.Group className='mb-3'>
                                                <Form.Label>Photos</Form.Label>
                                                <Form.Control
                                                    type='file'
                                                    multiple
                                                    onChange={handleFileChange}
                                                    accept='image/*'
                                                />
                                            </Form.Group>
                                            {formData.photos.length > 0 && (
                                                <div className='mt-3'>
                                                    <h6>Selected Photos:</h6>
                                                    {Array.from(
                                                        formData.photos
                                                    ).map((photo, index) => (
                                                        <div
                                                            key={index}
                                                            className='mb-2'>
                                                            {photo.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                <Button
                                    variant='primary'
                                    type='submit'
                                    className='w-100 mt-3'>
                                    Create Offer
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </header>
        </div>
    )
}

export default AddOfferPage
