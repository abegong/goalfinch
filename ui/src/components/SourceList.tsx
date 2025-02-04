import React, { useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { SourceConfig } from '../types/connections';

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

interface SourceListProps {
  type: 'pictureSources' | 'goalSources';
  title: string;
  sources: SourceConfig[];
  onSourcesChange: (type: 'pictureSources' | 'goalSources', newSources: SourceConfig[]) => void;
}

export const SourceList: React.FC<SourceListProps> = ({ type, title, sources, onSourcesChange }) => {
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

  const validateSourceConfig = (field: keyof SourceConfig, value: string): string => {
    if (field === 'name') {
      if (!value) {
        return 'Name is required';
      }
      const isDuplicate = sources.some(
        (source, i) => source.name === value && i !== editDialog.index
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

    const newSources = [...sources];
    if (editDialog.index >= 0) {
      newSources[editDialog.index] = editDialog.source;
    } else {
      newSources.push(editDialog.source);
    }
    onSourcesChange(type, newSources);
    handleEditCancel();
  };

  const handleEditSource = (index: number) => {
    setEditDialog({
      open: true,
      type,
      index,
      source: index < sources.length ? { ...sources[index] } : { name: '', url: '' },
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

  const handleDeleteSource = (index: number) => {
    setDeleteDialog({
      open: true,
      type,
      index,
    });
  };

  const handleDeleteConfirm = () => {
    const newSources = [...sources];
    newSources.splice(deleteDialog.index, 1);
    onSourcesChange(type, newSources);
    setDeleteDialog({ open: false, type: 'pictureSources', index: -1 });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, type: 'pictureSources', index: -1 });
  };

  return (
    <>
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
              {sources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography color="text.secondary">
                      No sources added yet
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sources.map((source, index) => (
                  <TableRow key={index}>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>{source.url}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={() => handleEditSource(index)}
                        data-testid={`edit-${source.name}`}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteSource(index)}
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
          onClick={() => handleEditSource(sources.length)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Source
        </Button>
      </Stack>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Source</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this source?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialog.open}
        onClose={handleEditCancel}
      >
        <DialogTitle>
          {editDialog.index >= 0 ? 'Edit Source' : 'Add Source'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={editDialog.source.name}
              onChange={handleEditChange('name')}
              error={!!editDialog.errors.name}
              helperText={editDialog.errors.name}
              fullWidth
            />
            <TextField
              label="URL"
              value={editDialog.source.url}
              onChange={handleEditChange('url')}
              error={!!editDialog.errors.url}
              helperText={editDialog.errors.url}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
