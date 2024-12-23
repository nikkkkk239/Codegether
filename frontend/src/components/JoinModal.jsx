import React, { useContext } from 'react'
import { modalContext } from '../store/ModalContext'

function JoinModal() {
    const {setModalOpen,modalOpen,setModalType,modalType} = useContext(modalContext);
  return (
    <div>JoinModal</div>
  )
}

export default JoinModal