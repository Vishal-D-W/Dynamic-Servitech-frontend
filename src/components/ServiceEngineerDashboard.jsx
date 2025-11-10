import React, { useState } from 'react';
import Navbar from './Navbar';
import CalculatorTab from './CalculatorTab';
import '../styles/Dashboard.css';

const ServiceEngineerDashboard = () => {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="service-engineer-content">
          <CalculatorTab />
        </div>
      </div>
    </div>
  );
};

export default ServiceEngineerDashboard;
