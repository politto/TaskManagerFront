import React, { useState, useEffect } from 'react'
import { Tasks } from '../types/Tasks';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FormikProps } from 'formik';

type Props = {
    formik: FormikProps<Tasks>;
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
}

export default function TaskAddAndEditor({formik, isModalOpen, setIsModalOpen}: Props) {


  useEffect(() => {
    
    return () => {
        
    };
  }, [isModalOpen]);
  

  return (
    <Dialog open={isModalOpen} 
    aria-label='Task Add and Editor'
    onClose={() => setIsModalOpen(false)}
     maxWidth="sm" fullWidth className="rounded-lg">
        <form onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          formik.handleSubmit();
        }}>
      <DialogTitle className="bg-blue-50 text-blue-800 font-semibold ">
        {formik.values.id ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent className="mt-4 gap-4 m-4">
        <div className="space-y-4 my-2">
          <TextField
            fullWidth
            label="Title"
            name="title"
            aria-label='Title'
            data-testid="title-input"  // Add this line
            value={formik.values.title || ''}
            variant="outlined"
            className="mb-8"
            onChange={formik.handleChange}
          />
          {formik.touched.title && formik.errors.title ? ( <div className = "text-red-500">{formik.errors.title}</div> ) : null}
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            data-testid="description-input"  // Add this line
            value={formik.values.description || ''}
            variant="outlined"
            multiline
            rows={4}
            className="mb-8"
            onChange={formik.handleChange}
          />

          {formik.touched.description && formik.errors.description ? ( <div className = "text-red-500">{formik.errors.description}</div> ) : null}
          
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formik.values.status || 'in_progress'}
              aria-label='Status'
              onChange={formik.handleChange}
              data-testid="status-select"  // Add this line
            >
              <MenuItem value="in_progress" selected>In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          {formik.touched.status && formik.errors.status ? ( <div className = "text-red-500">{formik.errors.status}</div> ) : null}
        </div>
      </DialogContent>
      <DialogActions className="p-4 bg-gray-50">
        <Button onClick={() => setIsModalOpen(false)} variant="outlined" className="mr-2">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
      </form>
    </Dialog>
  )
}