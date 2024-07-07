import React from 'react';
import './App.css'
import {Routes, Route, BrowserRouter} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
          </Routes>
      </BrowserRouter>
  )
}

export default App
