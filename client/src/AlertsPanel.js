import React from 'react';

function AlertsPanel({ alerts }) {
  return (
    <div className="min-h-screen bg-dark-blue-bg">
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title">Anomaly Alerts</h5>
                {alerts.length > 0 ? (
                <ul className="list-group list-group-flush">
                    {alerts.map(alert => (
                    <li key={alert.id} className="list-group-item list-group-item-danger">
                        <strong>{alert.date}:</strong> {alert.message}
                        <div className="text-muted small">{alert.village}, {alert.district}</div>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-muted">No alerts at this time.</p>
                )}
            </div>
        </div>
    </div>
  );
}

export default AlertsPanel;
