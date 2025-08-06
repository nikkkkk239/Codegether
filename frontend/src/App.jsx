import { useEffect, useState } from 'react'
import {Toaster} from "react-hot-toast"
import Navbar from "./components/Navbar.jsx"
import { Routes,Route,NavLink, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'

import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SessionPage from './pages/SessionPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useSessionStore } from './store/useSessionStore.js'
function App() {
  const {checkAuth,authUser} = useAuthStore();
  const [loading , setLoading] = useState(true)
  const {selectedSession} = useSessionStore();


  useEffect(()=>{
    const fun = async()=>{
      await checkAuth();
      setLoading(false);
    }
    fun();
  },[])

  if(loading) return <div>Loading...</div>
  console.log("user : ",authUser)
  return (
    <>
      {!selectedSession && <Navbar/>}
      <Routes>
        <Route path='/' element={authUser ? selectedSession ? <Navigate to={`/session/${selectedSession._id}`}/> : <Home/> : <Navigate to='/login'/>}/>
        <Route path="/login" element={authUser ? <Navigate to='/'/> : <Login/>}/>
        <Route path="/register" element={authUser ? <Navigate to='/'/> : <Register/>}/>
        <Route path="/session/:id" element={authUser ? !selectedSession ? <Navigate to="/"/>:<SessionPage/> : <Navigate to='/login'/>}/>
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
