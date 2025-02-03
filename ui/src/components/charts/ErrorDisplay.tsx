import React from 'react';
import Alert from '@mui/material/Alert';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%', 
    padding: '1rem' 
  }}>
    <Alert severity="error">{message}</Alert>
  </div>
);

export default ErrorDisplay;
