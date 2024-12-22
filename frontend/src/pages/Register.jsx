import React, { useState } from 'react'
import { LuEye } from "react-icons/lu";
import {NavLink} from "react-router-dom"
import { FaLaptopCode } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import Image from "../assets/vscode.jpg"
function Register() {
  const [showPassword,setShowPassword] = useState(false)
  return (
    <div className='register'>

      <div className="left">
        <div className="logo">
          <FaLaptopCode/>
        </div>
        <form >
          <div className='inputField'>
            <input type="text" placeholder='Enter your username' />
          </div>
          <div className='inputField'>
            <input type="text" placeholder='Enter your email' />
          </div>
          <div className='inputField'>
            <input type={showPassword ? "text":"password"} placeholder='Enter your password' />
            <div className='icon' onClick={()=>setShowPassword(!showPassword)}>
            {showPassword ? <LuEye/> : <LuEyeClosed/>}
            </div>
          </div>
          <button>Submit</button>
        </form>
        <div className='written'>
          <p>Already have an account ? <NavLink className="nav" to="/login">Login</NavLink> </p>
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

export default Register