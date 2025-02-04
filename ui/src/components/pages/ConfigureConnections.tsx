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
import { LocalStorageService } from '../../services/storage';

interface DeleteDialogState {
  open: boolean;
  type: 'pictureSources' | 'goalSources';
  index: number;
}

interface EditDialogState {
  open: boolean;
  type: 'pictureSources' | 'goalSources' | null;
  index: number;
  source: SourceConfig;
  errors: {
    name: string;
    url: string;
  };
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

// Current version of the configuration format
const CURRENT_VERSION = 1;

const ConfigureConnections: React.FC = () => {
  const { connections, setConnections, dashboard, app, setDashboard, setApp } = useConfig();
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    type: 'pictureSources',
    index: -1,
  });
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    type: null,
    index: -1,
    source: { name: '', url: '' },
    errors: { name: '', url: '' }
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
    // If this is a new source (index equals length), generate a default name
    const isNewSource = index === connections[type].length;
    const defaultName = isNewSource 
      ? `${type === 'pictureSources' ? 'pictures' : 'data'}-${connections[type].length + 1}`
      : connections[type][index].name;

    setEditDialog({
      open: true,
      type,
      index,
      source: isNewSource 
        ? { name: defaultName, url: '' }
        : { ...connections[type][index] },
      errors: { name: '', url: '' }
    });
  };

  const handleEditCancel = () => {
    setEditDialog({
      open: false,
      type: null,
      index: -1,
      source: { name: '', url: '' },
      errors: { name: '', url: '' }
    });
  };

  const validateSourceConfig = (field: keyof SourceConfig, value: string): string => {
    if (field === 'name') {
      if (!value) {
        return 'Name is required';
      }
      if (!/^[a-z0-9-]+$/.test(value)) {
        return 'Name must contain only lowercase letters, numbers, and hyphens';
      }
      
      // Check for duplicates, excluding the current source being edited
      const isDuplicate = [...connections.pictureSources, ...connections.goalSources].some(
        (source, idx) => {
          // If we're editing an existing source, don't compare with itself
          if (editDialog.type && idx === editDialog.index && 
              ((editDialog.type === 'pictureSources' && idx < connections.pictureSources.length) ||
               (editDialog.type === 'goalSources' && idx >= connections.pictureSources.length))) {
            return false;
          }
          return source.name === value;
        }
      );
      
      if (isDuplicate) {
        return 'This name is already in use';
      }
      return '';
    }
    if (field === 'url') {
      if (!value) {
        return 'URL is required';
      }
      try {
        new URL(value);
        return '';
      } catch {
        return 'Please enter a valid URL';
      }
    }
    return '';
  };

  const handleEditChange = (field: keyof SourceConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const error = validateSourceConfig(field, value);
    
    setEditDialog(prev => ({
      ...prev,
      source: {
        ...prev.source,
        [field]: value
      },
      errors: {
        ...prev.errors,
        [field]: error
      }
    }));
  };

  const handleEditSave = () => {
    // Validate both fields
    const nameError = validateSourceConfig('name', editDialog.source.name);
    const urlError = validateSourceConfig('url', editDialog.source.url);

    if (nameError || urlError) {
      setEditDialog(prev => ({
        ...prev,
        errors: {
          name: nameError,
          url: urlError
        }
      }));
      return;
    }

    if (editDialog.type && editDialog.index >= 0) {
      const type = editDialog.type;
      setConnections(prev => {
        const newSources = [...prev[type]];
        newSources[editDialog.index] = editDialog.source;
        return {
          ...prev,
          [type]: newSources
        };
      });
    } else if (editDialog.type) {
      const type = editDialog.type;
      setConnections(prev => ({
        ...prev,
        [type]: [...prev[type], editDialog.source]
      }));
    }
    handleEditCancel();
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
    setDeleteDialog({ open: false, type: 'pictureSources', index: -1 });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, type: 'pictureSources', index: -1 });
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
                      size="small"
                      onClick={() => handleEditSource(type, index)}
                      data-testid={`edit-${source.name}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => removeSource(type, index)}
                      data-testid={`delete-${source.name}`}
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
          <Stack spacing={8}>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h6">Self-hosted Backend</Typography>
              <Button variant="outlined" disabled>
                Configure backend
              </Button>
            </Stack>

            <SourceList type="pictureSources" title="Pictures" />

            <SourceList type="goalSources" title="Data" />
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
              Confirm
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
            onClick={handleReset}
            color="error"
            sx={{ 
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                borderColor: 'error.main'
              }
            }}            
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
          <input type="file" onChange={handleFileInput} />
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
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!editDialog.errors.name && !editDialog.errors.url && 
              editDialog.source.name && editDialog.source.url) {
            handleEditSave();
          }
        }}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                fullWidth
                value={editDialog.source.name}
                onChange={handleEditChange('name')}
                error={!!editDialog.errors.name}
                helperText={editDialog.errors.name ? 'This name is already in use' : 'Use lowercase letters, numbers, and hyphens'}
              />
              <TextField
                label="URL"
                fullWidth
                value={editDialog.source.url}
                onChange={handleEditChange('url')}
                error={!!editDialog.errors.url}
                helperText={editDialog.errors.url}
              />
              <Button 
                variant="outlined" 
                disabled={!editDialog.source.url || !!editDialog.errors.url}
                sx={{ alignSelf: 'flex-start' }}
              >
                Check Connection
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel}>Cancel</Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={!editDialog.source.name || !editDialog.source.url || !!editDialog.errors.name || !!editDialog.errors.url}
            >
              {editDialog.index >= 0 && editDialog.type && editDialog.index < connections[editDialog.type].length 
                ? 'Save' 
                : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </>
  );
};

export default ConfigureConnections;
