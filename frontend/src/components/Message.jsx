import React, { useEffect,useState } from 'react'
import { useAuthStore } from '../store/useAuthstore';


function Message({message}) {
    const {getUser,authUser} = useAuthStore();
    const [user,setUser] = useState({})
    useEffect(()=>{
        const fun = async()=>{
            if(message.senderId != authUser._id){
                const yeah = await getUser(message.senderId);
                setUser(yeah);
            }
            else{
            setUser(authUser)
            }
        }
        fun();
    },[])
    function formatMessageTime(date){
        return new Date(date).toLocaleTimeString("en-us",{
            hour : "2-digit",
            minute:"2-digit",
            hour12:false,
        })
    }
  return (
    <div className='message' style={message.senderId !== authUser._id ? {alignSelf:"flex-start"}:{alignSelf:"flex-end"}}>
        <div className='written'>
            <div className='senderName'>{user?.username}</div>
            <div className='text'>{message.text}</div>
        </div>
        <div className='date'>{formatMessageTime(message.time)}</div>
    </div>
  )
}

export default Message