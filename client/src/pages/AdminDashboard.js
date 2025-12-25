import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('http://localhost:5001/api/admin/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setAppointments(res.data);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get('http://localhost:5001/api/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setDoctors(res.data);
      }
    };
    fetchDoctors();
  }, []);

  const handleToggleAvailability = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5001/api/admin/doctors/availability/${id}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setDoctors(doctors.map(doctor => doctor._id === id ? res.data : doctor));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
      <div className="appointments-container">
        <div className="appointments-header">
          <h2>All Appointments</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment._id}>
                <td>{appointment.description}</td>
                <td>{new Date(appointment.start).toLocaleString()}</td>
                <td>{new Date(appointment.end).toLocaleString()}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="doctors-container">
        <div className="doctors-header">
          <h2>All Doctors</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Speciality</th>
              <th>Availability</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor._id}>
                <td>{doctor.name}</td>
                <td>{doctor.speciality}</td>
                <td>{doctor.availability ? 'Available' : 'Unavailable'}</td>
                <td>
                  <button onClick={() => handleToggleAvailability(doctor._id)}>
                    Toggle Availability
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;