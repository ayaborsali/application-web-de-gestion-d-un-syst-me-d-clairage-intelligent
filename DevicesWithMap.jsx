import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase'; // adapte le chemin

// Icônes personnalisées
const icons = {
  Active: new L.Icon({ iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png', iconSize: [30, 30] }),
  Inactive: new L.Icon({ iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png', iconSize: [30, 30] }),
};

// Pour centrer la carte dynamiquement
const FlyToMarker = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15);
  }, [position]);
  return null;
};

const DeviceMapView = () => {
  const [devices, setDevices] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const q = query(collection(db, 'devices'), where('addedBy', '==', currentUserEmail));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        position: doc.data().location.split(',').map(Number),
      }));
      setDevices(data);
    });
    return () => unsubscribe();
  }, [currentUserEmail]);

  return (
    <Box display="flex" gap={2} p={2} height="85vh">
      {/* Liste des dispositifs */}
      <Paper sx={{ width: '30%', p: 2, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Mes dispositifs</Typography>
        <List>
          {devices.map((device) => (
            <ListItem
              key={device.id}
              button
              onClick={() => setSelectedPos(device.position)}
              sx={{ borderBottom: '1px solid #eee' }}
            >
              <ListItemText
                primary={device.name}
                secondary={`Status : ${device.status}`}
              />
              <Chip
                label={device.status}
                color={device.status === 'Active' ? 'success' : 'error'}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Carte Leaflet */}
      <Box flex={1}>
        <MapContainer center={[36.8, 10.98]} zoom={13} style={{ height: '100%', borderRadius: 8 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {devices.map((device) => (
            <Marker
              key={device.id}
              position={device.position}
              icon={icons[device.status] || icons.Inactive}
            >
              <Popup>
                <strong>{device.name}</strong><br />
                Status: {device.status}<br />
                Position: {device.location}
              </Popup>
            </Marker>
          ))}
          {selectedPos && <FlyToMarker position={selectedPos} />}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default DeviceMapView;
