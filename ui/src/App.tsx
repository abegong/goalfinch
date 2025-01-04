import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Settings from './components/pages/Settings';
import Dashboard from './components/pages/Dashboard';
import Home from './components/pages/Home';
import ConfigureSlides from './components/pages/ConfigureSlides';
import { SlideProvider } from './context/SlideContext';
import './App.css';

function App() {
  return (
    <Router>
      <SlideProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/goals" element={<ConfigureSlides />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </SlideProvider>
    </Router>
  );
}

export default App;
