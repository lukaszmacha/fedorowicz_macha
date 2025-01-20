import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartingPage from './pages/StartingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import OfferPage from './pages/OfferPage';
import './App.css';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<StartingPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/sign-up" element={<SignUpPage/>} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/offer/:id" element={<OfferPage />} />
        </Routes>
    </Router>
  );
};

export default App;