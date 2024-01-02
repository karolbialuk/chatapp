import React, {useState} from "react";
import "./Login.scss"
import { IoAccessibility } from "react-icons/io5";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navigate } from "react-router-dom";

const Login: React.FC = () => {

  const navigate = useNavigate()

  interface Inputs {
    email : string,
    password: string,
  }

  const [response, setResponse] = useState<string | null>(null)
  const [inputs, setInputs] = useState<Inputs>({
    email: '',
    password: '',
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev)=> ({...prev, [e.target.name]: e.target.value}))
  }


  const handleLogin = async () => {
    try{
      const res = await axios.post('http://localhost:8800/api/auth/login', inputs, { withCredentials: true,})

      if(res.status === 200){
        setResponse("Pomyślnie zalogowano.")
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate("/")
      } else{
        setResponse(res.data)
      }

      
    }catch(err: any){
      setResponse(err.response?.data || 'Błąd podczas komunikacji z serwerem.')
    }
  }

  return (
    <div className='login'>
        <div className='login__container'>
                <div className='login__img-inputs-container'>
                    <div className='login__img-container'>
                        <h1>Moje social app</h1>
                      <div className='login__img'>
                        <div className='login__icon'>
                            <IoAccessibility />
                        </div>
                      </div>
                    </div>
                    <div className='login__elements-container'>
                    <h2>Zaloguj się na swoje konto</h2>
                      <div className='login__inputs-container'>
                          <div className='login__input-container'>
                              <h3>Email</h3>
                              <input onChange={handleChange}  type="text" name='email' placeholder='Wpisz swój email' />
                          </div>
                          <div className='login__input-container'>
                              <h3>Hasło</h3>
                              <input onChange={handleChange}  type="password" name='password' placeholder='Wpisz swoje hasło' />
                          </div>
                      </div>
                      <div className="login__elements">
                        <button onClick={handleLogin} className='login__login-btn'>Zaloguj się</button>
                            <p>{response && response}</p>
                            <Link to="/register">
                            <p>Nie masz jeszcze konta? <span>Zarejstruj się</span></p>
                            </Link>
                            <p className='login__social-icons-p'>Znajdz mnie oraz moje inne projekty</p>
                            <div className='login__social-icons'>
                                <a href="https://github.com/karolbialuk" target="_blank" rel="noopener noreferrer">
                                    <div className="login__social-icon">
                                        <FaGithub />
                                    </div>
                                </a>
                                <a href="https://www.linkedin.com/in/karol-bialuk-61772227b/" target="_blank" rel="noopener noreferrer">
                                    <div className="login__social-icon">
                                        <FaLinkedin />
                                    </div>
                                </a>
                            </div>
                      </div>
                    </div>
                </div>
        </div>
    </div>
        )
};

export default Login;
