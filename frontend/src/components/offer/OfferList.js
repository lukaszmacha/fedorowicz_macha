// libs
import React from 'react'

// local components
import Offer from './OfferTile'

const OfferList = ({ offers }) => (
    <div className='d-flex flex-column gap-3'>
        {offers.map((offer, index) => (
            <Offer
                key={index}
                id={offer.id}
                price={offer.price}
                brand={offer.brand}
                model={offer.model}
                startTime={offer.start_time}
                description={offer.description}
                photosLinks={offer.photos}
            />
        ))}
    </div>
)

export default OfferList
