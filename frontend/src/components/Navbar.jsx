import React, { useContext } from 'react'
import { useAuthStore } from '../store/useAuthstore.js';

import Modal from "react-modal"
import { TbWorldCode } from "react-icons/tb";
import { RiUser6Fill } from "react-icons/ri";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { modalContext } from '../store/ModalContext.jsx';


function Navbar() {
  const {setIsModalOpen,setModalType} = useContext(modalContext)
  const navigate = useNavigate();
  const {authUser,logout} = useAuthStore();

  const handleLogout = ()=>{
    logout();
  }
  const handleProfileClick = ()=>{
    navigate('/profile')
  }
  const openModal = () => {
    setIsModalOpen(true);
    setModalType("host")
  };

  
  return (
    <div className='navbar'>
      <div className="logo" style={authUser && {cursor:"pointer"}} onClick={()=> authUser && navigate('/')} >CodeGether</div>
      <div className='right'>
        {
          authUser && 
          <div className='Host' onClick={openModal}>
            <TbWorldCode className='icon' />
            <p>Host</p>
          </div>
        }
         
        {
          authUser && 
          <div className='profile' onClick={handleProfileClick}>
            <RiUser6Fill className='icon' />
            <p>Profile</p>
          </div>
        } 
        {authUser && 
        <div className='logout' onClick={handleLogout}>
          <RiLogoutCircleRFill className='icon'/>
          <p>Logout</p>
          </div>
        } 
      </div>
    </div>
  )
}

export default Navbar