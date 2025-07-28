import React, { useState, useEffect } from 'react';
import { Typography, Select, MenuItem } from '@mui/material';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../../firebase'; // 🔁 adapte le chemin si nécessaire

const StatusChanger = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      const snapshot = await getDocs(collection(db, 'devices'));
      const devicesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevices(devicesList);
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice && selectedDevice.status) {
      setNewStatus(selectedDevice.status);
    }
  }, [selectedDevice]);

  const handleStatusChange = async (e) => {
    const updatedStatus = e.target.value;
    setNewStatus(updatedStatus);

    if (!selectedDevice || !selectedDevice.id) {
      alert('Aucun dispositif valide sélectionné.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('⚠️ Utilisateur non connecté');
      return;
    }

    try {
      const deviceRef = doc(db, 'devices', selectedDevice.id);
      await updateDoc(deviceRef, { status: updatedStatus });

      await addDoc(collection(db, 'history'), {
        message: `🔄 ${selectedDevice.name} → ${updatedStatus}`,
        timestamp: serverTimestamp(),
        userEmail: user.email,
        deviceId: selectedDevice.id,
        previousStatus: selectedDevice.status,
        newStatus: updatedStatus,
        location: selectedDevice.location || 'Non spécifiée',
      });

      alert('✅ Statut mis à jour avec succès');

      // Mettre à jour localement la liste des dispositifs
      setDevices(prevDevices =>
        prevDevices.map(dev =>
          dev.id === selectedDevice.id
            ? { ...dev, status: updatedStatus }
            : dev
        )
      );

      // Mettre à jour localement le selectedDevice
      setSelectedDevice(prev => ({ ...prev, status: updatedStatus }));
    } catch (error) {
      console.error('Erreur Firestore:', error);
      alert('❌ Une erreur est survenue lors de la mise à jour.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Colonne gauche : liste des dispositifs */}
      <div style={{ flex: 1 }}>
        <h2>📋 Dispositifs</h2>
        <ul>
          {devices.map((device) => (
            <li key={device.id}>
              <button onClick={() => setSelectedDevice(device)}>
                {device.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Colonne droite : détails et changement de statut */}
      <div style={{ flex: 2 }}>
        {selectedDevice ? (
          <div>
            <Typography variant="h5">📟 {selectedDevice.name}</Typography>
            <Typography variant="body1">📍 {selectedDevice.location}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              ⚙️ Statut actuel : {selectedDevice.status}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Modifier le statut :
            </Typography>
            <Select
              value={newStatus}
              onChange={handleStatusChange}
              fullWidth
              sx={{ mt: 1 }}
            >
              <MenuItem value="Active">🟢 Active</MenuItem>
              <MenuItem value="Inactive">⚪ Inactive</MenuItem>
              <MenuItem value="Faulty">🔴 Faulty</MenuItem>
            </Select>
          </div>
        ) : (
          <Typography color="error">Aucun dispositif sélectionné.</Typography>
        )}
      </div>
    </div>
  );
};

export default StatusChanger;
