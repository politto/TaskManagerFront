import { useState } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  //navigates to login page
  const navigateToLogin = () => {
      return navigate('/login');
  }
  
return (
  <main>
    <h1>Welcome to the App</h1>
    <button onClick={navigateToLogin}>Login</button>
  </main>
)
}

export default App
