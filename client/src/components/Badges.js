import React, { useState, useEffect } from 'react';
import axios from 'axios';
import healthchamp from './healthchamp.png';
import './Card.css';

const Badges = ({ userId }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      const res = await axios.get(`http://localhost:5001/api/users/${userId}/badges`);
      setBadges(res.data);
    };
    fetchBadges();
  }, [userId]);

  return (
    <div className="card-container">
      <h2>My Badges</h2>
      <ul>
        {badges.map((userBadge) => (
          <li key={userBadge._id}>
            <img src={healthchamp} alt={userBadge.badge.name} width={50} height={50}/>
            <p>{userBadge.badge.name}</p>
            <p>{userBadge.badge.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Badges;
