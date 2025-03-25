import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskTable from '../component/TaskTable';
import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik'
import { Users } from '../types/Users';
import { getUserDataFromToken } from '../api/auth';
import { Tasks } from '../types/Tasks';
import { createTask, deleteTask, getAllUserTasks, updateTask } from '../api/tasksApi';
import TaskAddAndEditor from '../component/TaskAddAndEditor';

type Props = {}

export default function TaskManager({}: Props) {
  const [user, setUser] = useState<Users>({id: '', email: '', password: ''});
  const [userTasks, setUserTasks] = useState<Tasks[]>([]);
  const [deleteTrigger, setDeleteTrigger] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  // search for access token in local storage
  const token = localStorage.getItem('token');


  const formik = useFormik<Tasks>({
    initialValues: {
      id: '',
      title: '',
      description: '',
      status: 'in_progress',
      userId: user.id
    },
    validationSchema: yup.object({
      title: yup.string().required('Title is required').min(4, 'Title should be at least 4 characters').matches(/^[a-zA-Z0-9\s]+$/, 'Title should contain only letters and numbers'),
      description: yup.string().required('Description is required').min(4, 'Description should be at least 4 characters').matches(/^[a-zA-Z0-9\s]+$/, 'Description should contain only letters and numbers'),
      status: yup.string().required('Status is required').min(4, 'Status should be at least 4 characters'),
    }),
    onSubmit: values => {
      console.log('Form data:', values);
      values.userId = user.id;
      
      setIsModalOpen(false);
      if (values.id !== '') {
        updateTask(values.id, values.title, values.description, user.id, values.status)
          .then(() => {
            // Handle success (e.g., show notification, refresh data)
            console.log('Task updated successfully');
            // You might want to refresh the tasks list
          })
          .catch(error => {
            console.error('Failed to update task:', error);
          });
      }
      else {
        // create task
        createTask( values.title, values.description, user.id, values.status)
          .then(() => {
            // Handle success (e.g., show notification, refresh data)
            console.log('Task created successfully');
            // You might want to refresh the tasks list
          })
          .catch(error => {
            console.error('Failed to create task:', error);
          });

      }

        
    },
  });

  useEffect(() => {
    const getUserDataAndTasks = async () => {
      // get user data from token
      try {
        const userInfo = await getUserDataFromToken();
        const userTasksRes = await getAllUserTasks();
        
        setUser(userInfo.data);
        formik.setFieldValue('userId', userInfo.data.id);
        setUserTasks(userTasksRes);
        
        
      
      }
      catch (err) {
        console.log(err);
        navigate('/login');
      }
      
    }
    getUserDataAndTasks();
    
  }, [formik.isSubmitting, formik.values]);

  useEffect(() => {
    (async () => {
      if (deleteTrigger) {
        // handle delete task
        alert(formik.values.id);
        await deleteTask(formik.values.id); 
        setUserTasks(userTasks.filter(task => task.id !== formik.values.id));
        setDeleteTrigger(false);
      }
    })();
  }, [deleteTrigger]
    )

  const onDeleteTask = () => {
    // handle delete task
    setDeleteTrigger(true);
  }

    useEffect(() => {
      
      if (!token || token === 'undefined') {
        // redirect to login page
        // Inside your component, add this line near the top:
        alert('You are not authorized to access this page');
        // navigate('/login');
      }
      
      else console.log('Token found:', token);
    }, []);
    

  const handleCreateTask = async () => {
    // handle create task
    
  }


  //contuunue with the rest of the component
  return (
    <div >
      <div className = "p-4">
        <h1 className = "text-2xl text-blue-700">TaskManager</h1>
        <p className = "text-xl">Current user: {user.email}</p>
      </div>
      <div>
        <button className = "bg-blue-500 text-white my-1 h-[80%] text-center flex justify-center items-center rounded-md"
        onClick={() => {
          setIsModalOpen(true)
          formik.setValues({
            id: '',
            title: '',
            description: '',
            status: 'in_progress',
            userId: user.id
          });
        }
        }>Add Task</button>
      </div>
      <TaskTable formik = {formik} isModalOpen = {isModalOpen} setIsModalOpen = {setIsModalOpen} onDeleteTask={onDeleteTask} tasks={userTasks}/>
      <TaskAddAndEditor formik = {formik} isModalOpen = {isModalOpen} setIsModalOpen = {setIsModalOpen}/>
      {/* continue working on submitting */}
    </div>
  )
}