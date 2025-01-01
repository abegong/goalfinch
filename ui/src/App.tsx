import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';
import './theme.css';

// Placeholder components for each route
const Dashboard = () => <div>Dashboard Page</div>;
const Goals = () => <div>Goals Page</div>;
const Events = () => <div>Events Page</div>;
const Reports = () => <div>Reports Page</div>;
const Input = () => <div>Input Page</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/input" element={<Input />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
