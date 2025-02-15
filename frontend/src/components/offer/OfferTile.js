// libs
import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router-dom'

// local components
import TimerComponent from '../utils/TimerComponent'
import ImageComponent from '../utils/ImageComponent'

// assets
import placeholderImage from '../../assets/images/placeholder.png'

const Offer = ({
    id,
    price,
    brand,
    model,
    startTime,
    description,
    photosLinks,
    variant = 'row',
}) => {
    const title = `${id} - ${brand}, ${model}`

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(price)
    }

    const RowVariant = () => (
        <Card className={css(styles.offerTile)}>
            <Card.Body>
                <Row>
                    <Col md={3}>
                        <ImageComponent
                            link={photosLinks[0]}
                            fallbackImage={placeholderImage}
                            className={css(styles.firstImage)}
                        />
                    </Col>
                    <Col md={9}>
                        <Row>
                            <Col md={5} className='text-start'>
                                <Card.Title className={css(styles.labelText)}>
                                    {title}
                                </Card.Title>
                            </Col>
                            <Col md={3} className='text-start'>
                                <Card.Text
                                    className={css(
                                        styles.labelText,
                                        styles.offerTag,
                                        styles.adjustableText
                                    )}>
                                    {formatPrice(price)}
                                </Card.Text>
                            </Col>
                            <Col md={4} className='text-start'>
                                <Card.Text
                                    className={css(
                                        styles.labelText,
                                        styles.offerTag,
                                        styles.adjustableText
                                    )}>
                                    <TimerComponent targetTime={startTime} />
                                </Card.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-start'>
                                <Card.Text
                                    className={css(
                                        styles.descriptionLongText,
                                        styles.adjustableText
                                    )}>
                                    Description:
                                    <br />
                                    {description}
                                </Card.Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )

    const SquareVariant = () => (
        <Card className={css(styles.offerTile)}>
            <Card.Body className='d-flex flex-column'>
                <Row className='h-100 mb-2'>
                    <Col md={8}>
                        <ImageComponent
                            link={photosLinks[0]}
                            fallbackImage={placeholderImage}
                            className={css(styles.firstImage)}
                        />
                    </Col>
                    <Col md={4}>
                        <Row className='h-50'>
                            <ImageComponent
                                link={photosLinks[1]}
                                fallbackImage={placeholderImage}
                                className={css(styles.secondaryImage)}
                            />
                        </Row>
                        <Row className='h-50'>
                            <ImageComponent
                                link={photosLinks[2]}
                                fallbackImage={placeholderImage}
                                className={css(styles.secondaryImage)}
                            />
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col md={5} className='text-start'>
                                <Card.Title className={css(styles.labelText)}>
                                    {title}
                                </Card.Title>
                            </Col>
                            <Col md={3} className='text-start'>
                                <Card.Text
                                    className={css(
                                        styles.labelText,
                                        styles.offerTag,
                                        styles.adjustableText
                                    )}>
                                    {formatPrice(price)}
                                </Card.Text>
                            </Col>
                            <Col md={4} className='text-start'>
                                <Card.Text
                                    className={css(
                                        styles.labelText,
                                        styles.offerTag,
                                        styles.adjustableText
                                    )}>
                                    <TimerComponent targetTime={startTime} />
                                </Card.Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className='text-start'>
                        <Card.Text
                            className={css(
                                styles.descriptionShortText,
                                styles.adjustableText
                            )}>
                            Description:
                            <br />
                            {description}
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )

    return (
        <Link to={`/offer/${id}`} style={{ textDecoration: 'none' }}>
            {variant === 'row' ? <RowVariant /> : <SquareVariant />}
        </Link>
    )
}

export default Offer

// Styles
const styles = StyleSheet.create({
    offerTile: {
        marginBottom: '0',
        maxWidth: '800px',
        ':hover': {
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            transition: 'box-shadow 0.3s ease-in-out',
        },
    },
    descriptionLongText: {
        whiteSpace: 'pre-line',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: 4,
    },
    descriptionShortText: {
        whiteSpace: 'pre-line',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: 3,
    },
    firstImage: {
        width: '100%',
        objectFit: 'cover',
    },
    secondaryImage: {
        width: '100%',
        height: '90%',
        objectFit: 'cover',
    },
    offerTag: {
        color: '#6c757d',
        border: '1px solid',
        borderRadius: '.25rem',
        textAlign: 'center',
    },
    labelText: {
        marginBottom: '0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    adjustableText: {
        fontSize: '16px',
        '@media (min-width: 768px)': {
            fontSize: '12px',
        },
        '@media (min-width: 992px)': {
            fontSize: '14px',
        },
        '@media (min-width: 1200px)': {
            fontSize: '16px',
        },
    },
})
