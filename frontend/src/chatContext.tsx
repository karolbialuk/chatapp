import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface ChatProviderProps {
    children: ReactNode;
  }

  interface ChatContextType {
    user1Id: string;
    setUser1Id: React.Dispatch<React.SetStateAction<any>>;
    user2Id: string;
    setUser2Id: React.Dispatch<React.SetStateAction<any>>;
    Room: string;
    setRoom: React.Dispatch<React.SetStateAction<any>>;
    Username: string;
    setUsername: React.Dispatch<React.SetStateAction<any>>;
    Avatar: string;
    setAvatar:React.Dispatch<React.SetStateAction<any>>;
  }

  const chatContext = createContext<ChatContextType | undefined>(undefined)

export function useChatContext() : ChatContextType{
    const context = useContext(chatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

export function ChatProvider({children} : ChatProviderProps){
    
    const [user1Id, setUser1Id] = useState<any>(null)
    const [user2Id, setUser2Id] = useState<any>(null)
    const [Room, setRoom] = useState<any>(null)
    const [Username, setUsername] = useState<string>("")
    const [Avatar, setAvatar] = useState<string>("")
    
    const contextValue : ChatContextType = {
        user1Id,
        setUser1Id,
        user2Id,
        setUser2Id,
        Room,
        setRoom,
        Username,
        setUsername,
        Avatar,
        setAvatar,
    }

    return (
        <chatContext.Provider value={contextValue}>
            {children}
        </chatContext.Provider>
    )
}