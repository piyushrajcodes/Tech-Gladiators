import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthChampions = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await axios.get('http://localhost:5001/api/community-points');
      setLeaderboard(res.data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h2>Health Champions</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.user.name}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthChampions;
