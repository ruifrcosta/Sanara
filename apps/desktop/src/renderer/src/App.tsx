import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import HealthProfile from './pages/HealthProfile';
import Medications from './pages/Medications';
import Records from './pages/Records';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/health-profile" element={<HealthProfile />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/records" element={<Records />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 