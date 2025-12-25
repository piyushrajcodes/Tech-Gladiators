import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Card.css';

const CommunityPoints = ({ userId }) => {
  const [points, setPoints] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      const res = await axios.get(`http://localhost:5001/api/users/${userId}/points`);
      setPoints(res.data);
    };
    fetchPoints();
  }, [userId]);

  return (
    <div className="card-container">
      <h2>My Community Points</h2>
      {points ? (
        <div>
          <p><b>Total Points:</b> {points.points}</p>
          <div/>
          <h3>History</h3>
          <ul>
            {points.history.map((item, index) => (
              <li key={index}>
                <p><b>Points:</b> {item.points}</p>
                <p><b>Reason:</b> {item.reason}</p>
                <p><b>Date:</b> {new Date(item.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No points yet.</p>
      )}
    </div>
  );
};

export default CommunityPoints;
