import { createContext, useContext, useState } from "react";

export const modalContext = createContext({});

export const ModalContextProvider = ({children})=>{
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalType,setModalType] = useState("")

    return <modalContext.Provider value={{modalType,setModalType,isModalOpen,setIsModalOpen}}>
        {children}
    </modalContext.Provider>
}