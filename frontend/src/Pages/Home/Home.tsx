import React, {useState, useEffect} from 'react'
import './Home.scss'
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Home: React.FC = () => {
const storedUser = localStorage.getItem('user');
const currentUserId = storedUser ? JSON.parse(storedUser)?.id : null;
const [searchValue, setSearchValue] = useState<string>("")
const [filteredUsers, setFilteredUsers] = useState<userData[]>([]);

interface userData {
    id: string,
    firstname : string,
    lastname: string,
    email: string,
    gender: string,
    avatar: string,
    
}

interface friendData {
    accepted: string,
    firstname: string,
    friendRequestId: string,
    id: string,
    idAddedFriend: number,
    lastname: string,
}

const { isLoading, data, isError, refetch }= useQuery<userData[]>(
    {queryKey: ['users'],
    queryFn: () => 
    axios.get('http://localhost:8800/api/auth/users?searchValue=' + searchValue, {
        withCredentials: true,
    }).then((res) => {
        return res.data;
    })}
)

const { data: friendsData }= useQuery<friendData[]>(
    {queryKey: ['friends'],
    queryFn: () => 
    axios.get('http://localhost:8800/api/friends', {
        withCredentials: true,
    }).then((res) => {
        return res.data;
    })}
)


useEffect(() => {
    const updatedFilteredUsers = data?.filter((user) => {
        const isFriend = friendsData?.some((friend: any) => friend.idAddedFriend === user.id);
        const isCurrentUser = friendsData?.some((friend: any) => friend.id === user.id);
        return !(isFriend || isCurrentUser);
      });
      setFilteredUsers(updatedFilteredUsers || []);
}, [data, friendsData])

console.log( )


useEffect(() => {
    refetch()
}, [searchValue, filteredUsers])

const addFriend = async (id: any) => {
    console.log('Adding friend:', id);
    const values = {
      idUser: currentUserId,
      idAddedFriend: id,
    };

    try {
      const res = await axios.post("http://localhost:8800/api/friends/", values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.status === 200) {
        setFilteredUsers(prevFilteredUsers => {
            const updatedFilteredUsers = prevFilteredUsers.filter((friend) => friend.id !== id)
            return updatedFilteredUsers
        })
        
      }
    } catch (error: any) {
      console.log(error.response?.data || 'Błąd podczas komunikacji z serwerem.');
    }
    console.log('Filtered users after update:', filteredUsers);
  };

  




  return (
    <div className='home'>
    <div className='home__container'>
        <div className='home__search-bar-container'>
            <div className='home__search-bar-icon'>
                <FaSearch />
            </div>
            <div className='home__search-bar'>
                <input onChange={(e) => {setSearchValue(e.target.value)}} type='text' />
            </div>
        </div>

        <div className='home__groups'>
        <h3>Szukaj znajomych</h3>
            <div className='home__gropus-container'>
                 {isLoading ? (
                'Ładowanie'
            ) : isError ? (
                'Wystąpił błąd podczas ładowania danych'
            ) :  filteredUsers ? (
                filteredUsers.filter((item) => item.id !== currentUserId && (item.firstname.toLowerCase().includes(searchValue.toLowerCase())|| item.lastname.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) )).map((item, index) => (
                <div key={item.id} id={item.id} className='home__element'>
                    <div className='home__img-container'>
                        <div className='home__img'>
                            <img src={`/upload/${item.avatar ? item.avatar.split(',')[0] : 'default.jpg'}`} alt="avatar" />
                        </div>
                    </div>
                    <div className='home__info'>
                        <h3>{item.firstname} {item.lastname}</h3>
                    </div>
                    <div className='home__info2'>
                        <button onClick={() => addFriend(item.id)}>Dodaj</button>
                    </div>
                </div>
                ))
            ) : ("Brak danych")}
            </div>
        </div>
    </div>
</div>
  )
}

export default Home