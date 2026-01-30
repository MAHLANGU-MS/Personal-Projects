import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { FocusDashboard } from './components/Analytics/FocusDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            <Routes>
              <Route path="/" element={<FocusDashboard />} />
              {/* Add other routes here as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;