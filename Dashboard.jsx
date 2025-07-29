import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Paper, TextField
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import 'leaflet/dist/leaflet.css';
import { useSectionVisibility } from './UserActivities/SectionVisibilityContext';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { showStats, showAlerts } = useSectionVisibility();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'devices'));
        const deviceList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevices(deviceList);
      } catch (err) {
        console.error('Erreur lors du chargement des dispositifs:', err);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter(device =>
    device.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <TextField
        label="Rechercher une lampe"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {showStats && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Statistiques</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={devices}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="status" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {showAlerts && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Alertes</Typography>
            {/* Affiche des alertes simulées ou issues de la base */}
            <ul>
              <li>Lampe 1 défaillante</li>
              <li>Lampe 5 en surchauffe</li>
            </ul>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Carte des dispositifs</Typography>
        <MapContainer center={[36.8065, 10.1815]} zoom={10} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {filteredDevices.map((device) => (
            <Marker
              key={device.id}
              position={[device.latitude || 36.8, device.longitude || 10.1]}
              eventHandlers={{
                click: () => setSelectedDevice(device),
              }}
            >
              <Popup>
                <strong>{device.name}</strong><br />
                Statut: {device.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
