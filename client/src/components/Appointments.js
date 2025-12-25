import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppointmentModal from './AppointmentModal';
import jwtDecode from 'jwt-decode';

import './Appointments.css'; // Import a new CSS file for Appointments component

const localizer = momentLocalizer(moment);

const Appointments = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.user);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

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

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        const token = localStorage.getItem('token');
        try {
          const res = await axios.get(`http://localhost:5001/api/appointments/user/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          const eventList = res.data.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
          setEvents(eventList);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };
    fetchEvents();
    fetchDoctors();
  }, [user]);

  const handleSave = async (event) => {
    const token = localStorage.getItem('token');
    if (token && user && selectedDoctor) {
      try {
        const newEvent = { 
          ...event, 
          start: new Date(event.start), 
          end: new Date(event.end), 
          userId: user.id, 
          doctorId: selectedDoctor,
          description: 'Appointment booked' 
        };
        const res = await axios.post('http://localhost:5001/api/appointments/book', newEvent, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setEvents([...events, { ...res.data, start: new Date(res.data.start), end: new Date(res.data.end) }]);
      } catch (error) {
        console.error("Error saving appointment:", error);
      }
    }
  };


  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  const handleBookAppointment = (doctorId) => {
    setSelectedDoctor(doctorId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
        <div className="appointments-container">
            <div className="appointments-header">
                <h2>Your Appointments</h2>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectSlot={() => {}}
                className="react-big-calendar-custom"
            />
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                selectedSlot={selectedSlot}
                doctorId={selectedDoctor}
            />
        </div>
        <div className="doctors-list">
          <h2>Doctors</h2>
          <div className="doctor-cards">
            {doctors.map(doctor => (
              <div key={doctor._id} className="doctor-card">
                <h3>{doctor.name}</h3>
                <p>{doctor.speciality}</p>
                <p>{doctor.degree}</p>
                <p>{doctor.experience} years of experience</p>
                <p>Fees: ${doctor.fees}</p>
                <p>{doctor.address}</p>
                <button onClick={() => handleBookAppointment(doctor._id)} disabled={!user}>Book Appointment</button>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default Appointments;
