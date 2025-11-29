import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './page/Auth/Login'
import SignUp from './page/Auth/SignUp'
import MainPage from './page/MainPage'
import { Toaster } from 'react-hot-toast'
import UserProvider from './context/UserContext'
import Adopt from './page/Adopt'
import UserProfile from './page/user/HomeUser'

function App() {
  return (
    <UserProvider>

      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/adopt' element={<Adopt />} />
          <Route path='/user' element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App


const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}