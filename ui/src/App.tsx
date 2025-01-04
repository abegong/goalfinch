import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/pages/Dashboard';
import Home from './components/pages/Home';
import ConfigureSlides from './components/pages/ConfigureSlides';
import ConfigureConnections from './components/pages/ConfigureConnections';
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
            <Route path="/settings" element={<ConfigureConnections />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </SlideProvider>
    </Router>
  );
}

export default App;
