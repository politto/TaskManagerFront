import './App.css'
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  //navigates to login page
  const navigateToLogin = () => {
      return navigate('/login');
  }
  //navigates to register page
  const navigateToRegister = () => {
      return navigate('/register');
  }
  
return (
  <main>
    <h1>Welcome to the App</h1>
    <button onClick={navigateToLogin}>Login</button>
    <button onClick={navigateToRegister}>Register</button>
  </main>
)
}

export default App
