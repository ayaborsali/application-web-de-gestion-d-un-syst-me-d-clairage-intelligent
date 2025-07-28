import React, { useState } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Collapse,
} from '@mui/material';

const roles = [
  'Administrator',
  'Supervisor',
  'Local Director',
  'Regional Director',
  'General Doctor',
  'Engineer',
];

const Users = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', password: '' });

  const handleSelectRole = (role) => {
    setSelectedRole(role === selectedRole ? null : role);
    setFormData({ name: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (selectedRole && formData.name && formData.password) {
      onLogin(selectedRole, formData.name);
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>
      <List>
        {roles.map((role) => (
          <div key={role}>
            <ListItem button onClick={() => handleSelectRole(role)}>
              <ListItemText primary={role} />
            </ListItem>
            <Collapse in={selectedRole === role} timeout="auto" unmountOnExit>
              <Paper sx={{ p: 2, mt: 1, mb: 2, backgroundColor: '#f5f5f5' }}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button variant="contained" onClick={handleSubmit}>
                  Login
                </Button>
              </Paper>
            </Collapse>
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default Users;
