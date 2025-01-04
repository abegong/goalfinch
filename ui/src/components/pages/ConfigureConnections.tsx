import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Stack,
  Typography,
} from '@mui/material';

interface ConfigureConnectionsData {
  serverUrl: string;
  serverPassword: string;
  unsplashApiToken: string;
  personalPhotosUrl: string;
}

const ConfigureConnections: React.FC = () => {
  const [connections, setConnections] = useState<ConfigureConnectionsData>({
    serverUrl: '',
    serverPassword: '',
    unsplashApiToken: '',
    personalPhotosUrl: '',
  });

  const handleChange = (field: keyof ConfigureConnectionsData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConnections(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <CardHeader
        sx={{ 
          bgcolor: 'rgb(255, 193, 5)',
          py: 1
        }}
        title={
          <Typography variant="h5" fontWeight="bold">
            Configure Connections
          </Typography>
        }
      />
      <CardContent sx={{ bgcolor: 'white' }}>
        <Stack spacing={3}>
          <TextField
            label="Server URL"
            fullWidth
            value={connections.serverUrl}
            onChange={handleChange('serverUrl')}
          />
          <TextField
            label="Server Password"
            fullWidth
            type="password"
            value={connections.serverPassword}
            onChange={handleChange('serverPassword')}
          />
          <TextField
            label="Unsplash API Token"
            fullWidth
            value={connections.unsplashApiToken}
            onChange={handleChange('unsplashApiToken')}
          />
          <TextField
            label="Personal Photos URL"
            fullWidth
            value={connections.personalPhotosUrl}
            onChange={handleChange('personalPhotosUrl')}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ConfigureConnections;
