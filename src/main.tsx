import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import TaskManager from './pages/TaskManager.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/taskmanager" element={<TaskManager />} />
      </Routes>
    </BrowserRouter>
  // </StrictMode>,
)
