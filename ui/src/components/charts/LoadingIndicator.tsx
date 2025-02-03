import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingIndicator: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%' 
  }}>
    <CircularProgress />
  </div>
);

export default LoadingIndicator;
