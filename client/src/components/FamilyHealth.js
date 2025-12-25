import React, { useState, useEffect } from 'react';
import FamilyMemberDetails from './FamilyMemberDetails';
import { FaPlusCircle, FaUsers, FaUserPlus, FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa'; // Import icons
import jwtDecode from "jwt-decode";
import axios from 'axios';

const FamilyHealth = () => {
  const [familyName, setFamilyName] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [memberDob, setMemberDob] = useState('');
  const [memberRelation, setMemberRelation] = useState('');
  const [currentFamilyCard, setCurrentFamilyCard] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.user);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      axios.get(`/api/family-cards/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if (res.data.length > 0) {
            setCurrentFamilyCard(res.data[0]);
            setFamilyMembers(res.data[0].members);
          }
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleCreateFamilyCard = async () => {
    if (familyName.trim() && user) {
      try {
        const res = await axios.post('/api/family-cards', { name: familyName }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCurrentFamilyCard({ ...res.data, members: [] });
        setFamilyName('');
      } catch (error) {
        console.error("Error creating family card: ", error);
        alert("Error creating family card. Please check the console for details.");
      }
    }
  };

  const handleAddMember = async () => {
    if (currentFamilyCard && memberName.trim() && memberDob.trim() && memberRelation.trim()) {
      try {
        const res = await axios.post(`/api/family-cards/${currentFamilyCard._id}/members`, {
          name: memberName,
          dob: memberDob,
          relation: memberRelation,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFamilyMembers([...familyMembers, res.data]);
        setMemberName('');
        setMemberDob('');
        setMemberRelation('');
      } catch (error) {
        console.error("Error adding family member: ", error);
        alert("Error adding family member. Please check the console for details.");
      }
    }
  };

  return (
    <div className="family-health-container">
      <h1 className="main-title" style={{ textAlign: 'center' }}>👪 Family Health Card</h1>

      {!currentFamilyCard ? (
        <div className="create-family-card-container">
          <div className="card-section">
            <h2 className="section-title" style={{ textAlign: 'center' }}>➕ Create New Family Card</h2>
            <p style={{ textAlign: 'center' }}>Start by creating a family card to manage your family's health information.</p>
            <div className="form-group">
              <label htmlFor="familyName">Family Card Name</label>
              <input
                id="familyName"
                type="text"
                placeholder="e.g., The Smith Family"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="form-input"
              />
            </div>
            <button onClick={handleCreateFamilyCard} className="button-primary">Create Card</button>
          </div>
        </div>
      ) : (
        <div>
          {selectedMember ? (
            <div className="member-details-view">
              <button className="button-back" onClick={() => setSelectedMember(null)}>
                <FaArrowLeft /> Back to Family Members
              </button>
              <FamilyMemberDetails member={selectedMember} familyCardId={currentFamilyCard._id} />
            </div>
          ) : (
            <div className="family-dashboard-grid">
              <div className="card-section add-member-section">
                <h2 className="section-title"><FaUserPlus /> Add a New Family Member</h2>
                <p>Enter the details of the new family member below.</p>
                <div className="form-group">
                  <label htmlFor="memberName">Member Name</label>
                  <input
                    id="memberName"
                    type="text"
                    placeholder="Full Name"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="memberDob">Date of Birth</label>
                  <input
                    id="memberDob"
                    type="date"
                    value={memberDob}
                    onChange={(e) => setMemberDob(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="memberRelation">Relation</label>
                  <input
                    id="memberRelation"
                    type="text"
                    placeholder="e.g., Son, Daughter"
                    value={memberRelation}
                    onChange={(e) => setMemberRelation(e.target.value)}
                    className="form-input"
                  />
                </div>
                <button onClick={handleAddMember} className="button-primary">Add Member</button>
              </div>

              <div className="card-section family-members-section">
                <h2 className="section-title"><FaUsers /> Family Members of {currentFamilyCard.name}</h2>
                {familyMembers.length === 0 ? (
                  <p className="no-members-message">No family members have been added yet. Use the form on the left to add one.</p>
                ) : (
                  <ul className="family-members-list">
                    {familyMembers.map((member) => (
                      <li key={member._id} className="family-member-card">
                        <h3 className="member-name">{member.name}</h3>
                        <p><strong>Relation:</strong> {member.relation}</p>
                        <p><strong>DOB:</strong> {new Date(member.dob).toLocaleDateString()}</p>
                        <div className="button-group member-actions">
                          <button className="button-info" onClick={() => setSelectedMember(member)}>
                            View Details
                          </button>
                          <button className="button-secondary" onClick={() => alert(`Edit ${member.name}`)}>
                            <FaEdit />
                          </button>
                          <button className="button-danger" onClick={() => alert(`Delete ${member.name}`)}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyHealth;
