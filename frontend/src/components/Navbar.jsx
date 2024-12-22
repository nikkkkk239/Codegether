import React from 'react'
import { useAuthStore } from '../store/useAuthstore.js';
// import { FaLaptopCode } from "react-icons/fa";
// import { TbWorldCode } from "react-icons/tb";
import { RiUser6Fill } from "react-icons/ri";
import { RiLogoutCircleRFill } from "react-icons/ri";


function Navbar() {
  const {authUser} = useAuthStore();
  return (
    <div className='navbar'>
      <div className="logo">CodeGether</div>
      <div className='right'>
        {
          authUser && 
          <div className='profile'>
            <RiUser6Fill className='icon'/>
            Profile
          </div>
         } 
        {authUser && 
        <div className='logout'>
          <RiLogoutCircleRFill className='icon'/>
          Logout
          </div>
        } 
      </div>
    </div>
  )
}

export default Navbar