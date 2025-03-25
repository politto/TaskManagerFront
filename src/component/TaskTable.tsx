import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Tasks } from '../types/Tasks';



type Props = {
  formik: any;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  onDeleteTask: () => void;
  tasks: Tasks[];
};
const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ formik, isModalOpen, setIsModalOpen, onDeleteTask, tasks }: Props) {
  console.log(tasks);

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
          onClick={() => {
            setIsModalOpen(true);
            formik.setValues({
              id: params.row.id,
              title: params.row.title,
              description: params.row.description,
              status: params.row.status,
            });
          }}
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
        <button className="bg-red-500 text-white my-1 h-[80%] text-center flex justify-center items-center rounded-md"
        onClick={
          () => {
            formik.setValues({
              id: params.row.id,
              title: params.row.title,
              description: params.row.description,
              status: params.row.status,
            });
            onDeleteTask();
          }
        }>Delete</button>
      ),
      width: 90,
    },
  ];
  
  const rows = [
    { id: 1, title: 'Task 1', description: 'Description 1', status: 'Done' },
  ];
  
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        }))
        }
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
        onCellClick={(params) => {
          if (params.field === 'delete') {
            onDeleteTask();
            console.log("delete clicked");
            
          }
          if (params.field === 'edit') {
            setIsModalOpen(true);
            formik.setValues({
              id: params.row.id,
              title: params.row.title,
              description: params.row.description,
              status: params.row.status,
            });
          }

        }
        }
      />
    </Paper>
  );
}