import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Assuming this contains styles for the sidebar
import jwtDecode from "jwt-decode";


const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const casesResponse = await axios.get('/api/cases');
        setCases(casesResponse.data);
        const alertsResponse = await axios.get('/api/alerts');
        setAlerts(alertsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          ...decoded.user,
          name: decoded.user.name || decoded.user.email.split('@')[0],
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading user data...</div>; // Or a loading spinner
  }

  return (
    <div className="dashboard-wrapper">
      

      <div className={`dashboard ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>
























        
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <ul className="sidebar-menu">
            <li><Link to="appointments"><i className="fas fa-calendar-alt"></i> Appointments</Link></li>
            <li><Link to="book-appointment"><i className="fas fa-calendar-check"></i> Book Appointment</Link></li>
            <li><Link to="chatbot"><i className="fas fa-comments"></i> AI Multilingual Chatbot</Link></li>
            {/* <li><Link to="features"><i className="fas fa-bell"></i> Health Chatbot Assistant</Link></li> */}
            <li><Link to="symptom-checker"><i className="fas fa-stethoscope"></i> AI Disease Detection</Link></li>
            <li><Link to="monitoring-dashboard"><i className="fas fa-tachometer-alt"></i> AI City Monitoring</Link></li>
            <li><Link to="bmi-calculator"><i className="fas fa-weight"></i> BMI Calculator</Link></li>
            <li><Link to="family-health"><i className="fas fa-users"></i> Family Health Card</Link></li>
            <li><Link to="prescription-recognition"><i className="fas fa-prescription"></i> Prescription Recognition</Link></li>
            {/* <li><Link to="profile"><i className="fas fa-user"></i> Medical Inventory</Link></li> */}
            <li><Link to="emergency-sos"><i className="fas fa-exclamation-triangle"></i> Emergency SOS</Link></li>
            {/* <li><Link to="profile"><i className="fas fa-user"></i> SOS Hospital Notifier</Link></li> */}
            {/* Links from Dashboard.js that are not in the top navbar */}
            <li><Link to="outbreak-map"><i className="fas fa-map-marked-alt"></i> Outbreak Map</Link></li>
            <li><Link to="case-chart"><i className="fas fa-chart-bar"></i> Case Chart</Link></li>
            <li><Link to="alert-history"><i className="fas fa-history"></i> Alert History</Link></li>
            <li><Link to="preferences"><i className="fas fa-cogs"></i> Guide</Link></li>
            <li><Link to="educational-materials"><i className="fas fa-book"></i> Educational Materials</Link></li>
            <li><Link to="gamification"><i className="fas fa-gamepad"></i> Play Quiz Game</Link></li>
            <li onClick={handleLogout} style={{cursor: 'pointer'}}><i className="fas fa-sign-out-alt"></i> Logout</li>
          </ul>
        </div>
        <div className="content dashboard-content-grid">
          <Outlet context={{ cases, alerts, user }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
