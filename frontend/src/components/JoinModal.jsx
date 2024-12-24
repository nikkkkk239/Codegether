import React, { useContext, useState } from 'react'
import { modalContext } from '../store/ModalContext'
import { LuEye,LuEyeClosed } from 'react-icons/lu';
import { useSessionStore } from '../store/useSessionStore';
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

function JoinModal() {
    const {setIsModalOpen,isModalOpen,setModalType,modalType} = useContext(modalContext);
    const {sessionClicked,joinSession,isSessionJoining,selectedSession} = useSessionStore();
    const [showPassword,setShowPassword] = useState(false);
    const [password,setPassword] = useState("");
    const navigate = useNavigate()
    const handleClose = ()=>{
      setIsModalOpen(false);
      setModalType("");
    }

    const handleClick = async()=>{
      if(password.length == 0){
        toast.error("Password is required .")
        return ;
      }
      await joinSession({password , id: sessionClicked._id});
      navigate(`/session/${selectedSession._id}`)
    }
  return (
    <div className='joinModal'>
      <div className='cross' onClick={handleClose}><RxCross2/></div>
      <div className='title'>Join - <span>{sessionClicked?.name}</span></div>
      <div className='bottom'>
        <div className='inputField'>
          <input type={showPassword ? "text" :"password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter the password...'/>
          <div className='icon' onClick={()=>setShowPassword(!showPassword)}>
            {showPassword ? <LuEye/> : <LuEyeClosed/>}
          </div>
        </div>
        <button onClick={handleClick} disabled={isSessionJoining}>{ isSessionJoining ? ".....":"Request Join"}</button>
      </div>
      
    </div>
  )
}

export default JoinModal