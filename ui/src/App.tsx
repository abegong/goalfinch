import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import Home from './components/Home';
import { SlideProvider } from './context/SlideContext';
import './App.css';

function App() {
  return (
    <Router>
      <SlideProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </SlideProvider>
    </Router>
  );
}

export default App;
