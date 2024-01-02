import React, {useEffect, useState} from 'react'
import './Chats.scss'
import { FaSearch } from "react-icons/fa";
import { useQuery, useQueries } from '@tanstack/react-query';
import axios from 'axios'
import { useChatContext } from '../../chatContext';
import { LiaHourglassEndSolid } from "react-icons/lia";
import io from 'socket.io-client'

const Chats : React.FC = () => {

    interface userData {
        id: string,
        user_firstname : string,
        user_lastname: string,
        email: string,
        gender: string,
        accepted: string,
        friendRequestId: string,
        idAddedFriend: string,
        addedFriend_firstname: string,
        addedFriend_lastname: string,
        user_avatar: string,
        addedFriend_avatar: string,
        room: number,
        last_messages: string,
    }

    interface Message {
        messages: string,
        user1Id: number,
        user2Id: number,
    }

    const socket = io("http://localhost:3001");

    const {user1Id, setUser1Id, user2Id, setUser2Id, setRoom, Room, setUsername, setAvatar} = useChatContext()

    const storedUser = localStorage.getItem('user');
    const currentUserId = storedUser ? JSON.parse(storedUser).id : null;
    const username = storedUser ? JSON.parse(storedUser).firstname + " " + JSON.parse(storedUser).lastname : null;
    const [searchValue, setSearchValue] = useState<string>("")
    const [results, setResults] = useState<Message[]>([]);

    const { isLoading, data, isError, refetch }= useQuery<userData[]>(
        {queryKey: ['friends'],
        queryFn: () => 
        axios.get('http://localhost:8800/api/friends', {
            withCredentials: true,
        }).then((res) => {
            return res.data;
        })}
    )

    console.log(data)





   const chatClick = (e: any, itemId : string, firstname: string, lastname: string, avatar: string, room: number) => {
    setUser1Id(currentUserId)
    setUser2Id(itemId)
    setUsername(`${firstname} ${lastname}`)
    setAvatar(avatar)
    setRoom(room)
   }

   const cancelRequest = async (e: any, friendRequestId: any) => {
    e.preventDefault();
    e.stopPropagation();
    const values = {
        friendRequestId
    };
    await axios.post("http://localhost:8800/api/friends/cancel", values, {
        headers: {'Content-Type' : 'application/json'},
        withCredentials: true,
    }).then(() => {
        refetch();
    });
};

   const acceptRequest = async (e: any, friendRequestId: any) => {
    e.preventDefault();
    e.stopPropagation();
    const values = {
        friendRequestId
    };
    await axios.post("http://localhost:8800/api/friends/accept", values, {
        headers: {'Content-Type' : 'application/json'},
        withCredentials: true,
    }).then(() => {
        refetch();
    });
   }

  return (
    <div className='chats'>
        <div className='chats__container'>

            <div className='chats__search-bar-container'>
                <div className='chats__search-bar-icon'>
                    <FaSearch />
                </div>
                <div className='chats__search-bar'>
                    <input onChange={(e) => {setSearchValue(e.target.value)}} type='text' />
                </div>
            </div>

            {/* <div className='chats__groups'>
            <h3>Grupy</h3>
                <div className='chats__gropus-container'>
                    <div className='chats__element'>
                        <div className='chats__img-container'>
                            <div className='chats__img'>
                                <img src="https://transfery.info/img/photos/88244/1500xauto/cristiano-ronaldo.jpg" alt="avatar" />
                            </div>
                        </div>
                        <div className='chats__info'>
                            <h3>Friends Forever</h3>
                            <p>Hahahahaha</p>
                        </div>
                        <div className='chats__info2'>
                            <p>Dzisiaj, 12:30</p>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className='chats__people'>
            <h3>Znajomi</h3>
                {isLoading ? (
                'Ładowanie'
            ) : isError ? (
                'Wystąpił błąd podczas ładowania danych'
            ) :  data ? (
                data.filter((item) => item.addedFriend_firstname.toLowerCase().includes(searchValue.toLowerCase()) || item.addedFriend_lastname.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())).map((item, index) => (
                <div key={index} id={item.id} onClick={(e) =>
                    currentUserId === item.id && item.accepted === 'true'
                      ? chatClick(e, item.idAddedFriend, item.addedFriend_firstname, item.addedFriend_lastname, item.addedFriend_avatar?.split(',')[0], item.room)
                      : currentUserId === item.idAddedFriend && item.accepted === 'true' ? chatClick(e, item.id, item.user_firstname, item.user_lastname, item.user_avatar, item.room) : ''
                  }className='chats__people-container'>
                    <div className='chats__element'>
                        <div className='chats__img-container'>
                            <div className='chats__img'>
                                <img src={item.id === currentUserId && item.addedFriend_avatar ? '/upload/' + item.addedFriend_avatar?.split(',')[0] : item.idAddedFriend === currentUserId && item.user_avatar ? item.user_avatar.split(',')[0] : '/upload/default.jpg'} alt="avatar" />
                            </div>
                        </div>
                        <div className='chats__info'>
                            {currentUserId === item.id ? <h3>{item.addedFriend_firstname} {item.addedFriend_lastname}</h3> : <h3>{item.user_firstname} {item.user_lastname}</h3>}
                            {item.last_messages && <p>{JSON.parse(item.last_messages)[0]?.message}</p>}
                            {/* CURRENT USER ID = 4 */}

                            {/* JEZELI ITEM.ID JEST ROWNE CURRENT USER ID CZYLI 4 TO WYSWIETL addedFriend_firstname i addedFriend_lastname, JEZELI ITEM.ID JEST ROWNE CURRENT USER ID CZYLI 8 WYSWIETL USER_FIRSTNAME i USER_LASTNAME*/}
                        </div>
                        <div className='chats__info2'>
                            {item.accepted === 'false' && item.idAddedFriend === currentUserId ? 
                            <div className='chats__addfriend-btn'>
                                <button onClick={(e) => acceptRequest(e, item.friendRequestId)}>Akceptuj</button>
                                <button onClick={(e) => cancelRequest(e, item.friendRequestId)}>Odrzuć</button>
                            </div> 
                            : item.accepted === 'false' && item.id === currentUserId ? 
                            <div className='chats__addfriend-icon'>
                                <p>Wysłano zapro...</p>
                               <LiaHourglassEndSolid />
                            </div> 
                            : ""}
                          
                        </div>
                    </div>
                </div>
                ))
            ) : ("Brak danych")}
            </div>
        </div>
    </div>
  )
}

export default Chats