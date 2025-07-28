import React from 'react';
import { Paper, useTheme, useMediaQuery } from '@mui/material';

const MapSection = ({ location = 'Tunis', zoom = 13 }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const height = isSmallScreen ? 200 : 300;

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <Paper
      sx={{
        flex: 1,
        height,
        m: 1,
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
      }}
      elevation={4}
    >
      <iframe
        title={`Carte de ${location}`}
        width="100%"
        height="100%"
        src={mapSrc}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Paper>
  );
};

export default MapSection;
