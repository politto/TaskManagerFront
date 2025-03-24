import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'title', headerName: 'title', width: 130 },
  { field: 'description', headerName: 'description', width: 300 },
  {
    field: 'status',
    type: 'custom',
    renderCell: (params) => (
      params.value === 'completed' ? (
        <span style={{ color: 'green' }}>{params.value}</span>
      ) : params.value === 'in_progress' ? (
        <span style={{ color: 'yellow' }}>{params.value}</span>
      ) : (
        <span style={{ color: 'orange' }}>{params.value}</
span>
      )
    ),
    width: 90,
  },
  {
    field: 'edit',
    headerName: 'Edit',
    renderCell: (params) => (
      <button 
        className="bg-blue-500 text-white my-1 h-[80%] text-center flex justify-center items-center rounded-md"
        onClick={() => alert(params.row.id)}
      >
        Edit
      </button>
    ),
    width: 90,
  },
  {
    field: 'delete',
    headerName: 'Delete',
    renderCell: (params) => (
      <button className="bg-red-500 text-white my-1 h-[80%] text-center flex justify-center items-center rounded-md">Delete</button>
    ),
    width: 90,
  },
];

const rows = [
  { id: 1, title: 'Task 1', description: 'Description 1', status: 'Done' },
];

type props = {
  formik
};
const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}