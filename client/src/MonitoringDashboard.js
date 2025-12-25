
import React, { useState, useEffect } from 'react';
import './Monitoring.css';

const cities = [
    "Guwahati",
    "Shillong",
    "Imphal",
    "Agartala",
    "Itanagar",
    "Aizawl",
    "Kohima",
    "Gangtok"
];

function MonitoringDashboard() {
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [monitoringData, setMonitoringData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMonitoringData = async () => {
            if (selectedCity) {
                try {
                    setError(null);
                    const response = await fetch(`http://localhost:5001/api/monitoring/${selectedCity}`);
                    const data = await response.json();
                    if (response.ok) {
                        setMonitoringData({
                            ...data,
                            reported_diseases: data.reported_diseases || [],
                            precautions: data.precautions || {}
                        });
                    } else {
                        setMonitoringData(null);
                        setError(data.message);
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error("Error fetching monitoring data:", error);
                    setMonitoringData(null);
                    setError('Failed to fetch monitoring data. Please check your connection and try again.');
                }
            }
        };

        fetchMonitoringData();
    }, [selectedCity]);

    const getRiskClass = (value) => {
        if (typeof value === 'string') {
            switch (value.toLowerCase()) {
                case 'good':
                    return 'risk-Good';
                case 'moderate':
                    return 'risk-Moderate';
                case 'high':
                    return 'risk-High';
                case 'poor':
                    return 'risk-Poor';
                case 'low':
                    return 'risk-Low';
                default:
                    return '';
            }
        }
        if (typeof value === 'number') {
            if (value > 100) {
                return 'risk-High';
            } else if (value > 50) {
                return 'risk-Moderate';
            } else {
                return 'risk-Good';
            }
        }
        return '';
    };

    const getRiskColor = (value) => {
        const risk = getRiskClass(value);
        switch (risk) {
            case 'risk-Good':
                return 'green';
            case 'risk-Moderate':
                return 'orange';
            case 'risk-High':
                return 'red';
            case 'risk-Poor':
                return 'darkred';
            case 'risk-Low':
                return 'blue';
            default:
                return 'grey';
        }
    };

    return (
        <div>
            <div className="monitoring-container">
                <div className="city-selector">
                    <select className="form-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {monitoringData && !error && (
                    <div className="monitoring-grid">
                        <div className="monitoring-card" style={{ borderLeft: `5px solid greenyellow` }}>
                            <div className="card-header">
                                <h5 style={{ color: 'white'}}>Reported Diseases</h5>
                                <div className="card-icon">🛡</div>
                            </div>
                            <div className="card-value">
                                <ul style={{ color: 'white'}}>
                                    {Array.isArray(monitoringData.reported_diseases) && monitoringData.reported_diseases.map(disease => (
                                    <li key={disease}>{disease}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="monitoring-card" style={{ borderLeft: `5px solid ${getRiskColor(monitoringData.aqi)}` }}>
                            <div className="card-header">
                                <h5 style={{ color: 'white'}}>Air Quality Index (AQI)</h5>
                                <div className="card-icon">🌫️</div>
                            </div>
                            <div className="card-value">
                                <span className={getRiskClass(monitoringData.aqi)}>{monitoringData.aqi}</span>
                                <p className="card-description" style={{ color: 'white'}}>Safe for consumption with standard filtration</p>
                            </div>
                        </div>

                        <div className="monitoring-card" style={{ borderLeft: `5px solid ${getRiskColor(monitoringData.water_quality)}` }}>
                            <div className="card-header">
                                <h5 style={{ color: 'white'}}>Water Quality</h5>
                                <div className="card-icon">💧</div>
                            </div>
                            <div className="card-value">
                                <span className={getRiskClass(monitoringData.water_quality)}>{monitoringData.water_quality}</span>
                                <p className="card-description" style={{ color: 'white'}}>Safe for drinking with standard purification</p>
                            </div>

                        </div>

                        <div className="monitoring-card" style={{ borderLeft: `5px solid ${getRiskColor(monitoringData.noise_pollution)}` }}>
                            <div className="card-header">
                                <h5 style={{ color: 'white'}}>Noise Pollution</h5>
                                <div className="card-icon">🔊</div>
                            </div>
                            <div className="card-value">
                                <span className={getRiskClass(monitoringData.noise_pollution)}>{monitoringData.noise_pollution}</span>
                                <p className="card-description" style={{ color: 'white'}}>Within acceptable limits</p>
                            </div>
                        </div>

                        <div className="monitoring-card" style={{ borderLeft: `5px solid ${getRiskColor(monitoringData.health_risk_score * 10)}` }}>
                            <div className="card-header">
                                <h5 style={{ color: 'white'}}>Health Risk Score</h5>
                                <div className="card-icon">❤️</div>
                            </div>
                            <div className="card-value">
                                <span className={getRiskClass(monitoringData.health_risk_score * 10)}>{monitoringData.health_risk_score}/10</span>
                                <p className="card-description" style={{ color: 'white'}}>Based on environmental factors</p>
                            </div>
                        </div>

                            <div className="monitoring-card" style={{ borderLeft: `5px solid greenyellow` }}>
                                <div className="card-header">
                                    <div className="card-icon">⚠️</div>
                                    <h5 style={{ color: 'white'}}>Precautions</h5>
                                </div>
                                <div className="card-value">
                                {monitoringData.precautions && Object.entries(monitoringData.precautions).map(([disease, precaution]) => (
                                    <div key={disease} style={{ color: 'black'}}>
                                        <strong style={{ color: 'red'}}>{disease}:</strong> {precaution} 
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
}

export default MonitoringDashboard;
