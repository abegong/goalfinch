import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/pages/Dashboard';
import Home from './components/pages/Home';
import ConfigureSlides from './components/pages/ConfigureSlides';
import ConfigureConnections from './components/pages/ConfigureConnections';
import { ConfigProvider } from './context/ConfigContext';
import './App.css';

function App() {
  return (
    <Router>
      <ConfigProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/slides" element={<ConfigureSlides />} />
            <Route path="/connections" element={<ConfigureConnections />} />
          </Routes>
        </Layout>
      </ConfigProvider>
    </Router>
  );
}

export default App;
