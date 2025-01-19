// libs
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

const ImageComponent = ({ link, fallbackImage, ...props }) => {
    const [src, setSrc] = useState(link || fallbackImage);

    const handleError = () => {
        setSrc(fallbackImage);
    };

    return (
        <Card.Img 
            src={src} 
            onError={handleError} 
            {...props} 
        />
    );
};

export default ImageComponent;