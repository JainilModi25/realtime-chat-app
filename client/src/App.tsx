import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
// import {Button} from "@/components/ui/button"

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/auth" />} />    //for all other routes requested by user
      </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App
