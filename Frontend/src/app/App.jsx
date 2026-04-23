import React, { useEffect } from 'react'
import { useSocket } from './hooks/AppSocket'
import { useAuthCheck } from "../hooks/useAuthCheck";


const App = () => {
  useAuthCheck();
  const socket = useSocket();
  
  useEffect(() => {
    socket.on("connect",()=>{
          console.log("User connected:- ",socket.id)
    })
  
    return () => {
      socket.disconnect();
    }
  }, [])
  
  

  return (
    <div className='w-0 h-0'></div>
  )
}

export default App