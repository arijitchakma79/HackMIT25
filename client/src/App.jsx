
import { useState } from 'react'
import './App.css'

const APP_TITLE = 'Synthra';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'main', 'parameters', 'profile'
  // Sliders state for parameters screen
  const [sliderValues, setSliderValues] = useState([95, 95, 95, 95]);

  const handleSliderChange = (index, value) => {
    const newValues = [...sliderValues];
    newValues[index] = value;
    setSliderValues(newValues);
  }  

  const handleLogin = () => {
    setCurrentScreen('main')
  }

  const handleLogout = () => {
    setCurrentScreen('home')
  }

  const handleMusicPrompt = () => {
    setCurrentScreen('parameters')
  }

  const handleProfileClick = () => {
    setCurrentScreen('profile')
  }

  const handleHomeClick = () => {
    setCurrentScreen('home')
  }

  if (currentScreen === 'profile') {
    return (
      <div className="app">
        <header className="header">
          <div className="title">{APP_TITLE}</div>
          <div className="header-right">
            <button className="home-button" onClick={handleHomeClick}>Home</button>
          </div>
        </header>
        
        <main className="profile-content">
          <div className="profile-header">
            <div className="profile-picture"></div>
            <div className="profile-info">
              <h2 className="profile-name">Profile Name</h2>
              <p className="profile-bio">Bio words:</p>
            </div>
          </div>
          
          <div className="saved-songs-section">
            <h3 className="saved-songs-title">Saved Songs:</h3>
            <div className="songs-list">
              <div className="song-item">Song1 - Vibe description</div>
              <div className="song-item">Song2 - Vibe description</div>
              <div className="song-item">Song3 - Vibe description</div>
              <div className="song-item">Song4 - Vibe description</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (currentScreen === 'parameters') {
    return (
      <div className="app parameters-app">
        <header className="header">
          <div className="title">{APP_TITLE}</div>
          <div className="header-right">
            <button className="home-button" onClick={handleHomeClick}>Home</button>
          </div>
        </header>
        <main className="parameters-screen">
          <div className="left-panel">
            <img src="/splash.png" alt="Splash" className="splash-image" />
          </div>
          <div className="right-panel">
            <h2 className="parameters-title">Parameters</h2>
            <div className="parameters-list">
              {[0, 1, 2, 3].map((idx) => (
                <div className="parameter-item" key={idx}>
                  <span className="param-label">Param</span>
                  <div className="slider-container">
                    <input
                      type="range"
                      className="param-slider"
                      min="0"
                      max="100"
                      value={sliderValues[idx]}
                      onChange={e => handleSliderChange(idx, Number(e.target.value))}
                    />
                    <span className="param-value">{sliderValues[idx]}%</span>
                  </div>
                </div>
              ))}
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
          <div className="title">{APP_TITLE}</div>
          <div className="header-right">
            <button className="home-button" onClick={handleHomeClick}>Home</button>
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
  <div className="title">{APP_TITLE}</div>
        <div className="header-right">
          <button className="login-text" onClick={handleLogin}>Login</button>
          <button className="login-button" onClick={handleProfileClick}></button>
        </div>
      </header>
      
      <main className="main-content">
        <h1 className="slogan">synthesize your musical + artistic visions</h1>
      </main>
    </div>
  )
}

export default App
