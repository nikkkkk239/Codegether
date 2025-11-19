import {create} from "zustand"
import { axiosInstance } from "../lib/AxiosInstance.js"
import toast from "react-hot-toast"
import {io} from "socket.io-client"

const BASEURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
console.log("My env : - ",import.meta.env.VITE_REACT_APP_BACKEND_BASEURL)

export const useAuthStore = create((set,get)=>({
    authUser : JSON.parse(localStorage.getItem('authUser')) || null,
    token: localStorage.getItem('token') || null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile : false,
    isCheckingAuth : false,
    onlineUsers : [],
    socket:null,
    isSocketConnected : false,
    checkAuth:async()=>{
        try {
            set({isCheckingAuth : true})
            const response = await axiosInstance.get("/auth/checkAuth");
            console.log("checkAuth response : ",response.data);
            // response.data should be user object
            set({authUser: response.data});
            localStorage.setItem('authUser', JSON.stringify(response.data));
            get().connectSocket()
        } catch (error) {
            console.log('Error in checkAuth : ',error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth : false})
        }
    },
    getUser :async (id)=>{
        try {
            const response = await axiosInstance.get(`/auth/getUser/${id}`)
            return response.data;
        } catch (error) {
            console.log('Error in register : ',error)
        }
    },
    register:async(details)=>{
        try {
            set({isSigningUp : true})
            const response = await axiosInstance.post("/auth/register",details)
            // response.data -> { user, token }
            const { user, token } = response.data;
            set({ authUser: user, token });
            localStorage.setItem('authUser', JSON.stringify(user));
            localStorage.setItem('token', token);
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
            // Remove local token and user on client
            localStorage.removeItem('token');
            localStorage.removeItem('authUser');
            set({ authUser: null, token: null });
            get().disconnectSocket();
        } catch (error) {
            console.log("Error occured in logout : ",error);
            toast.error(error?.response?.data?.message || 'Logout failed')
        }
    },login:async(details)=>{
        try {
            set({isLoggingIn : true});
            const response = await axiosInstance.post("/auth/login",details);
            console.log(response.data)
            // response.data -> { user, token }
            const { user, token } = response.data;
            set({ authUser: user, token });
            localStorage.setItem('authUser', JSON.stringify(user));
            localStorage.setItem('token', token);
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
            socket.removeAllListeners(); // Remove previous listeners to prevent duplication
        }
    console.log("Base : -",BASEURL);
        // Initialize the socket connection
        const newSocket = io(BASEURL, {
            withCredentials:true,
            transports:['websocket'],
            query: { userId: authUser._id },
            reconnection: true, // Enable automatic reconnection
            reconnectionAttempts: 5, // Set a max number of attempts
            reconnectionDelay: 1000, // Delay between attempts
        });
    
        // Set the new socket in the store
        set({ socket: newSocket });
    
        // Listen for events
        newSocket.on("connect", () => {
            console.log("Socket connected: ", newSocket.id);
            set({ isSocketConnected: true }); // Update state to reflect connection
        });
    
        newSocket.on("getOnlineUsers", (data) => {
            console.log("Received online users: ", data);
            set({ onlineUsers: data }); // Update the list of online users
        });
    
        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error: ", err.message);
        });
    
        newSocket.on("disconnect", () => {
            console.log("Socket disconnected.");
            set({ isSocketConnected: false }); // Update state to reflect disconnection
        });
    },
    
    disconnectSocket : ()=>{
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
            try {
                socket.removeAllListeners();
            } catch (e) {
                // ignore if already removed
            }
            set({ isSocketConnected: false, socket: null });
        }
    }
}))