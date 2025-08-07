import React, { useEffect, useState } from 'react'
import { LuEye } from "react-icons/lu";
import {NavLink} from "react-router-dom"
import toast from 'react-hot-toast';
import { FaLaptopCode } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import Image from "../assets/vscode.jpg"
import { useAuthStore } from '../store/useAuthStore';



function Login() {
  const {login,isLoggingIn} = useAuthStore();
  const [email,setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [showPassword , setShowPassword] = useState(false);

  useEffect(()=>{
    console.log("Login page.")
  },[])
  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  const handleLogin = (e)=>{
    e.preventDefault();
    if(email.length == 0){
      toast.error("Email is required .");
      return ;
    }
    if(!validateEmail(email)){
      toast.error("Enter an valid email .");
      return;
    }
    if(password.length == 0){
      toast.error("Password is required .")
      return ;
    }
    login({email,password})
    
  }
  return (
    <div className='register'>

      <div className="left">
        <div className="logo">
          <FaLaptopCode/>
        </div>

        <form onSubmit={handleLogin}>
          <div className='inputField'>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email' />
          </div>
          <div className='inputField'>
            <input type={showPassword ? "text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)}  placeholder='Enter your password' />
            <div className='icon' onClick={()=>setShowPassword(!showPassword)}>
            {showPassword ? <LuEye/> : <LuEyeClosed/>}
            </div>
          </div>
          <button type='submit' disabled={isLoggingIn}>{isLoggingIn?"...":"Login"}</button>
        </form>

        <div className='written'>
          <p>Don't have an account ? <NavLink className="nav" to="/register">Register</NavLink> </p>
        </div>
      </div>

      <div className='right'>
        <div className='image'>
          <img src={Image} alt="" />
        </div>
        <div className='written'>
          <p>Start coding with your friends .</p>
          <p>Includes chat for communication.</p>
        </div>
      </div>
    </div>
  )
}

export default Login