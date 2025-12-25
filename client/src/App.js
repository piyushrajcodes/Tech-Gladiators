import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import DashboardOverview from './pages/DashboardOverview';
import Appointments from './components/Appointments';
import Chatbot from './components/Chatbot';
import FamilyHealth from './components/FamilyHealth';
import PrescriptionRecognition from './components/PrescriptionRecognition';
import EmergencySOS from './components/EmergencySOS';
import VideoCall from './components/VideoCall';
import PrescriptionUpload from './components/PrescriptionUpload';
import BMICalculator from './BMICalculator';
import SymptomChecker from './SymptomChecker';
import OutbreakMap from './OutbreakMap';
import CaseChart from './CaseChart';
import MonitoringDashboard from './MonitoringDashboard';
import AlertHistory from './AlertHistory';
import Preferences from './Preferences';
import EducationalMaterials from './EducationalMaterials';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import MapTest from './MapTest';
import GamificationPage from './pages/GamificationPage';
import jwtDecode from 'jwt-decode';
import './App.css';

function App() {
  let userId;
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.user.id;
  }

  return (
    <Router future={{ v7_startTransition: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardOverview />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="family-health" element={<FamilyHealth />} />
          <Route path="prescription-recognition" element={<PrescriptionRecognition />} />
          <Route path="emergency-sos" element={<EmergencySOS />} />
          <Route path="upload-prescription" element={<PrescriptionUpload />} />
          <Route path="bmi-calculator" element={<BMICalculator />} />
          <Route path="symptom-checker" element={<SymptomChecker />} />
          <Route path="case-chart" element={<CaseChart />} />
          <Route path="monitoring-dashboard" element={<MonitoringDashboard />} />
          <Route path="alert-history" element={<AlertHistory />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="educational-materials" element={<EducationalMaterials />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="outbreak-map" element={<OutbreakMap />} />
          <Route path="gamification" element={<GamificationPage userId={userId} />} />
        </Route>
        <Route path="/video-call" element={<VideoCall />} />
        <Route path="/outbreak-map" element={<OutbreakMap />} />
        <Route path="/map-test" element={<MapTest />} />
      </Routes>
    </Router>
  );
}

export default App;
