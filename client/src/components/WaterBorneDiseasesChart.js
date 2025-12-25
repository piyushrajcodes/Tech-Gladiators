
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Acute Diarrheal Disease', cases: 70495 },
  { name: 'Hepatitis A', cases: 15000 },
  { name: 'Leptospirosis', cases: 5000 },
];

const WaterBorneDiseasesChart = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">Water-borne Diseases in Northeast India (Assam, 2021)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#E2E8F0" />
          <YAxis stroke="#E2E8F0" />
          <Tooltip
            contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', color: '#E2E8F0' }}
            labelStyle={{ color: '#E2E8F0' }}
          />
          <Legend wrapperStyle={{ color: '#E2E8F0' }} />
          <Bar dataKey="cases" fill="#4299E1" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-4 text-center">
        Data for Hepatitis A and Leptospirosis are estimates.
      </p>
    </div>
  );
};

export default WaterBorneDiseasesChart;
