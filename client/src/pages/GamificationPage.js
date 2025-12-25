import React from 'react';
import Quiz from '../components/Quiz';
import Badges from '../components/Badges';
import CommunityPoints from '../components/CommunityPoints';
import HealthChampions from '../components/HealthChampions';

const GamificationPage = ({ userId }) => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Gamification</h1>
      <p style={{ textAlign: 'center' }}>Engage in activities, earn points, and become a Health Champion!</p>

      <div>
        <Quiz />
      </div>

      <div>
        <Badges userId={userId} />
      </div>

      <div>
        <CommunityPoints userId={userId} />
      </div>

      <div>
        <HealthChampions />
      </div>
    </div>
  );
};

export default GamificationPage;
