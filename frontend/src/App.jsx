import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom' 
import Register from "./Components/auth/Register"

function App() {
 

  return (
    <>
      <Routes>
      <Route path ="/login" element={<Register/>}/>
      </Routes>
      
    </>
  )
}

export default App
