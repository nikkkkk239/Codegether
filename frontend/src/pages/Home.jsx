import React, { useContext, useEffect, useState } from 'react'
import { useSessionStore } from '../store/useSessionStore'
import Modal from "react-modal"
import SessionCard from '../components/SessionCard';
import { modalContext } from '../store/ModalContext';
import HostModal from "../components/HostModal"
import JoinModal from "../components/JoinModal"
import { useAuthStore } from '../store/useAuthstore';



function Home() {
  const {getSessions,sessions,isFetchingSessions,setSelectedSession,setSessionClicked,setChat,listenToSession,unListenToSession,listenToJoin,listenToSessionEnd,listenToSessionLeft} = useSessionStore();
  const {socket , authUser} = useAuthStore()
  const {isModalOpen,setIsModalOpen,modalType} = useContext(modalContext)
  useEffect(() => {
    console.log("Fetching sessions...");
    getSessions();
  }, [getSessions]);
  useEffect(()=>{
    console.log("home page.")
    listenToSession();
    listenToJoin();
    listenToSessionEnd();
    listenToSessionLeft();
    setSelectedSession(null);
    setChat(null)
    setSessionClicked(null)

    return ()=>unListenToSession()
  },[getSessions,listenToSessionLeft,listenToSession,listenToSessionEnd,unListenToSession])



  const customHeight = (modalType == "host") ? "100px" : "300px"

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width:"360px",
      minHeight:"50px",
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor:"#c4c4fb"
    },
  };
  const closeModal = () => {
    setIsModalOpen(false);

  };

  console.log("serrsonpn : ",sessions);

  if(isFetchingSessions) return <div> Loading... </div>

  return (
    <div className='home' style={isModalOpen ? {position:"fixed",width:"100%"} :{}}>

      {sessions.length != 0 && sessions?.map((session , i)=>
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