import React, {useState, useEffect} from "react";
import './Chat.scss'
import { IoIosCall, IoIosAttach } from "react-icons/io";
import { FaCamera, FaSmileBeam } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import io from 'socket.io-client'
import { useChatContext } from '../../chatContext';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { IoMdSend } from "react-icons/io";

const Chat: React.FC = () => {
  const socket = io("http://localhost:3001");

  const storedUser = localStorage.getItem('user');
  const currentUserName = storedUser ? JSON.parse(storedUser)?.firstname + " " + JSON.parse(storedUser)?.lastname : null;
  const user1Id = storedUser ? JSON.parse(storedUser)?.id : null;

  

  interface Message {
    id: string,
    room: string,
    author: string,
    message: string,
    time: string,
  }

  const {user2Id, setUser2Id, Room, Username, Avatar} = useChatContext()

  const [currentMessage, setCurrentMessage] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [messageList, setMessageList] = useState<Message[]>([])

  const joinRoom = () => {
    if(username !== '' && Room !== ""){
      socket.emit("join_room", Room)
    }
  }

  useEffect(() => {
    setUsername(currentUserName || "")
    setMessageList([])
    setCurrentMessage("")
   joinRoom()
  }, [Room])

  const sendMessage = async (event : any) => {
    if (currentMessage !== "") {
      const messageData = {
        id: Date.now().toString(),
        room: Room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: '2-digit' })
      };

      socket.emit('send_message', messageData)
  
      try {
        await axios.post(
          "http://localhost:8800/api/messages",
          { user1Id, user2Id, Room, messagesString: JSON.stringify([messageData]) },
          { withCredentials: true }
        );
  
        setMessageList((list) => {
          const updatedMessageList = [...list, messageData];
          return updatedMessageList;
        });
  
        setCurrentMessage("");

        event.target.value = ''
      } catch (error) {
        console.error("Wystąpil błąd", error);
      }
    }
  };


  // PIERWSZA WERSJA

  // const { data } = useQuery(
  //   {
  //     queryKey: ['messages', Room],
  //     queryFn: async ({ queryKey }) => {
  //       const [, currentRoom] = queryKey;
  //       if (currentRoom) {
  //         return axios.get(`http://localhost:8800/api/messages?roomId=${currentRoom}`, {
  //           withCredentials: true,
  //         }).then((res) => {
  //           return res.data;
  //         });
  //       }
  //       return Promise.resolve([]);
  //     },
  //     enabled: !!Room,
  //   }
  // );

  // const { data } = useQuery(
  //   {
  //     queryKey: ['messages'],
  //     queryFn: async ({ queryKey }) => {
  //       const [, user1Id] = queryKey;
  //         return axios.get(`http://localhost:8800/api/messages?user1Id=12&user2Id=4`, {
  //           withCredentials: true,
  //         }).then((res) => {
  //           return res.data;
  //         });
  //     },
  //   }
  // );

  console.log({user2: user2Id})

   const { data } = useQuery(
    {
      queryKey: ['messages', user2Id],
      queryFn: async ({ queryKey }) => {
        const [, user2Id] = queryKey;
        if (user2Id) {
          return axios.get(`http://localhost:8800/api/messages?user1Id=${user1Id}&user2Id=${user2Id}`, {
            withCredentials: true,
            }).then((res) => {
            return res.data;
          });
        }
        return Promise.resolve([]);
      },
      enabled: !!user2Id,
    }
  );
  
 
  useEffect(() => {

    socket.on("receive_message", (data) => {
     setMessageList((list) => [...list, data])
    });
    
  }, [socket])
  
  console.log(messageList)


  return (
    <div className="chat">
      <div className="chat__container">
          <div className="chat__navbar">
            <div className="chat__user-details">
              {user2Id && <div className="chat__img">
                <img src={Avatar ? '/upload/' + Avatar : '/upload/default.jpg'} alt='avatar' />
              </div>}
              <div className="chat__user-info">
                <h3>{Username && Username}</h3>
              </div>
            </div>
           
           {user2Id && <div className="chat__icons">
              <div className="chat__icon">
                <IoIosCall />
              </div>
              <div className="chat__icon">
                <FaCamera />
              </div>
              <div className="chat__icon">
                <BsThreeDotsVertical />
              </div>
            </div>}
          </div>
          <div className="chat__content">
            {data && data.map((item : any, index: number) => {
              return (
                <div key={index} className={`chat__message-cloud-${username === JSON.parse(item.messages)[0].author ? "right" : "left"}`}>
                    <p>{JSON.parse(item.messages)[0].message}</p>
                    <h3>{JSON.parse(item.messages)[0].time}</h3>
                </div>
              )
            })}
            {messageList.filter((message, index, array) => array.findIndex(m => m.id === message.id) === index).map((item, index) => {
              return (
                  <div key={index} className={`chat__message-cloud-${username === item.author ? "right" : "left"}`}>
                    <p>{item.message}</p>
                    <h3>{item.time}</h3>
                  </div>
              )
            })}
          </div>
          <div className="chat__type-bar">
            <input onKeyPress={(event) => {event.key === "Enter" && sendMessage(event)}} onChange={(e) => {setCurrentMessage(e.target.value)}} type='text' placeholder="Wpisz swoją wiadomość tutaj..." />
            <button onClick={(event) => sendMessage(event)}>
              <IoMdSend />
            </button>
              {/* <div className="chat__search-icons">
                <div className="chat__search-icon">
                  <FaCamera />
                </div>
                <div className="chat__search-icon">
                  <FaSmileBeam />
                </div>
                <div className="chat__search-icon">
                  <IoIosAttach />
                </div>
              </div> */}
          </div>
        </div>
    </div>
  )
};

export default Chat;
