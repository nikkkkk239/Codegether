import React, { useState, useEffect } from "react";
import {useAuthStore} from "../store/useAuthStore"
import {useSessionStore} from "../store/useSessionStore"
import { useNavigate, useParams } from "react-router-dom";

const SessionPage = () => {
  const {id} = useParams();
  const {selectedSession} = useSessionStore()
  const {authUser} = useAuthStore()
  const navigate = useNavigate()
  useEffect(()=>{
    console.log("selectedSession from session page : ",selectedSession)
  },[])

  return (
    <div className="sessionPage">
      <div className="editor">
        Hi
      </div>
      <div className="sidebar">
        <div className="title">
          <p>{selectedSession.name}</p>
          <button>
            {selectedSession.creator == authUser._id ? "End Session":"Leave Session"}
          </button>
        </div>
        <div className="texts">
          <div className="creator">Launched by - {selectedSession.hostName}</div>
          <div className="participants">Participants - {selectedSession.participants.length}</div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;