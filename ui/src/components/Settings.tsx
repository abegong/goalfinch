import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

interface SettingsData {
  serverUrl: string;
  serverPassword: string;
  unsplashApiToken: string;
  personalPhotosUrl: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    serverUrl: '',
    serverPassword: '',
    unsplashApiToken: '',
    personalPhotosUrl: '',
  });

  const handleChange = (field: keyof SettingsData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
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
            Settings
          </Typography>
        }
      />
      <CardContent sx={{ bgcolor: 'white' }}>
        <Stack spacing={3}>
          <TextField
            label="Server URL"
            fullWidth
            value={settings.serverUrl}
            onChange={handleChange('serverUrl')}
            placeholder="Enter server URL"
          />
          <TextField
            label="Server Password"
            fullWidth
            type="password"
            value={settings.serverPassword}
            onChange={handleChange('serverPassword')}
            placeholder="Enter server password"
          />
          <TextField
            label="Unsplash API Token"
            fullWidth
            value={settings.unsplashApiToken}
            onChange={handleChange('unsplashApiToken')}
            placeholder="Enter Unsplash API token"
          />
          <TextField
            label="Personal Photos URL"
            fullWidth
            value={settings.personalPhotosUrl}
            onChange={handleChange('personalPhotosUrl')}
            placeholder="Enter personal photos URL"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Settings;
