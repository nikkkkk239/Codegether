import {create} from "zustand"
import { axiosInstance } from "../lib/AxiosInstance.js"
import toast from "react-hot-toast"
export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile : false,
    isCheckingAuth : false,
    checkAuth:async()=>{
        try {
            set({isCheckingAuth : true})
            const response = await axiosInstance.get("/auth/checkAuth");
            console.log("checkAuth response : ",response.data);
            set({authUser:response.data})
        } catch (error) {
            console.log('Error in checkAuth : ',error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth : false})
        }
    },
    register:async(details)=>{
        try {
            set({isSigningUp : true})
            const response = await axiosInstance.post("/auth/register",details)
            set({authUser : response.data})
            toast.success(`Welcome ${details.username}.`)
        } catch (error) {
            console.log('Error in register : ',error)
            toast.error(error.response.data.message)
            set({authUser:null})
        }finally{
            set({isSigningUp:false})
        }
    },
    logout:async()=>{
        try {
            const response = await axiosInstance.post("/auth/logout");
            set({authUser : null});
        } catch (error) {
            console.log("Error occured in logout : ",error);
            toast.error(error.response.data.message)
        }
    },login:async(details)=>{
        try {
            set({isLoggingIn : true});
            const response = await axiosInstance.post("/auth/login",details);
            console.log(response.data)
            set({authUser : response.data})
            toast.success(`Successfully logged in .`)

        } catch (error) {
            console.log("Error occured in login : ",error);
            toast.error(error.response.data.message);
        }finally{
            setTimeout(()=>{
                set({isLoggingIn : false})
            },100)
        }
    }
}))