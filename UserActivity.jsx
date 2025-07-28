import React from 'react';
import AddDevice from './UserActivities/AddDevice';
import AddLine from './UserActivities/AddLine';
import AddPost from './UserActivities/AddPost';
import LampList from './UserActivities/LampList';
import DevicesWithMap from './UserActivities/DevicesWithMap';
import LampStatus from './UserActivities/LampStatus';
import ConfigureDashboard from './UserActivities/ConfigureDashboard';
import History from './UserActivities/HistoryList';
import Statistics from './UserActivities/Statistics';
import DataReport from './UserActivities/DataReport';
import ManageUsers from './UserActivities/ManageUsers';
import StatusChanger from './UserActivities/StatusChanger';
import ConfigureThresholds from './UserActivities/ConfigureThresholds';

const UserActivity = ({ activity, user, onBack }) => {
  const componentsMap = {
    'Add New Device': AddDevice,
    'Add New Line': AddLine,
    'Add New Post': AddPost,
    'Show Lamp List': LampList,
    'Show Zone List': DevicesWithMap,
    'Check Lamp Status': LampStatus,
    'Configure Dashboard': ConfigureDashboard,
    History: History,
    Statistics: Statistics,
    'Data Report': DataReport,
    'Manage Users': ManageUsers,
    'Configure Devices': StatusChanger,
    'Configure Thresholds': ConfigureThresholds,
  };

  const ActivityComponent = componentsMap[activity];

  return (
    <div>
      <button onClick={onBack}>← Back to Activities</button>
      {ActivityComponent ? (
        <ActivityComponent user={user} />
      ) : (
        <p>Feature for "{activity}" not yet implemented.</p>
      )}
    </div>
  );
};

export default UserActivity;
