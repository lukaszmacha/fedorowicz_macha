// libs
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import { StyleSheet, css } from 'aphrodite';

// local components
import NavbarComponent from '../components/utils/NavbarComponent';
import apiEndpoint from '../components/utils/ApiEndpoint';
import TimerComponent from '../components/utils/TimerComponent';
import ImageComponent from '../components/utils/ImageComponent';

// assets
import 'bootstrap/dist/css/bootstrap.min.css';
import placeholderImage from '../assets/images/placeholder.png';
// import OfferList from '../components/offer/OfferList'; to introduce further

const OfferPage = () => {
  const { id } = useParams();
  const [mainOffer, setMainOffer] = useState(null);
  //const [similarOffers, setSimilarOffers] = useState([]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(price);
};

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setMainOffer((await apiEndpoint.get(`/offers/${id}`)).data);
        //setSimilarOffers((await apiEndpoint.get('/offers')).data.results);
      } catch (error) {
        console.error(`Error fetching offer: ${error.message}`);
      }
    };

    fetchOffer();
  }, [id]);

  return (
    <div className="App">
      <NavbarComponent />
      <header className="App-header">
        <br />
        {mainOffer && (
            <div className="container d-flex justify-content-center" style={{ width: '80%' }}>
                <Card className={css(styles.mainCard)}>
                    <Card.Body>
                        <Row>
                            <Col md={7}>
                                <Card.Title className={css(styles.title)}>{mainOffer.id}</Card.Title>
                            </Col>
                            <Col md={2}>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)} style={{marginTop: '0.5rem'}}>
                                    {formatPrice(mainOffer.price)}
                                </Card.Text>
                            </Col>
                            <Col md={3}>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)} style={{marginTop: '0.5rem'}}>
                                    <TimerComponent targetTime={mainOffer.start_time} />
                                </Card.Text>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            {mainOffer.photos && (
                                <Col md={8}>
                                    <Row>
                                        <Col md={6}>
                                            <ImageComponent
                                                link={mainOffer.photos[0]}
                                                fallbackImage={placeholderImage}
                                                className={css(styles.firstImage)}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Row>
                                                <ImageComponent
                                                    link={mainOffer.photos[1]}
                                                    fallbackImage={placeholderImage}
                                                    className={css(styles.secondaryImage)}
                                                    style={{marginBottom: '1.5rem'}}
                                                />
                                                <ImageComponent
                                                    link={mainOffer.photos[2]}
                                                    fallbackImage={placeholderImage}
                                                    className={css(styles.secondaryImage)}
                                                />
                                            </Row>
                                        </Col>
                                        <Col md={3}>
                                            <Row>
                                                <ImageComponent
                                                    link={mainOffer.photos[3]}
                                                    fallbackImage={placeholderImage}
                                                    className={css(styles.secondaryImage)}
                                                    style={{marginBottom: '1.5rem'}}
                                                />
                                                <ImageComponent
                                                    link={mainOffer.photos[4]}
                                                    fallbackImage={placeholderImage}
                                                    className={css(styles.secondaryImage)}
                                                />
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            )}
                            <Col md={4}>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Brand: {mainOffer.brand}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Model: {mainOffer.model}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Generation: {mainOffer.generation}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Production year: {mainOffer.production_year}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Condition: {mainOffer.condition}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Body: {mainOffer.body_type}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Fuel: {mainOffer.fuel_type}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Place: {mainOffer.place}
                                </Card.Text>
                                <Card.Text className={css(styles.labelText, styles.offerTag, styles.adjustableText)}>
                                    Other: {mainOffer.other_info}
                                </Card.Text>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Card.Text className={css(styles.descriptionText, styles.adjustableText)}>
                                <u className={css(styles.adjustableLargeText)} 
                                     style={{fontWeight: 'bold', fontSize: '1.5rem'}}
                                >Description:</u><br/>
                                {mainOffer.description}
                            </Card.Text>
                        </Row>
                    </Card.Body>
                </Card>
                {/* <OfferList offers = {similarOffers} style={{ width: '50%' }}/> */}
            </div>
        )}
      </header>
    </div>
  );
};

export default OfferPage;

const styles = StyleSheet.create({
    mainCard: {
        marginBottom: '0',
        width: '100%',
        ':hover': {
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            transition: 'box-shadow 0.3s ease-in-out',
        },
    },
    title: {
        textAlign: 'left',
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    descriptionText: {
        whiteSpace: 'pre-line',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    firstImage: {
        height: '100%',
        objectFit: 'cover'
    },
    secondaryImage: {
        height: '50%',
        objectFit: 'cover'
    },
    offerTag: {
        color: '#6c757d',
        border: '1px solid',
        borderRadius: '.25rem',
        textAlign: 'center',
    },
    labelText: {
        marginBottom: '1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '1.15rem',
    },
    adjustableText: {
        '@media (min-width: 768px)': {
            fontSize: '0.5rem',
            marginBottom: '0.25rem',
        },
        '@media (min-width: 870px)': {
            fontSize: '0.75rem',
            marginBottom: '0.5rem',
        },
        '@media (min-width: 1300px)': {
            fontSize: '1rem',
            marginBottom: '0.75rem',
        },
        '@media (min-width: 1500px)': {
            fontSize: '1.15rem',
            marginBottom: '1rem',
        },
    },
    adjustableLargeText: {
        '@media (min-width: 768px)': {
            fontSize: '0.75rem',
            marginBottom: '0.5rem',
        },
        '@media (min-width: 870px)': {
            fontSize: '1rem',
            marginBottom: '0.75rem',
        },
        '@media (min-width: 1300px)': {
            fontSize: '1.15rem',
            marginBottom: '1rem',
        },
        '@media (min-width: 1500px)': {
            fontSize: '1.5rem',
            marginBottom: '1.25rem',
        },
    },
});