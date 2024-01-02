import React, {useState} from 'react'
import './Avatar.scss'

const Avatar : React.FC = () => {

const user = localStorage.getItem('user')
  const parsedUser = user && JSON.parse(user)
  const path = parsedUser?.avatar ? "/upload/" + parsedUser.avatar?.split(',')[0] : '/upload/default.jpg'
  const [files, setFiles] = useState([]);

  const handleFileChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };


  return (
    <div className='avatar'>
        <div className='avatar__container'>
            <div className='avatar__settings'>
                <div className='avatar__avatar-icon'>
                    <img src={path} alt='avatar' />
                </div>
                <h2>Zmień avatar</h2>
                <div className='register__input-container'>
                    <h3>Wybierz zdjęcie</h3>
                    <input onChange={handleFileChange}  type="file" name="image" accept="image/*" id="fileInput" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Avatar