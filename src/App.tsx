/**
 * Main application component that sets up routing and renders the appropriate pages.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { StatsPage } from './pages/StatsPage';
import { AboutPage } from './pages/AboutPage';

/**
 * App component that sets up the application routing
 * @returns {JSX.Element} The rendered application with routing
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App; 
