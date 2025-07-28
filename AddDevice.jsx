import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase'; // adapte ce chemin si besoin

// Fix Leaflet icons (pour afficher les marqueurs correctement)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Composant pour gérer le clic sur la carte et la sélection d'emplacement
const LocationMarker = ({ setLocation }) => {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(`${e.latlng.lat}, ${e.latlng.lng}`);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [devices, setDevices] = useState([]);

  // Récupérer devices en temps réel, triés par date ajout descendante
  useEffect(() => {
    const q = query(collection(db, 'devices'), orderBy('addedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(data);
    });
    return () => unsubscribe();
  }, []);

  // Ajouter un nouveau device
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!deviceName || !location || !status) {
      setMessage('⚠️ Veuillez remplir tous les champs');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage('⚠️ Utilisateur non connecté');
        return;
      }

      const addedAt = new Date();

      // Ajouter device
      const newDeviceRef = await addDoc(collection(db, 'devices'), {
        name: deviceName,
        location,
        status,
        addedAt,
        addedBy: user.email || user.uid,
      });

      // Ajouter entrée historique
      await addDoc(collection(db, 'history'), {
        message: `✅ Dispositif "${deviceName}" ajouté par ${user.email}`,
        timestamp: serverTimestamp(),
        user: user.email,
        deviceId: newDeviceRef.id,
        newStatus: status,
        action: 'add',
      });

      setMessage(`✅ Dispositif "${deviceName}" ajouté avec succès !`);
      setDeviceName('');
      setLocation('');
      setStatus('');
    } catch (error) {
      setMessage('❌ Erreur : ' + error.message);
    }
  };

  // Modifier le statut d'un device (mise à jour Firestore + historique)
  const handleStatusChange = async (deviceId, newStatus, currentName) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Utilisateur non connecté');
        return;
      }

      const deviceRef = doc(db, 'devices', deviceId);
      await updateDoc(deviceRef, { status: newStatus });

      await addDoc(collection(db, 'history'), {
        message: `⚙️ Statut de "${currentName}" modifié en "${newStatus}" par ${user.email}`,
        timestamp: serverTimestamp(),
        user: user.email,
        deviceId,
        newStatus,
        action: 'update',
      });
    } catch (error) {
      console.error('Erreur mise à jour statut:', error.message);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Ajouter un dispositif</Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom du dispositif"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Statut"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Active">🟢 Active</MenuItem>
          <MenuItem value="Inactive">⚪ Inactive</MenuItem>
          <MenuItem value="Faulty">🔴 Faulty</MenuItem>
        </TextField>

        <Typography sx={{ mt: 2, mb: 1 }}>
          Cliquez sur la carte pour choisir l’emplacement :
        </Typography>

        <MapContainer center={[36.8, 10.2]} zoom={6} style={{ height: 300, marginBottom: 16 }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker setLocation={setLocation} />
        </MapContainer>

        <TextField
          label="Emplacement sélectionné"
          value={location}
          fullWidth
          margin="normal"
          disabled
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Ajouter
        </Button>
      </form>

      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Liste des dispositifs</Typography>
      {devices.length === 0 && <Typography>Aucun dispositif ajouté.</Typography>}

      <ul>
        {devices.map((device) => (
          <li key={device.id} style={{ marginBottom: 16 }}>
            <strong>{device.name}</strong> — 📍 {device.location} — 👤 {device.addedBy} — 🕒{' '}
            {device.addedAt?.seconds
              ? new Date(device.addedAt.seconds * 1000).toLocaleString()
              : device.addedAt?.toDate?.().toLocaleString?.() || ''}
            <br />
            Statut actuel : <strong>{device.status}</strong>{' '}
            <FormControl sx={{ minWidth: 140, ml: 2 }}>
              <InputLabel>Changer statut</InputLabel>
              <Select
                value={device.status || ''}
                label="Changer statut"
                onChange={(e) =>
                  handleStatusChange(device.id, e.target.value, device.name)
                }
              >
                <MenuItem value="Active">🟢 Active</MenuItem>
                <MenuItem value="Inactive">⚪ Inactive</MenuItem>
                <MenuItem value="Faulty">🔴 Faulty</MenuItem>
              </Select>
            </FormControl>
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default AddDevice;
