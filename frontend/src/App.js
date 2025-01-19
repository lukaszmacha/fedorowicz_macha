import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartingPage from './pages/StartingPage';
import './App.css';

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<StartingPage/>} />
        </Routes>
    </Router>
  );
};

export default App;