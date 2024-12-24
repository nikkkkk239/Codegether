import React, { useContext } from 'react'
import { IoPeopleSharp } from "react-icons/io5";
import { FaCode } from "react-icons/fa";
import { useSessionStore } from '../store/useSessionStore';
import { useAuthStore } from '../store/useAuthStore';
import { modalContext } from '../store/ModalContext';
import { useNavigate } from 'react-router-dom';
function SessionCard({session}) {
  const {requestJoin,setSessionClicked,setSelectedSession} = useSessionStore();
  const {authUser} = useAuthStore();
  const navigate = useNavigate()
  const {setIsModalOpen ,setModalType} = useContext(modalContext);
  
  const handleJoinClick = ()=>{
    
    if(authUser._id == session.creator){
      setSelectedSession(session)
      navigate(`/session/${session._id}`)
      return ;
    }
    setIsModalOpen(true)
    setModalType("join");
    setSessionClicked(session);
    
  }
  return (
    <div className='session'>
        <div className='header'>
            <div className='title'>{session.name}</div>
            <div className='createdBy'>createdBy - <span>{session.hostName}</span></div>
        </div>
        <div className='footer'>
            <div>
                <button onClick={handleJoinClick}>join</button>
            </div>
            <div className='right'>
            <div className='participants'><IoPeopleSharp className='icon'/> {session.participants.length}</div>
            <div className='Language'><FaCode className='icon'/> {session.language}</div>
            </div>
        </div>

    </div>
  )
}

export default SessionCard