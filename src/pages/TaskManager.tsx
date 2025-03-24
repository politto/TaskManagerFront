import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskTable from '../component/TaskTable';
import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik'

type Props = {}

export default function TaskManager({}: Props) {
  const navigate = useNavigate();
  // search for access token in local storage
  const token = localStorage.getItem('token');
  
  const formik = useFormik({
    initialValues: {
      id: '',
      title: '',
      description: '',
      status: '',
      userId: ''
    },
    validationSchema: yup.object({
      title: yup.string().required('Title is required').min(4, 'Title should be at least 4 characters'),
      description: yup.string().required('Description is required').min(4, 'Description should be at least 4 characters'),
      status: yup.string().required('Status is required').min(4, 'Status should be at least 4 characters'),
    }),
    onSubmit: values => {
      // Handle form submission
      console.log(values);
    }
  });

  if (!token || token === 'undefined') {
    // redirect to login page
    // Inside your component, add this line near the top:
    alert('You are not authorized to access this page');
    useEffect(() => {
      if (!token || token === 'undefined') {
        // redirect to login page
        // Inside your component, add this line near the top:
        alert('You are not authorized to access this page');
        navigate('/login');
      }
    }, []);
    navigate('/login');
  }
  else console.log('Token found:', token);

  //contuunue with the rest of the component
  return (
    <div>
      <h1 className = "text-2xl text-blue-700">TaskManager</h1>
      <TaskTable />
    </div>
  )
}