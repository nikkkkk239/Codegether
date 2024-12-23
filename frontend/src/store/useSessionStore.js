import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/AxiosInstance";

export const useSessionStore = create((set,get)=>({
    isFetchingSessions : false,
    isSessionCreating : false,
    isSessionJoining : false,
    selectedSession:null,
    sessions:[],
    chat:null,
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
            set({selectedSession : response.data.session})
            set({chat : response.data.chat})
            set({sessions:[...get().sessions , response.data.session]})
            toast.success("Session created Successfull .")
        } catch (error) {
            console.log("error in createSession : ",error);
            toast.error(error.response.data.message);
        }finally{
            set({isSessionCreating : false})
        }
    }
}))