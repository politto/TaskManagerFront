import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik'
import { useEffect, useState } from 'react';
import instanceMockAxios from '../utils/mock';
import { performLogin } from '../api/auth';
import { useNavigate } from 'react-router-dom';

type Props = {}

export default function Login({}: Props) {
  const navigate = useNavigate();
  const [isSendLoginRequest, setIsSendLoginRequest] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: yup.object({
      email: yup.string().required('email is required').min(4, 'email should be at least 4 characters').email('Please enter a valid email address'),
      password: yup.string().required('Password is required').min(8, 'Password should be at least 8 characters')
      
    }),
    onSubmit: values => {
      // Handle form submission
      
      setIsSendLoginRequest(true);
      console.log(values);
    }
  })

  useEffect(() => {
    if (isSendLoginRequest) {
      // Send login request
      const email = formik.values.email;
      const password = formik.values.password;

      performLogin(email, password).then((res) => {
        console.log(res);
        switch (res.statusCode) {
          case 200:
          case 201:
            // Redirect to TaskManager page
            // Inside your component, add this line near the top:

            // And in the success case:
            navigate('/taskmanager');
            alert('Login success');
            // set token to local storage
            localStorage.setItem('token', res.data.access_token);

            break;
          case 400:
            // Show error message
            alert('Invalid email or password');          
            break;
          case 500:
            // Show error message
            alert('Internal server error');
            break;
        
          default:
            alert('Something went wrong');
            break;
        }
      });
      
      setIsSendLoginRequest(false);
    }
    
  }, [setIsSendLoginRequest, isSendLoginRequest, formik.isSubmitting]);

  return (
    <main className = "flex flex-col items-center justify-center h-screengap-2">
      <div className = "bg-white rounded-lg shadow-lg p-4 min-w-[20em]">
        <h3 className = "text-xl text-center">Welcome to NodesLater Task Manager</h3>
        
        <form className = "mt-4 space-y-4" onSubmit={formik.handleSubmit}>
          <div className = "space-y-1">
            <label htmlFor = "email" className = "block">email</label>
            <input type = "text" id = "email" className = "w-full px-3 py-2 border border-gray-300 rounded-md" 
            value={formik.values.email}
            onChange = {formik.handleChange}
            onBlur={formik.handleBlur}
            aria-label='email'
            name = 'email'
            />
            {formik.touched.email && formik.errors.email ? <div className = "text-red-500">{formik.errors.email}</div> : null}
          </div>
          <div className = "space-y-1">
            <label htmlFor = "password" className = "block">Password</label>
            <input type = "password" id = "password" className = "w-full px-3 py-2 border border-gray-300 rounded-md" 
            value={formik.values.password}
            onChange = {formik.handleChange}
            onBlur={formik.handleBlur}
            aria-label='password'
            name = 'password'
            />
            {formik.touched.password && formik.errors.password ? <div className = "text-red-500">{formik.errors.password}</div> : null}
          </div>
          <button type = "submit" className = "w-full bg-blue-500 text-white px-3 py-2 rounded-md">Login</button>
        </form>
      </div>

    </main>
  )
}