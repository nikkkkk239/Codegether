import {create} from "zustand"
import { axiosInstance } from "../lib/AxiosInstance.js"
import toast from "react-hot-toast"
export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile : false,
    isCheckingAuth : true,
    checkAuth:async()=>{
        try {
            const response = await axiosInstance.get("/auth/checkAuth");
            console.log("checkAuth response : ",response.data);
            set({authUser:response.data})
        } catch (error) {
            console.log('Error in checkAuth : ',error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth : false})
        }
    }
}))