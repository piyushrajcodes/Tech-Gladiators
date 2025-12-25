import React from 'react';
import { useOutletContext } from 'react-router-dom';
import OutbreakMap from '../OutbreakMap';
import CaseChart from '../CaseChart';
import MonitoringDashboard from '../MonitoringDashboard';
import AlertHistory from '../AlertHistory';
import Preferences from '../Preferences';
import EducationalMaterials from '../EducationalMaterials';

const DashboardOverview = () => {
  const { cases, alerts, user } = useOutletContext();

  return (
    <div className="row">
      <div className="col-lg-8">
        <div >
          <OutbreakMap cases={cases} />
        </div>
        <div className="mb-4">
          <CaseChart cases={cases} />
        </div>
        <div className="mb-4">
          <MonitoringDashboard />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="mb-4">
          <AlertHistory alerts={alerts} />
        </div>
        <div className="mb-4">
          <Preferences user={user} />
        </div>
        <div>
          <EducationalMaterials />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;