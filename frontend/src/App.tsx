import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { Login, Register, Home, Chats, Notifications, Settings, Avatar } from './Pages';
import { Navbar, Chat } from './Components';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./App.scss"
import { ChatProvider } from './chatContext'

const App: React.FC = () => {

  const queryClient = new QueryClient()

  const Layout = () => {
    return (
      <>
      <QueryClientProvider client={queryClient}>
        <div className='app'>
          <div className='app__container'>
            <Navbar />
            <Outlet/>
            <Chat />
          </div>
        </div>
      </QueryClientProvider>
      </>
    )
  }

  interface ProtectedRouteProps {
    children: ReactNode;
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    if(!localStorage.getItem("user")){
      return <Navigate to ='/login' />
    }
    return <>{children}</>;
  }
 

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
        
      ),
      children: [{
        path: '/',
        element: (
          <Home />
        )
      },{
        path: '/chats',
        element: (
          <Chats />
        )
      },
      {
        path: '/notifications',
        element: (
          <Notifications />
        )
      },
      {
        path: '/settings',
        element: (
          <Settings />
        )
      },
      {
        path: '/avatar',
        element: (
          <Avatar />
        )
      }
    ]
    },{
      path: '/login',
      element: <Login />
    },{
      path: '/register',
      element: <Register />
    }
  ])

  return (
    <ChatProvider>
      <RouterProvider router={router}/>
    </ChatProvider>
    
  )
}

export default App;

