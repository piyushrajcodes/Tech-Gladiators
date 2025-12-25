import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CaseChart({ cases = [] }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Cases',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const processCases = (casesData) => {
      if (casesData && casesData.length > 0) {
        const casesByDate = {};
        casesData.forEach(currentCase => {
            const date = new Date(currentCase.date).toISOString().split('T')[0];
            if (casesByDate[date]) {
                casesByDate[date] += currentCase.cases;
            } else {
                casesByDate[date] = currentCase.cases;
            }
        });

        const sortedDates = Object.keys(casesByDate).sort();
        const newChartData = {
          labels: sortedDates,
          datasets: [
            {
              ...chartData.datasets[0],
              data: sortedDates.map(date => casesByDate[date]),
            },
          ],
        };
        setChartData(newChartData);
      }
    };

    if (cases.length > 0) {
      processCases(cases);
    } else {
      const fetchCases = async () => {
        try {
          const res = await axios.get('/api/cases');
          processCases(res.data);
        } catch (err) {
          console.error("Error fetching case data:", err);
        }
      };
      fetchCases();
    }
  }, [cases, chartData.datasets]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Water-Borne Disease Case Counts',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
            display: true,
            text: 'Number of Cases'
        }
      }
    }
  };

  return (
    <div>
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Case Trends</h5>
                <div style={{ height: '400px' }}>
                  <Line options={options} data={chartData} />
                </div>
            </div>
        </div>
    </div>
  );
}

export default CaseChart;