import React, { useEffect, useState } from 'react';
import { Typography, Paper, CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { db } from '../../firebase'; // adapte le chemin selon ton projet

const COLORS = ['#4CAF50', '#9E9E9E', '#F44336']; // active: vert, inactive: gris, faulty: rouge

const Statistics = () => {
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    faulty: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'devices'));
        let active = 0, inactive = 0, faulty = 0;

        snapshot.forEach((doc) => {
          const status = doc.data().status?.toLowerCase();
          if (status === 'active') active++;
          else if (status === 'inactive') inactive++;
          else if (status === 'faulty') faulty++;
        });

        setDeviceStats({
          total: snapshot.size,
          active,
          inactive,
          faulty,
        });

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des lampes :', error);
        setLoading(false);
      }
    };

    fetchDeviceStats();
  }, []);

  const pieData = [
    { name: 'Active', value: deviceStats.active },
    { name: 'Inactive', value: deviceStats.inactive },
    { name: 'Faulty', value: deviceStats.faulty },
  ];

  const barData = [
    {
      name: 'Lampes',
      Active: deviceStats.active,
      Inactive: deviceStats.inactive,
      Faulty: deviceStats.faulty,
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Statistiques des Lampes</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography sx={{ mb: 2 }}>
            Total lampes : {deviceStats.total}<br />
            Actives : {deviceStats.active}<br />
            Inactives : {deviceStats.inactive}<br />
            Défectueuses : {deviceStats.faulty}
          </Typography>

          <PieChart width={300} height={250}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <BarChart
            width={500}
            height={300}
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Active" fill="#4CAF50" />
            <Bar dataKey="Inactive" fill="#9E9E9E" />
            <Bar dataKey="Faulty" fill="#F44336" />
          </BarChart>
        </>
      )}
    </Paper>
  );
};

export default Statistics;
