import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Toaster} from "react-hot-toast"
import Navbar from "./components/Navbar.jsx"
import { Routes,Route,NavLink, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SessionPage from './pages/SessionPage.jsx'
import { useAuthStore } from './store/useAuthstore.js'
function App() {
  const {checkAuth,authUser} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  console.log("user : ",authUser)
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <Home/> : <Navigate to='/login'/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
        <Route path="/login" element={authUser ? <Navigate to='/'/> : <Login/>}/>
        <Route path="/register" element={authUser ? <Navigate to='/'/> : <Register/>}/>
        <Route path="/session/:id" element={authUser ? <SessionPage/> : <Navigate to='/login'/>}/>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
