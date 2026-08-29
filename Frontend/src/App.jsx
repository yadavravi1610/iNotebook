import React from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import FileUpload from './Pages/FileUpload'



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path ="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/file-upload" element={<FileUpload/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
