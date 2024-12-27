import React, { useState, useEffect } from "react";
import {useAuthStore} from "../store/useAuthStore"
import {useSessionStore} from "../store/useSessionStore"
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import { BsSendFill } from "react-icons/bs";
import MyEditor from "../components/MyEditor";

const SessionPage = () => {
  const {id} = useParams();
  const {selectedSession,setSelectedSession,listenToJoin,endSession,listenToSessionLeft,leaveSession,listenToSessionEnd,listenToMessages,sendMessage,chat} = useSessionStore()
  const {authUser} = useAuthStore()
  const [text , setText] = useState("");

  const handleSendMessage = async ()=>{
    await sendMessage(text,authUser._id,selectedSession._id);
    setText("")
  }

  const handleEnd =async (id)=>{
    setSelectedSession(null);
    await endSession(id)
  }
  const handleLeave =async (id)=>{
    await leaveSession(id , authUser._id)
    setSelectedSession(null);

  }
  const handleEnter = async (e)=>{
    if(e.keyCode == 13){
      await handleSendMessage()
    }
  }

  useEffect(()=>{
    listenToJoin();
    listenToSessionEnd();
    listenToSessionLeft();
    listenToMessages();
    console.log("selectedSession from session page : ",selectedSession)
  },[listenToJoin,listenToMessages,listenToSessionEnd,listenToSessionLeft])

  return (
    <div className="sessionPage">
      <div className="editor">
        <MyEditor/>
      </div>
      <div className="sidebar">
        <div className="written">
          <div className="title">
            <div>
              <p>{selectedSession.name}</p>
              <div className="creator">Launched by - {selectedSession.creator == authUser._id ? "you": selectedSession.hostName}</div>
            </div>
              {selectedSession.creator == authUser._id ? 
              <button onClick={()=>handleEnd(selectedSession._id)}>End session</button>:
              <button onClick={()=>handleLeave(selectedSession._id)}>Leave session</button>}
          </div>
          <div className="texts">
            <div className="participants">
              Participants - {selectedSession.participants.length}
            </div>
            <div className="language">
              Language - {selectedSession.language}
            </div>
          </div>
        </div>

        <div className="chatSection">
          <div className="chatHeader">
            <p>Chat</p>
          </div>

          <div className="chatBody">
              {chat && chat.messages.map((message,i)=>{
                return <Message message={message} key={i}/>
              })}
          </div>

          <div className="chatFooter">
            <input type="text" value={text} onKeyDown={handleEnter} onChange={(e)=>setText(e.target.value)} placeholder="Say hello.." />
            <button disabled={text.length == 0} onClick={handleSendMessage}><BsSendFill/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;