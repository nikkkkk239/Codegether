import React, { useContext, useEffect, useState } from 'react'
import { useSessionStore } from '../store/useSessionStore'
import Modal from "react-modal"
import SessionCard from '../components/SessionCard';
import { modalContext } from '../store/ModalContext';
import HostModal from "../components/HostModal"
import JoinModal from "../components/JoinModal"

function Home() {
  const {getSessions,sessions,isFetchingSessions} = useSessionStore();
  const {isModalOpen,setIsModalOpen,modalType} = useContext(modalContext)

  useEffect(()=>{
    getSessions();
  },[getSessions])


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width:"45%",
      minHeight:"300px",
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor:"#c4c4fb"
    },
  };
  const closeModal = () => {
    setIsModalOpen(false);

  };

  if(isFetchingSessions) return <div> Loading... </div>

  return (
    <div className='home' style={isModalOpen ? {position:"fixed",width:"100%"} :{}}>

      {sessions && sessions.map((session , i)=>
          (<SessionCard session={session} key={i}/>)
      )}
      <Modal 
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        {modalType=="host" ? <HostModal/> : <JoinModal/>}
      </Modal>

    </div>
  )
}

export default Home