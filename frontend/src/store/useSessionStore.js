import toast from "react-hot-toast";
import { create } from "zustand";

import { axiosInstance } from "../lib/AxiosInstance";
import {persist} from "zustand/middleware"
import { useAuthStore } from "./useAuthstore";
export const useSessionStore = create(
    persist((set,get)=>({
    sessionClicked : null,
    setSessionClicked :(ses)=>{
        set({sessionClicked : ses})
    },
    code:"",
    setCode:(val)=>{
        set({code : val})
    },
    isFetchingSessions : true,
    isSessionCreating : false,
    isSessionJoining : false,
    selectedSession:null,
    setSelectedSession:(ses)=>{
        set({selectedSession : ses})
        console.log("selected session from store",get().selectedSession)
    },
    sessions:[],
    chat:null,
    setChat:(chat)=>{
        set({chat:chat})
    },
    getSessions : async()=>{
        try {
            const response = await axiosInstance.get("/session/");
            set({sessions : response.data })
        }catch (error) { 
            console.log("error in getSessions : ",error);
            toast.error(error.reponse.data.message);
        }finally{
            set({isFetchingSessions : false})
        }
    },
    createSession : async(details)=>{
        try {
            set({isSessionCreating:true})
            const response = await axiosInstance.post("/session/",details);
            console.log("Data after creating session : ",response.data);
            
            set({sessions:[...get().sessions , response.data.session]})
            
            toast.success("Session created Successfull .")
            set({isSessionCreating : false})
            return response.data;
        } catch (error) {
            console.log("error in createSession : ",error);
            toast.error(error.response.data.message);
        }finally{
            set({isSessionCreating : false})
        }
    },
    changeCode:async(code)=>{
        try {
            console.log("Code from changeCode :",code)
            const response = await axiosInstance.post(`/session/changeCode/${get().selectedSession._id}`,{code});
            set({selectedSession : response.data})
            set({code:code})
        } catch (error) {
            console.log("error in changeCode : ",error);
            toast.error(error.response.data.message);
        }
    },
    joinSession : async(details)=>{
        const data = {password:details.password}
        try {
            set({isSessionJoining : true})
            const response = await axiosInstance.post(`/session/${details.id}`,data);
            set({selectedSession : response.data.session})
            set({chat : response.data.chat})
            set({code : response.data.session.code})

        } catch (error) {
            console.log("error in requestJoin : ",error);
            toast.error(error.response.data.message);
        }
        finally{
            set({isSessionJoining : false})
        }
    },
    listenToSession : ()=>{
        const socket = useAuthStore.getState().socket;
        const onlineUsers = useAuthStore.getState().onlineUsers;
        const authUser = useAuthStore.getState().authUser;
        console.log("Enter the listeToSession.")
        socket?.off("newSession");
        socket?.on("newSession",(data)=>{
            console.log("Entered newSession .");
            console.log("online users : ",onlineUsers);
            if(onlineUsers.includes(authUser._id)){
                console.log("newSession Emitted .")
                set({sessions : [...get().sessions , data.session]})
                if(!get().selectedSession){
                    toast.success(`${data.session.hostName} started a session .`)
                }
            }
        })

    },
    unListenToSession : ()=>{
        const socket = useAuthStore.getState().socket;
        socket?.off("newSession");
    },
    listenToJoin : ()=>{
        const socket = useAuthStore.getState().socket;
        const onlineUsers = useAuthStore.getState().onlineUsers;
        const authUser = useAuthStore.getState().authUser;
        console.log("Enter the listenToJoin.")
        socket?.off("userJoinedSession");
        socket?.on("userJoinedSession",(data)=>{
            console.log("Entered userJoinedSession .")
            if(onlineUsers.includes(authUser._id)){
                console.log("userJoinedSession Emitted .")
                if(authUser._id == data.session.creator || data.session.participants.includes(authUser._id)){
                    set({selectedSession : data.session})
                    toast.success(`${data.user.username} joined session .`)
                }
                else{
                    set({sessions : get().sessions.map((ses)=>{
                        if(data.session._id == ses._id){
                            return {...ses,participants:[...ses.participants,data.user._id]}
                        }
                        return ses;
                    })})
                }
            }
        })
    },
    endSession : async(id)=>{
        try {
            const response = await axiosInstance.delete(`/session/endSession/${id}`)
            set({code : ""})
        } catch (error) {
            console.log("error in endSession : ",error);
            toast.error(error.response.data.message);
        }
    },
    listenToSessionEnd : ()=>{
        const socket = useAuthStore.getState().socket;
        const onlineUsers = useAuthStore.getState().onlineUsers;
        const authUser = useAuthStore.getState().authUser;
        console.log("Enter the listenToSessionEnd.")
        socket?.off("sessionEnded");
        socket?.on("sessionEnded",(data)=>{
            console.log("Entered sessionEnded .")

            if(onlineUsers.includes(authUser._id)){
                console.log("sessionEnded Emitted .")
                if(authUser._id == data.creator){
                    toast.success("Session Ended .");
                    set({selectedSession : null})
                    set({code : ""})

                    set({sessions : get().sessions.filter((ses)=>{
                        return ses._id != data.sessionId;
                    })})
                }
                else if(data.participants.includes(authUser._id)){
                    toast.success("Session Ended .");
                    set({code : ""})
                    set({selectedSession : null});
                    set({sessions : get().sessions.filter((ses)=>{
                        return ses._id != data.sessionId;
                    })});
                }
                else{
                    set({sessions : get().sessions.filter((ses)=>{
                        return ses._id != data.sessionId;
                    })});
                }
            }
        })
    },
    leaveSession : async(id,userid)=>{
        try {
            const response = await axiosInstance.post(`/session/leaveSession/${id}`,{userId: userid})
            set({code : ""})
            toast.success("Session left .")
        } catch (error) {
            console.log("error in leaveSession : ",error);
            toast.error(error.response.data.message);
        }
    },
    listenToSessionLeft : ()=>{
        const socket = useAuthStore.getState().socket;
        const onlineUsers = useAuthStore.getState().onlineUsers;
        const authUser = useAuthStore.getState().authUser;
        console.log("Enter the listenToSessionLeft.")
        socket?.off("userLeftSession");
        socket?.on("userLeftSession",(data)=>{
            console.log("Entered userLeftSession .")

            if(onlineUsers.includes(authUser._id)){
                console.log("userLeftSession Emitted .")
                console.log(data);
                if(authUser._id == data.user._id){
                    console.log("U left and event reached .")
                    set({selectedSession : null})
                }
                else if(authUser._id == data.session.creator || data.session.participants.includes(authUser._id)){
                    toast.success( `${data.user.username} left the session.`);
                    set({selectedSession : 
                        {...get().selectedSession,
                            participants : get().selectedSession.participants.filter((par)=>{
                                return par != data.user._id;
                    })}})
                }
                else{
                    set({sessions : get().sessions.map((ses)=>{
                        if(ses._id == data.session._id){
                            return {...ses,participants : ses.participants.filter((par)=>{
                                return par != data.user._id;
                            })}
                        }
                        return ses;
                    })});
                }
            }
        })
    },
    sendMessage : async(text)=>{
        try {
            if(!get().chat){
                toast.error("No chat bhai shaeb.")
                return;
            }
            const response = await axiosInstance.post(`/chat/${get().chat._id}`,{text});
            set({chat : {
                ...get().chat,
                messages:[
                    ...get().chat.messages,response.data.newMessage
                ]
            }})
        } catch (error) {
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }
    },
    listenToMessages : ()=>{
        const socket = useAuthStore.getState().socket;
        const onlineUsers = useAuthStore.getState().onlineUsers;
        const authUser = useAuthStore.getState().authUser;

        socket?.off("newMessage");
        socket?.on("newMessage",(data)=>{
            if(onlineUsers.includes(authUser._id) && authUser._id != data.newMessage.senderId){
                if(data.session.participants.includes(authUser._id) || data.session.creator == authUser._id){
                    set({chat : {...get().chat,messages:[...get().chat.messages,data.newMessage]}})
                }
            }
        })
    },
    listenCodeChange : ()=>{
        const socket = useAuthStore.getState().socket;
        const onlineUsers = useAuthStore.getState().onlineUsers;
        const authUser = useAuthStore.getState().authUser;

        socket?.off("changeCode");
        socket?.on("changeCode",(data)=>{
            if(authUser._id != data.whoChanged){
                if(data.updatedSession.participants.includes(authUser._id) || data.updatedSession.creator == authUser._id){
                    console.log("listened changeCode : ",data.updatedSession.code)
                    set({selectedSession : data.updatedSession})
                    set({code:data.updatedSession.code})
                }
            }
        })
    },
    isRunning:false,
    onRun : async(requestData)=>{
        set({isRunning : true});
        try {
            const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-RapidAPI-Key": "1fb8a08e94msh7b578b47fdde6b4p11a927jsncebc456b3acf", 
                  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
                body: JSON.stringify(requestData),
              })
            const result = await response.json();

            if(result.stdout){
                return result.stdout;
            }else if(result.stderr){
                return `Error : ${result.stderr}`;
            }else if (result.compile_output) {
                return `Compilation Error: ${result.compile_output}`;
            } else {
                return "Unknown Error";
            }
        } catch (error) {
            console.log("Error in onRun func : ",error);
            return "Unknow error";
        }finally{
            set({isRunning : false})
        }
    }
}),{
    name: 'session-storage', // Key for localStorage
    getStorage: () => localStorage, // Use localStorage (could also use sessionStorage)
}))