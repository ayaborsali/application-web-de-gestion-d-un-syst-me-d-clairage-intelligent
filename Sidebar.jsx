import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = ({ selectedIndex, onMenuSelect }) => {
  // Définis ici tous les items dans l'ordre qui correspond à `pages` dans MainApp
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Device', icon: <SettingsIcon /> },
    { text: 'Alerts-Notifications', icon: <NotificationsIcon /> },

    // USER MANAGEMENT
    { text: 'Users', icon: <PersonIcon /> },
    { text: 'Roles & Permissions', icon: <PersonIcon /> },
    { text: 'User Activity', icon: <PersonIcon /> },

    // CONFIGURATION SETTINGS
    { text: 'Project Configuration', icon: <SettingsIcon /> },
    { text: 'Alert Project', icon: <NotificationsIcon /> },
    { text: 'Device Profile', icon: <SettingsIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 260,
          backgroundColor: '#1b1d36',
          color: '#fff',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar sx={{ mx: 'auto', bgcolor: '#1976d2' }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h6" mt={1} fontWeight="bold">
          ENERGY
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            selected={selectedIndex === index}
            onClick={() => onMenuSelect(index)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
              },
              '&:hover': {
                backgroundColor: '#2c2f4a',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
