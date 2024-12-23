import React from 'react'
import { IoPeopleSharp } from "react-icons/io5";
import { FaCode } from "react-icons/fa";
function SessionCard({session}) {

  return (
    <div className='session'>
        <div className='header'>
            <div className='title'>{session.name}</div>
            <div className='createdBy'>createdBy - <span>{session.hostName}</span></div>
        </div>
        <div className='footer'>
            <div>
                <button>join</button>
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