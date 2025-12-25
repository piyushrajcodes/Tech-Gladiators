import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleScheduleConsult = async () => {
    if (!appointmentDateTime) {
      alert('Please select a date and time for the consultation.');
      return;
    }
    if (!description) {
      alert('Please enter a description for the consultation.');
      return;
    }

    const startDateTime = new Date(appointmentDateTime);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour after start

    try {
      const token = localStorage.getItem('token');
            await axios.post(
        '/api/appointments/book',
        {
          doctorId: selectedDoctor._id,
          start: appointmentDateTime,
          description,
          end: endDateTime.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Appointment requested successfully!');
      setAppointmentDateTime('');
      setDescription('');
      setSelectedDoctor(null);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment. Please try again.');
    }
  };

  const handleEmergencyConsult = () => {
    window.open('https://meet.jit.si/emergency-consult', '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className={`p-4 border rounded-lg cursor-pointer ${
              doctor.isAvailable ? 'bg-green-100' : 'bg-red-100'
            }`}
            onClick={() => handleDoctorClick(doctor)}
          >
            <img
              src={doctor.profilePicture}
              alt={doctor.name}
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h2 className="text-lg font-semibold text-center">{doctor.name}</h2>
            <p className="text-center">{doctor.specialty}</p>
            <p className="text-center">
              {doctor.isAvailable ? 'Available' : 'Not Available'}
            </p>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">{selectedDoctor.name}</h2>
          <p>
            <strong>Specialty:</strong> {selectedDoctor.specialty}
          </p>
          <p>
            <strong>About:</strong> {selectedDoctor.about}
          </p>
          <div className="mt-4">
            <input
              type="datetime-local"
              value={appointmentDateTime}
              onChange={(e) => setAppointmentDateTime(e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Description of consultation"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded-lg ml-2"
            />
            <button
              onClick={handleScheduleConsult}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
            >
              Schedule Consult
            </button>
            <button
              onClick={handleEmergencyConsult}
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
            >
              Emergency Consult
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
