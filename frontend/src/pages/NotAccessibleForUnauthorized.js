// libs
import React from 'react'

// local components
import NavbarComponent from '../components/utils/NavbarComponent'

// assets
import 'bootstrap/dist/css/bootstrap.min.css'

const NotAccessibleForUnauthorized = () => {
    return (
        <div className='App'>
            <NavbarComponent />
            <header className='App-header'>
                <h1>401 - Unauthorized Access</h1>
                <p>You must be logged in to access this resource.</p>
            </header>
        </div>
    )
}

export default NotAccessibleForUnauthorized
