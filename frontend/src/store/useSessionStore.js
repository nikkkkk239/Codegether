import toast from "react-hot-toast";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/AxiosInstance";
import {persist} from "zustand/middleware"
export const useSessionStore = create(
    persist((set,get)=>({
    sessionClicked : null,
    setSessionClicked :(ses)=>{
        set({sessionClicked : ses})
    },
    isFetchingSessions : false,
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
            set({isFetchingSessions:true})
            const response = await axiosInstance.get("/session/");
            set({sessions : response.data })
        }catch (error) { 
            console.log("error in createSession : ",error);
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
    joinSession : async(details)=>{
        const data = {password:details.password}
        try {
            set({isSessionJoining : true})
            const response = await axiosInstance.post(`/session/${details.id}`,data);
            set({selectedSession : get().sessionClicked})
            set({chat : response.data.chat})
            toast.success("Session joined successfully.")
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

        socket?.on("newSession",(data)=>{
            if(onlineUsers.includes[authUser._id]){
                set({sessions : [...get().sessions,data.session]})
                set({chat : data.chat})
            }
        })

    },
    unListenToSession : ()=>{
        const socket = useAuthStore.getState().socket;
        socket?.off("newSession");
    }
}),{
    name: 'session-storage', // Key for localStorage
    getStorage: () => localStorage, // Use localStorage (could also use sessionStorage)
}))