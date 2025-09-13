import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return (
      <div className="app">
        <header className="header">
          <div className="title">title</div>
          <div className="header-right">
            <button className="logout-button" onClick={handleLogout}></button>
          </div>
        </header>
        
        <main className="login-screen">
          <h2 className="message-title">Message to user</h2>
          <div className="voice-input-area">
            <button className="input-voice-btn">Input voice</button>
            <button className="voice-control-btn"></button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title">Synthra</div>
        <div className="header-right">
          <button className="login-text" onClick={handleLogin}>Login</button>
          <button className="login-button"></button>
        </div>
      </header>
      
      <main className="main-content">
        <h1 className="slogan">synthesize your musical + artistic visions</h1>
      </main>
    </div>
  )
}

export default App
