// libs
import React, { useState } from 'react'
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap'

// local components
import NavbarComponent from '../components/utils/NavbarComponent'
import apiEndpoint from '../components/utils/ApiEndpoint'

// assets
import 'bootstrap/dist/css/bootstrap.min.css'

// constants
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const MAX_TOTAL_SIZE = 10 * 1024 * 1024 // 10MB in bytes

const AddOfferPage = () => {
    const [error, setError] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        generation: '',
        production_year: '',
        price: '',
        condition: 'NEW',
        body_type: 'SEDAN',
        fuel_type: 'PETROL',
        description: '',
        other_info: '',
        place: '',
        photos: [],
        start_time: new Date().toISOString().slice(0, 16), // Current time in format YYYY-MM-DDTHH:mm
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        const totalSize = files.reduce((acc, file) => acc + file.size, 0)

        // Validate individual file sizes
        const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE)
        if (oversizedFiles.length > 0) {
            setError(`Some files are too large. Maximum size per file is 5MB`)
            return
        }

        // Validate total size
        if (totalSize > MAX_TOTAL_SIZE) {
            setError(`Total file size exceeds 10MB limit`)
            return
        }

        setFormData({
            ...formData,
            photos: files,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsUploading(true)

        const startTime = new Date(formData.start_time)
        const now = new Date()
        if (startTime <= now) {
            setError('Start time must be in the future')
            setIsUploading(false)
            return
        }

        try {
            const formDataToSend = new FormData()

            // Add regular fields including start_time
            Object.keys(formData).forEach((key) => {
                if (key !== 'photos') {
                    // Convert start_time to ISO string
                    const value =
                        key === 'start_time'
                            ? new Date(formData[key]).toISOString()
                            : formData[key]
                    formDataToSend.append(key, value)
                }
            })

            await Promise.all(
                formData.photos.map(async (photo) => {
                    formDataToSend.append('photos', photo)
                })
            )

            const response = await apiEndpoint.post(
                '/offer/create/',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            if (response.status === 201 && response.data.payment_link) {
                window.location.href = response.data.payment_link.url
            } else {
                setError('Payment link not received from server')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating offer')
        } finally {
            setIsUploading(false)
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
                                                        <option value='NEW'>
                                                            New
                                                        </option>
                                                        <option value='USED'>
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
                                                        <option value='COMBI'>
                                                            Estate
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

                                        <Form.Group className='mb-3'>
                                            <Form.Label>
                                                Auction Start Time
                                            </Form.Label>
                                            <Form.Control
                                                type='datetime-local'
                                                name='start_time'
                                                value={formData.start_time}
                                                onChange={handleChange}
                                                min={new Date()
                                                    .toISOString()
                                                    .slice(0, 16)}
                                                required
                                            />
                                            <Form.Text className='text-muted'>
                                                Select when the auction should
                                                start. Must be in the future.
                                            </Form.Text>
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

                                {error && (
                                    <Alert variant='danger' className='mt-3'>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    variant='primary'
                                    type='submit'
                                    className='w-100 mt-3'
                                    disabled={isUploading}>
                                    {isUploading
                                        ? 'Creating Offer...'
                                        : 'Create Offer'}
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
