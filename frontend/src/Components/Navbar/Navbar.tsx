import React from 'react'
import './Navbar.scss'
import { FaHome, FaBell } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {

  const logout = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  const user = localStorage.getItem('user')
  const parsedUser = user && JSON.parse(user)
  const path = parsedUser?.avatar ? "/upload/" + parsedUser.avatar?.split(',')[0] : '/upload/default.jpg'

  console.log({path})



  return (
    <div className='navbar'>
      <div className='navbar__container'>
        <div className='navbar__avatar-icon'>
          {/* <Link to='/avatar'> */}
            <img src={path} alt='avatar' />
          {/* </Link> */}
        </div>

        <div className='navbar__icons-container'>
          <Link to="/">
            <div className='navbar__icon-container'>
              <FaHome />
            </div>
          </Link>
          <Link to='/chats'>
            <div className='navbar__icon-container'>
              <RiMessage2Fill />
            </div>
          </Link>
          {/* <Link to="/notifications"> */}
            <div className='navbar__icon-container'>
              <FaBell />
            </div>
          {/* </Link> */}
          {/* <Link to ='/settings'> */}
            <div className='navbar__icon-container'>
              <IoMdSettings />
            </div>
          {/* </Link> */}
        </div>

        <div onClick={logout} className='navbar__logout-icon'>
          <IoLogOut />
        </div>
      </div>
    </div>
  )
}

export default Navbar