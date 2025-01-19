// libs
import React from 'react';

// local components
import NavbarComponent from '../components/utils/NavbarComponent';

// assets
import 'bootstrap/dist/css/bootstrap.min.css';

const NotFoundPage = () => {


  return (
    <div className="App">
      <NavbarComponent />
      <header className="App-header">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </header>
    </div>
  );
};

export default NotFoundPage;