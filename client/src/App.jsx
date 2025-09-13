import { useState } from 'react'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'main', 'parameters'

  const handleLogin = () => {
    setCurrentScreen('main')
  }

  const handleLogout = () => {
    setCurrentScreen('home')
  }

  const handleMusicPrompt = () => {
    setCurrentScreen('parameters')
  }

  if (currentScreen === 'parameters') {
    return (
      <div className="app">
        <header className="header">
          <div className="title">title</div>
          <div className="header-right">
            <button className="logout-button" onClick={handleLogout}></button>
          </div>
        </header>
        
        <main className="parameters-screen">
          <div className="left-panel">
            <img src="/splash.png" alt="Splash" className="splash-image" />
          </div>
          <div className="right-panel">
            <h2 className="parameters-title">Parameters</h2>
            <div className="parameters-list">
              <div className="parameter-item">
                <span className="param-label">Param</span>
                <div className="slider-container">
                  <input type="range" className="param-slider" min="0" max="100" value="95" readOnly />
                  <span className="param-value">95%</span>
                </div>
              </div>
              <div className="parameter-item">
                <span className="param-label">Param</span>
                <div className="slider-container">
                  <input type="range" className="param-slider" min="0" max="100" value="95" readOnly />
                  <span className="param-value">95%</span>
                </div>
              </div>
              <div className="parameter-item">
                <span className="param-label">Param</span>
                <div className="slider-container">
                  <input type="range" className="param-slider" min="0" max="100" value="95" readOnly />
                  <span className="param-value">95%</span>
                </div>
              </div>
              <div className="parameter-item">
                <span className="param-label">Param</span>
                <div className="slider-container">
                  <input type="range" className="param-slider" min="0" max="100" value="95" readOnly />
                  <span className="param-value">95%</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (currentScreen === 'main') {
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
            <button className="voice-control-btn" onClick={handleMusicPrompt}>Music_Prompt</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title">title</div>
        <div className="header-right">
          <button className="login-text" onClick={handleLogin}>Login</button>
          <button className="login-button"></button>
        </div>
      </header>
      
      <main className="main-content">
        <h1 className="slogan">Some Slogan</h1>
      </main>
    </div>
  )
}

export default App
