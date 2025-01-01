import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

// Placeholder components for each route
const Home = () => <div>Home Page</div>;
const Goals = () => <div>Goals Page</div>;
const Events = () => <div>Events Page</div>;
const Reports = () => <div>Reports Page</div>;
const Input = () => <div>Input Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/input" element={<Input />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
