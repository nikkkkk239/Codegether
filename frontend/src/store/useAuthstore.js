import {create} from "zustand"
import { axiosInstance } from "../lib/AxiosInstance.js"
import toast from "react-hot-toast"
import {io} from "socket.io-client"
export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile : false,
    isCheckingAuth : false,
    onlineUsers : [],
    socket:null,
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
            get().connectSocket();
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
            get().disconnectSocket();
        } catch (error) {
            console.log("Error occured in logout : ",error);
            toast.error(error.response.data.message)
        }
    },login:async(details)=>{
        try {
            set({isLoggingIn : true});
            const response = await axiosInstance.post("/auth/login",details);
            console.log(response.data)
            set({ authUser: response.data });
            toast.success(`Successfully logged in .`)
            get().connectSocket()
        } catch (error) {
            console.log("Error occured in login : ",error);
            toast.error(error.response.data.message);
        }finally{
            setTimeout(()=>{
                set({isLoggingIn : false})
            },100)
        }
    },
    connectSocket: async () => {
        const { authUser, socket } = get();
    
        // Avoid reconnecting if user is not authenticated or socket is already connected
        if (!authUser || socket?.connected) return;
    
        // Clean up existing socket before creating a new one
        if (socket) {
            socket.disconnect();
        }
    
        // Initialize the socket connection
        const newSocket = io("http://localhost:3001", {
            query: { userId: authUser._id },
        });
    
        // Set the new socket in the store
        set({ socket: newSocket });
    
        // Listen for events
        newSocket.on("connect", () => {
            console.log("Socket connected: ", newSocket.connected);
        });
    
        newSocket.on("getOnlineUsers", (data) => {
            console.log("Received online users: ", data);
            set({ onlineUsers: data });
        });
    
        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error: ", err);
        });
        newSocket.on("disconnect", () => {
            console.log("Socket disconnected.");
        });
    },
    
    disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket?.disconnect()
    }
}))