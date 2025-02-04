import React, { useState } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface SourcePair {
  name: string;
  url: string;
}

interface ConfigureConnectionsData {
  serverUrl: string;
  serverPassword: string;
  pictureSources: SourcePair[];
  goalSources: SourcePair[];
}

interface DeleteDialogState {
  open: boolean;
  type: 'pictureSources' | 'goalSources' | null;
  index: number;
}

const ConfigureConnections: React.FC = () => {
  const [connections, setConnections] = useState<ConfigureConnectionsData>({
    serverUrl: '',
    serverPassword: '',
    pictureSources: [],
    goalSources: [],
  });

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    type: null,
    index: -1,
  });

  const handleChange = (field: keyof Pick<ConfigureConnectionsData, 'serverUrl' | 'serverPassword'>) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConnections(prev => ({
        ...prev,
        [field]: event.target.value
      }));
  };

  const handleSourceChange = (type: 'pictureSources' | 'goalSources', index: number, field: keyof SourcePair) =>
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

  const SourceList = ({ type, title }: { type: 'pictureSources' | 'goalSources', title: string }) => (
    <Stack spacing={2}>
      <Typography variant="h6">{title}</Typography>
      {connections[type].map((source, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="Name"
            size="small"
            value={source.name}
            onChange={handleSourceChange(type, index, 'name')}
            sx={{ flex: 1 }}
          />
          <TextField
            label="URL"
            size="small"
            value={source.url}
            onChange={handleSourceChange(type, index, 'url')}
            sx={{ flex: 2 }}
          />
          <IconButton 
            onClick={() => removeSource(type, index)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={() => addSource(type)}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Source
      </Button>
    </Stack>
  );

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
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography variant="h6">Self-hosted Backend</Typography>
            <TextField
              label="Server URL"
              size="small"
              fullWidth
              value={connections.serverUrl}
              onChange={handleChange('serverUrl')}
            />
            <TextField
              label="Server Password"
              size="small"
              fullWidth
              type="password"
              value={connections.serverPassword}
              onChange={handleChange('serverPassword')}
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
  );
};

export default ConfigureConnections;
