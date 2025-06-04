import React from 'react';
// Import routing components
import { Routes, Route } from 'react-router-dom'; 

// Import page components
import LandingPage from './pages/LandingPage';
import PsychologyPage from './pages/PsychologyPage';
import SportsPage from './pages/SportsPage';
import GamblingPage from './pages/GamblingPage';
import MusicPage from './pages/MusicPage';

import './App.css';

function App() {
  // Define application routes
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/psychology" element={<PsychologyPage />} />
      <Route path="/sports" element={<SportsPage />} />
      <Route path="/gambling" element={<GamblingPage />} />
      <Route path="/music" element={<MusicPage />} />
      {/* Add other routes here later, e.g., specific topic pages */}
    </Routes>
  );
}

export default App;
