import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';


const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDoctor(decoded.user); // Assuming the token contains doctor info under 'user'
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
        // Redirect to login if token is invalid
      }
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (doctor) {
        const token = localStorage.getItem('token');
        try {
          const res = await axios.get(`http://localhost:5001/api/appointments/doctor/${doctor.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setAppointments(res.data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };
    fetchAppointments();
  }, [doctor]);

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5001/api/appointments/complete/${id}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAppointments(appointments.map(appointment => appointment._id === id ? res.data : appointment));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
      <div className="appointments-container">
        <div className="appointments-header">
          <h2>Your Appointments</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment._id}>
                <td>{appointment.description}</td>
                <td>{new Date(appointment.start).toLocaleString()}</td>
                <td>{new Date(appointment.end).toLocaleString()}</td>
                <td>{appointment.status}</td>
                <td>
                  {appointment.status === 'pending' && (
                    <button onClick={() => handleComplete(appointment._id)}>Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;