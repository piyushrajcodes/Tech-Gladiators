import React, { useState } from 'react';
import axios from 'axios';

const FamilyMemberDetails = ({ member, familyCardId }) => {
  const [newMedicalHistoryEntry, setNewMedicalHistoryEntry] = useState('');
  const [newPrescription, setNewPrescription] = useState('');
  const [newVaccination, setNewVaccination] = useState('');
  const [newChronicIllness, setNewChronicIllness] = useState('');

  const handleAddMedicalHistory = async () => {
    if (member && newMedicalHistoryEntry.trim()) {
      try {
        await axios.put(`/api/family-cards/${familyCardId}/members/${member._id}`, { medicalHistory: newMedicalHistoryEntry }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setNewMedicalHistoryEntry('');
      } catch (error) {
        console.error("Error adding medical history: ", error);
      }
    }
  };

  const handleAddPrescription = async () => {
    if (member && newPrescription.trim()) {
      try {
        await axios.put(`/api/family-cards/${familyCardId}/members/${member._id}`, { prescriptions: newPrescription }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setNewPrescription('');
      } catch (error) {
        console.error("Error adding prescription: ", error);
      }
    }
  };

  const handleAddVaccination = async () => {
    if (member && newVaccination.trim()) {
      try {
        await axios.put(`/api/family-cards/${familyCardId}/members/${member._id}`, { vaccinations: newVaccination }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setNewVaccination('');
      } catch (error) {
        console.error("Error adding vaccination: ", error);
      }
    }
  };

  const handleAddChronicIllness = async () => {
    if (member && newChronicIllness.trim()) {
      try {
        await axios.put(`/api/family-cards/${familyCardId}/members/${member._id}`, { chronicIllnesses: newChronicIllness }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setNewChronicIllness('');
      } catch (error) {
        console.error("Error adding chronic illness: ", error);
      }
    }
  };

  if (!member) return <div className="member-details-loading">Loading member details...</div>;

  return (
    <div className="member-details-container">
      <h2 className="member-details-title">{member.name}'s Details</h2>

      <div className="details-section">
        <h3 className="details-subtitle">Medical History</h3>
        <ul className="details-list">
          {member.medicalHistory.map((entry, index) => (
            <li key={index} className="details-list-item">{entry}</li>
          ))}
        </ul>
        <div className="add-item-form">
          <input
            type="text"
            placeholder="New Medical History Entry"
            value={newMedicalHistoryEntry}
            onChange={(e) => setNewMedicalHistoryEntry(e.target.value)}
            className="form-input"
          />
          <button onClick={handleAddMedicalHistory} className="button-primary-small">Add</button>
        </div>
      </div>

      <div className="details-section">
        <h3 className="details-subtitle">Prescriptions</h3>
        <ul className="details-list">
          {member.prescriptions.map((entry, index) => (
            <li key={index} className="details-list-item">{entry}</li>
          ))}
        </ul>
        <div className="add-item-form">
          <input
            type="text"
            placeholder="New Prescription"
            value={newPrescription}
            onChange={(e) => setNewPrescription(e.target.value)}
            className="form-input"
          />
          <button onClick={handleAddPrescription} className="button-primary-small">Add</button>
        </div>
      </div>

      <div className="details-section">
        <h3 className="details-subtitle">Vaccinations</h3>
        <ul className="details-list">
          {member.vaccinations.map((entry, index) => (
            <li key={index} className="details-list-item">{entry}</li>
          ))}
        </ul>
        <div className="add-item-form">
          <input
            type="text"
            placeholder="New Vaccination"
            value={newVaccination}
            onChange={(e) => setNewVaccination(e.target.value)}
            className="form-input"
          />
          <button onClick={handleAddVaccination} className="button-primary-small">Add</button>
        </div>
      </div>

      <div className="details-section">
        <h3 className="details-subtitle">Chronic Illnesses</h3>
        <ul className="details-list">
          {member.chronicIllnesses.map((entry, index) => (
            <li key={index} className="details-list-item">{entry}</li>
          ))}
        </ul>
        <div className="add-item-form">
          <input
            type="text"
            placeholder="New Chronic Illness"
            value={newChronicIllness}
            onChange={(e) => setNewChronicIllness(e.target.value)}
            className="form-input"
          />
          <button onClick={handleAddChronicIllness} className="button-primary-small">Add</button>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberDetails;