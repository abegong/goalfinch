import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { SourceConfig, BackendConfig } from '../../types/connections';
import { useConfig } from '../../context/ConfigContext';
import { SourceList } from '../SourceList';
import demoData from '../../data/demo_data';
import { DashboardConfig } from '../../types/config';

interface DeleteDialogState {
  open: boolean;
  type: 'pictureSources' | 'dataSources';
  index: number;
}

interface EditDialogState {
  open: boolean;
  type: 'pictureSources' | 'dataSources' | null;
  index: number;
  source: SourceConfig;
  errors: {
    name: string;
    url: string;
  };
}

const defaultConfig = {
  connections: {
    backend: null,
    pictureSources: [],
    dataSources: []
  },
  dashboard: {
    slideGroups: [{
      type: 'picture',
      name: 'My Pictures',
      slide_count: 1,
      source: '',
      slides: [{
        type: 'picture',
      }],
      captions: {}
    }]
  } as DashboardConfig,
  app: {
    appControlBar: {
      open: false,
      visible: true
    },
    theme: {
      mode: 'light' as const
    }
  }
};

// Current version of the configuration format
const CURRENT_VERSION = 1;

const ConfigureConnections: React.FC = () => {
  const { connections, setConnections, dashboard, app, setDashboard, setApp } = useConfig();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleBackendChange = (field: keyof BackendConfig) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConnections(prev => ({
        ...prev,
        backend: prev.backend ? {
          ...prev.backend,
          [field]: event.target.value
        } : {
          serverUrl: field === 'serverUrl' ? event.target.value : '',
          serverPassword: field === 'serverPassword' ? event.target.value : ''
        }
      }));
  };

  const handleSourcesChange = (type: 'pictureSources' | 'dataSources', newSources: SourceConfig[]) => {
    setConnections(prev => ({
      ...prev,
      [type]: newSources
    }));
  };

  const handleExportConfig = () => {
    const config = {
      version: 1,
      data: {
        connections,
        dashboard,
        app
      }
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'goal-finch-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const parseConfig = (jsonString: string) => {
    const parsed = JSON.parse(jsonString);

    // Require version and data fields
    if (!parsed.version || !parsed.data) {
      throw new Error('Invalid configuration format: Missing version or data field');
    }

    // Check version
    if (parsed.version > CURRENT_VERSION) {
      throw new Error(`Unsupported configuration version: ${parsed.version}. Maximum supported version is ${CURRENT_VERSION}`);
    }

    const configData = parsed.data;
    if (!configData.connections || !configData.dashboard || !configData.app) {
      throw new Error('Invalid configuration format: Missing required fields');
    }

    return configData;
  };

  const importConfig = (configData: any) => {
    setConnections(configData.connections);
    setDashboard(configData.dashboard);
    setApp(configData.app);
    setImportModalOpen(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            throw new Error('Failed to read file');
          }

          const configData = parseConfig(e.target.result as string);
          importConfig(configData);
        } catch (error) {
          alert('Error parsing configuration file');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please drop a JSON file');
    }
  }, [setConnections, setDashboard, setApp]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        const configData = parseConfig(e.target.result as string);
        importConfig(configData);
      } catch (error) {
        alert('Error parsing configuration file');
      }
    };

    reader.readAsText(file);
  }, [setConnections, setDashboard, setApp]);

  const handleReset = (toDemoData: boolean) => {
    setConnections(defaultConfig.connections);
    let newDashboard: DashboardConfig = defaultConfig.dashboard;
    if(toDemoData) {
      newDashboard = {
        slideGroups: demoData
      }
    }
    setDashboard(newDashboard);
    setApp(defaultConfig.app);    
    setResetModalOpen(false);
  };

  return (
    <>
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
          <Stack spacing={8}>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h6">Goal Finch Backend</Typography>
              <Button variant="outlined" disabled>
                Configure backend
              </Button>
            </Stack>

            <SourceList 
              type="pictureSources" 
              title="Pictures" 
              sources={connections.pictureSources}
              onSourcesChange={handleSourcesChange}
            />

            <SourceList 
              type="dataSources" 
              title="Data" 
              sources={connections.dataSources}
              onSourcesChange={handleSourcesChange}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: 800, margin: 'auto', mt: 8 }}>
        <CardHeader
          sx={{ 
            bgcolor: 'rgb(255, 193, 5)',
            py: 1
          }}
          title={
            <Typography variant="h5" fontWeight="bold">
              Import / Export
            </Typography>
          }
        />
        <CardContent sx={{ bgcolor: 'white' }}>
          <Stack spacing={2} alignItems="flex-start">
            <Button variant="outlined" onClick={handleExportConfig}>
              Export Configuration
            </Button>
            <Button variant="outlined" onClick={() => setImportModalOpen(true)}>
              Import Configuration
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => setResetModalOpen(true)}
              sx={{ 
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white',
                  borderColor: 'error.main'
                }
              }}
            >
              Reset Configuration
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      >
        <DialogTitle>Reset Configuration</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all configuration to default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleReset(true)}
            color="error"
            sx={{ 
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                borderColor: 'error.main'
              }
            }}
          >
            Reset to demo configuration
          </Button>
          <Button
            onClick={() => handleReset(false)}
            color="error"
            sx={{ 
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                borderColor: 'error.main'
              }
            }}
          >
            Clear all configuration
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Configuration</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: isDragging ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              p: 3,
              mt: 2,
              backgroundColor: isDragging ? 'action.hover' : 'background.paper',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Drag and drop your configuration file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Only .json files are accepted
            </Typography>
          </Box>
          <input type="file" onChange={handleFileInput} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfigureConnections;
