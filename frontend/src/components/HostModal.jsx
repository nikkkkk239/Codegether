import React, { useContext, useState } from 'react'
import { modalContext } from '../store/ModalContext'
import { LuEye,LuEyeClosed } from 'react-icons/lu';
import {useNavigate} from "react-router-dom"
import toast from 'react-hot-toast';
import { useSessionStore } from '../store/useSessionStore';

function HostModal() {
    const navigate = useNavigate()
    const {setIsModalOpen,isModalOpen,setModalType,modalType} = useContext(modalContext);
    const [showPassword,setShowPassword] = useState(false);
    const [language,setLanguage] = useState("javascript")
    const [password,setPassword] = useState("")
    const [name,setName] = useState("")
    const {createSession ,selectedSession, isSessionCreating} = useSessionStore();

    const handleClick = ()=>{
      if(name.length == 0){
        toast.error("Name is required .")
        return;
      }
      if(password.length == 0){
        toast.error("Password is required .")
        return;
      }
      if(password.length < 6){
        toast.error("Password must be at least of length 6.")
      }
      if(language.length == 0){
        toast.error("Language is required .")
        return;
      }
      createSession({name,password,language})
      setIsModalOpen(false)
      setModalType("")
      navigate(`/session/${selectedSession._id}`)
    }
  return (
    <div className='hostModal'>
      <div className='title'>Create an session</div>
      <div className='lower'>
        <div className='inputFields'>
          <div className='inputs' >
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter name of session...'/>
          </div>
          <div className='inputs'>
            <input type={showPassword ?"text" :"password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password ...' />
            <div className='icon' onClick={()=>setShowPassword(!showPassword)}>
              {showPassword ? <LuEye/> : <LuEyeClosed/>}
              </div>
          </div>
        </div>

        <div className="selection">
          <label htmlFor="fruit">Choose a language : </label>
          <select id="fruit" value={language} defaultValue={"javascript"} onChange={(e)=>setLanguage(e.target.value)} name="fruit">
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="cpp">CPP</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>
        </div>

        <button onClick={handleClick}>
          {isSessionCreating ? "..." :"Create"}
        </button>
      </div>
    </div>
  )
}

export default HostModal