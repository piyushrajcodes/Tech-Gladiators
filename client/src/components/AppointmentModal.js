import React, { useState, useEffect } from 'react';
import './AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose, onSave, selectedSlot }) => {
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (selectedSlot) {
      // Format dates for datetime-local input
      const formatDateTime = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      setStart(formatDateTime(selectedSlot.start));
      setEnd(formatDateTime(selectedSlot.end));
    } else {
      // Reset if no slot is selected (e.g., opening modal via button)
      setDescription('');
      setStart('');
      setEnd('');
    }
  }, [selectedSlot, isOpen]); // Re-run when modal opens or slot changes

  if (!isOpen) return null;

  const handleSave = () => {
    // Convert datetime-local strings back to Date objects for saving
    onSave({ description, start: new Date(start), end: new Date(end) });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Appointment</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Appointment Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="start">Start Time</label>
            <input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end">End Time</label>
            <input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-button secondary" onClick={onClose}>Cancel</button>
          <button className="modal-button primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;