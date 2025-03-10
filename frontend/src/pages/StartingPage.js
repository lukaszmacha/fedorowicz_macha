// libs
import React, { useState, useEffect } from 'react'

// local components
import Offer from '../components/offer/OfferTile'
import OfferList from '../components/offer/OfferList'
import NavbarComponent from '../components/utils/NavbarComponent'
import apiEndpoint from '../components/utils/ApiEndpoint'

// assets
import 'bootstrap/dist/css/bootstrap.min.css'

const StartingPage = () => {
    const [offerValues, setOfferValues] = useState([])

    useEffect(() => {
        apiEndpoint
            .get('/offers/')
            .then((response) => {
                if (Array.isArray(response.data.results)) {
                    setOfferValues(response.data.results.slice(0, 4))
                } else {
                    console.error(
                        'Expected an array but got:',
                        response.data.results
                    )
                }
            })
            .catch((error) => {
                console.error('Error fetching offers:', error)
            })
    }, [])

    return (
        <div className='App'>
            <NavbarComponent />
            <header className='App-header'>
                <h1>Welcome to CarBid!</h1>
                <p className='fs-4'>Find and bid on your dream car today.</p>
                <br />
                <div className='container px-5'>
                    <div className='row justify-content-center mb-4'>
                        <div className='col-12'>
                            <h1 className='text-center'>Top offers</h1>
                        </div>
                    </div>
                    <div className='row g-3' style={{ height: '500px' }}>
                        <div className='col-md-6'>
                            <div className='h-100'>
                                {offerValues.length > 0 && (
                                    <Offer
                                        id={offerValues[0].id}
                                        price={offerValues[0].price}
                                        brand={offerValues[0].brand}
                                        model={offerValues[0].model}
                                        startTime={offerValues[0].start_time}
                                        description={offerValues[0].description}
                                        photosLinks={offerValues[0].photos}
                                        variant='square'
                                    />
                                )}
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='h-100'>
                                <OfferList offers={offerValues.slice(1)} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default StartingPage
