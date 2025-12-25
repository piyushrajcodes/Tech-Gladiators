import React from 'react';

const AlertHistory = ({ alerts = [] }) => {
    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Alert History</h5>
                    {alerts.length === 0 ? (
                        <p>No alerts for your city.</p>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {alerts.map((alert, index) => (
                                <li key={alert.id || index} className="list-group-item">
                                    <p className="mb-1"><strong>{alert.message}</strong></p>
                                    <small>{new Date(alert.timestamp).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertHistory;
