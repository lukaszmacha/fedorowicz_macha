// libs
import React from 'react';

// local components
import Offer from './OfferTile';

const OfferList = ({ offers }) => (
  <div className="d-flex flex-column gap-3">
    {offers.map((offer, index) => (
      <Offer 
        key={index}
        id={offer.id}
        title={offer.id}
        price={offer.price}
        startTime={offer.start_time}
        // description={offer.description}
        description="Main offer description. Very nice car please buy it. I actually need to make this longer so I can see how it looks like when it wraps around to the next line. Maybe even a third line."
        photosLinks={offer.photos}
      />
    ))}
  </div>
);

export default OfferList;
