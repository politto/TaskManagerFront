import React, { useState, useEffect } from 'react'
import { Tasks } from '../types/Tasks';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


type Props = {
    tasks: Tasks;
    onSave: (task: Tasks) => void;
    onCancel: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function TaskAddAndEditor({tasks, onSave, onCancel, isOpen, setIsOpen}: Props) {
  const [formData, setFormData] = useState<Tasks>(tasks);

  useEffect(() => {
    setFormData(tasks);
  }, [tasks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onCancel} maxWidth="sm" fullWidth className="rounded-lg">
      <DialogTitle className="bg-blue-50 text-blue-800 font-semibold">
        {tasks.id ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent className="mt-4">
        <div className="space-y-4 my-2">
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            variant="outlined"
            className="mb-4"
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
            className="mb-4"
          />
          
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status || 'in_progress'}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions className="p-4 bg-gray-50">
        <Button onClick={onCancel} variant="outlined" className="mr-2">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}