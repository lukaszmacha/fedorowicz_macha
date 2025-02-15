// libs
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// local components
import StartingPage from './pages/StartingPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OfferPage from './pages/OfferPage'
import AddOfferPage from './pages/AddOfferPage'
import OfferBrowserPage from './pages/OfferBroswerPage'
import NotAccessibleForUnauthorized from './pages/NotAccessibleForUnauthorized'

// assets
import './App.css'

const App = () => {
    const isAuth = localStorage.getItem('accessToken') !== null

    return (
        <Router>
            <Routes>
                <Route path='/' element={<StartingPage />} />
                <Route path='/offer/:id' element={<OfferPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/sign-up' element={<SignUpPage />} />
                <Route path='/offer-browser' element={<OfferBrowserPage />} />
                {(isAuth && (
                    <>
                        <Route
                            path='/offer/create/'
                            element={<AddOfferPage />}
                        />
                    </>
                )) || (
                    <>
                        <Route
                            path='/offer/create/'
                            element={<NotAccessibleForUnauthorized />}
                        />
                    </>
                )}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default App
