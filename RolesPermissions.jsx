import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const permissions = {
  Administrator: [
    'Add New Device',
    'Add New Line',
    'Add New Post',
    'Show Lamp List',
    'Show Zone List',
    'Check Lamp Status',
    'Configure Dashboard',
    'History',
    'Statistics',
    'Data Report',
    'Manage Users',
    'Configure Devices',
    'Configure Thresholds',
  ],
  Engineer: [
    'Add New Device',
    'Add New Line',
    'Add New Post',
    'Show Lamp List',
    'Show Zone List',
    'Check Lamp Status',
    'Configure Dashboard',
    'History',
    'Statistics',
    'Data Report',
    'Configure Devices',
    'Configure Thresholds',
  ],
  'General Doctor': ['History', 'Statistics', 'Data Report', 'Manage Users'],
  'Regional Director': ['History', 'Statistics', 'Data Report', 'Manage Users'],
  'Local Director': ['History', 'Statistics', 'Data Report', 'Manage Users'],
  Supervisor: ['History', 'Statistics', 'Data Report'],
};

const RolesPermissions = ({ role, name, onSelectActivity }) => {
  const activities = permissions[role] || [];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Welcome, {name} ({role})
      </Typography>
      <Typography variant="h6" gutterBottom>
        Available Activities:
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <ListItem
            key={index}
            button
            onClick={() => onSelectActivity(activity)}  // click on activity
          >
            <ListItemText primary={activity} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RolesPermissions;
