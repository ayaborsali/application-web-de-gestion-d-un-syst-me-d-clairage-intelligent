import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Paper, TextField
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  // 🔄 Charger les données Firestore
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
        console.error('Erreur lors du chargement :', err);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const activeLampsCount = devices.filter(d => d.status === 'active').length;
  const coveredZonesCount = [...new Set(devices.map(d => d.sector))].length;
  const installedDevicesCount = devices.length;
  const alertsTodayCount = devices.reduce((acc, d) => acc + (parseInt(d.alertsToday) || 0), 0);

  // Données BarChart
  const lampsPerSector = [];
  devices.forEach(d => {
    let item = lampsPerSector.find(i => i.sector === d.sector);
    if (item) item.count++;
    else lampsPerSector.push({ sector: d.sector, count: 1 });
  });

  // Données simulées pour LineChart
  const lineChartData = [
    { day: 'Mon', alerts: 1 },
    { day: 'Tue', alerts: 3 },
    { day: 'Wed', alerts: 2 },
    { day: 'Thu', alerts: 0 },
    { day: 'Fri', alerts: 4 },
    { day: 'Sat', alerts: 1 },
    { day: 'Sun', alerts: 2 },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Dashboard - Real-time Data</Typography>

      

      {/* Résumé */}
      <Grid container spacing={3} mb={4}>
        {[
          { title: 'Active Lamps', value: activeLampsCount },
          { title: 'Covered Zones', value: coveredZonesCount },
          { title: 'Installed Devices', value: installedDevicesCount },
          { title: 'Alerts Today', value: alertsTodayCount },
        ].map(stat => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card sx={{ backgroundColor: '#1976d2', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Carte */}
        <Grid item xs={12} md={8} height={400}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Map of Devices</Typography>
            <MapContainer center={[36.8, 10.2]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredDevices
  .filter(d => typeof d.lat === 'number' && typeof d.lng === 'number')
  .map(d => (
    <Marker key={d.id} position={[d.lat, d.lng]}>
      <Popup>{`${d.name} ( ${d.sector})`}</Popup>
    </Marker>
))}

            </MapContainer>
          </Paper>
        </Grid>

        {/* Graphiques */}
        <Grid item xs={12} md={4} container spacing={2} direction="column">
          <Grid item height={180}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6">Lamps per Sector</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={lampsPerSector}>
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item height={180}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6">Alerts per Day</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="alerts" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
