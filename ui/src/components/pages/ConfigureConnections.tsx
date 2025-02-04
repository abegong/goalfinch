import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Stack,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { SourceConfig, BackendConfig, ConnectionsConfig } from '../../types/connections';
import { useConfig } from '../../context/ConfigContext';

interface DeleteDialogState {
  open: boolean;
  type: 'pictureSources' | 'goalSources' | null;
  index: number;
}

interface EditDialogState {
  open: boolean;
  type: 'pictureSources' | 'goalSources' | null;
  index: number;
  source: SourceConfig;
}

const defaultConfig = {
  connections: {
    backend: {
      serverUrl: '',
      serverPassword: '',
    },
    pictureSources: [],
    goalSources: []
  },
  dashboard: {
    slideGroups: []
  },
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

const ConfigureConnections: React.FC = () => {
  const { connections, setConnections, dashboard, app, setDashboard, setApp } = useConfig();
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    type: null,
    index: -1,
  });
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    type: null,
    index: -1,
    source: { name: '', url: '' }
  });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleBackendChange = (field: keyof BackendConfig) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConnections(prev => ({
        ...prev,
        backend: {
          ...prev.backend,
          [field]: event.target.value
        }
      }));
  };

  const handleEditSource = (type: 'pictureSources' | 'goalSources', index: number) => {
    setEditDialog({
      open: true,
      type,
      index,
      source: { ...connections[type][index] }
    });
  };

  const handleEditCancel = () => {
    setEditDialog({
      open: false,
      type: null,
      index: -1,
      source: { name: '', url: '' }
    });
  };

  const handleEditSave = () => {
    if (editDialog.type && editDialog.index >= 0) {
      setConnections(prev => {
        const newSources = [...prev[editDialog.type!]];
        newSources[editDialog.index] = editDialog.source;
        return {
          ...prev,
          [editDialog.type!]: newSources
        };
      });
    } else if (editDialog.type) {
      const type = editDialog.type; // Capture the non-null type
      setConnections(prev => ({
        ...prev,
        [type]: [...prev[type], editDialog.source]
      }));
    }
    handleEditCancel();
  };

  const handleEditChange = (field: keyof SourceConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditDialog(prev => ({
      ...prev,
      source: {
        ...prev.source,
        [field]: event.target.value
      }
    }));
  };

  const handleSourceChange = (type: 'pictureSources' | 'goalSources', index: number, field: keyof SourceConfig) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConnections(prev => {
        const newSources = [...prev[type]];
        newSources[index] = {
          ...newSources[index],
          [field]: event.target.value
        };
        return {
          ...prev,
          [type]: newSources
        };
      });
  };

  const addSource = (type: 'pictureSources' | 'goalSources') => {
    setConnections(prev => ({
      ...prev,
      [type]: [...prev[type], { name: '', url: '' }]
    }));
  };

  const removeSource = (type: 'pictureSources' | 'goalSources', index: number) => {
    setDeleteDialog({
      open: true,
      type,
      index,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.type && deleteDialog.index >= 0) {
      setConnections(prev => ({
        ...prev,
        [deleteDialog.type!]: prev[deleteDialog.type!].filter((_, i) => i !== deleteDialog.index)
      }));
    }
    setDeleteDialog({ open: false, type: null, index: -1 });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, type: null, index: -1 });
  };

  const handleExportConfig = () => {
    const config = {
      connections,
      dashboard,
      app
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target?.result as string);
          
          // Validate the config structure
          if (config.connections && config.dashboard && config.app) {
            setConnections(config.connections);
            setDashboard(config.dashboard);
            setApp(config.app);
            setImportModalOpen(false);
          } else {
            alert('Invalid configuration file structure');
          }
        } catch (error) {
          alert('Error parsing configuration file');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please drop a JSON file');
    }
  }, [setConnections, setDashboard, setApp]);

  const handleReset = () => {
    setConnections(defaultConfig.connections);
    setDashboard(defaultConfig.dashboard);
    setApp(defaultConfig.app);
    setResetModalOpen(false);
  };

  const SourceList = ({ type, title }: { type: 'pictureSources' | 'goalSources', title: string }) => (
    <Stack spacing={2}>
      <Typography variant="h6">{title}</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>URL</TableCell>
              <TableCell sx={{ width: 100 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {connections[type].length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary">
                    No sources added yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              connections[type].map((source, index) => (
                <TableRow key={index}>
                  <TableCell>{source.name}</TableCell>
                  <TableCell>{source.url}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleEditSource(type, index)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => removeSource(type, index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="outlined"
        onClick={() => handleEditSource(type, connections[type].length)}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Source
      </Button>
    </Stack>
  );

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
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Typography variant="h6">Self-hosted Backend</Typography>
              <TextField
                label="Server URL"
                size="small"
                fullWidth
                value={connections.backend.serverUrl}
                onChange={handleBackendChange('serverUrl')}
              />
              <TextField
                label="Server Password"
                size="small"
                fullWidth
                type="password"
                value={connections.backend.serverPassword}
                onChange={handleBackendChange('serverPassword')}
              />
            </Stack>

            <Divider />
            <SourceList type="pictureSources" title="Pictures" />
            
            <Divider />
            <SourceList type="goalSources" title="Goal Tracking" />
          </Stack>
        </CardContent>
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Delete Source</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this source? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
            <Button variant="contained" onClick={handleExportConfig}>
              Export Configuration
            </Button>
            <Button variant="contained" onClick={() => setImportModalOpen(true)}>
              Import Configuration
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => setResetModalOpen(true)}
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
            onClick={handleReset}
            color="error"
          >
            Reset
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialog.open}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editDialog.index >= 0 && editDialog.type && editDialog.index < connections[editDialog.type].length 
            ? 'Edit Source' 
            : 'Add Source'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={editDialog.source.name}
              onChange={handleEditChange('name')}
            />
            <TextField
              label="URL"
              fullWidth
              value={editDialog.source.url}
              onChange={handleEditChange('url')}
            />
            <Button 
              variant="outlined" 
              disabled={!editDialog.source.url}
              sx={{ alignSelf: 'flex-start' }}
            >
              Check Connection
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            {editDialog.index >= 0 && editDialog.type && editDialog.index < connections[editDialog.type].length 
              ? 'Save' 
              : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ConfigureConnections;
