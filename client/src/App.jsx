import { useState } from 'react'
import './App.css'
import './LoginPopup.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'main', 'parameters'
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [activeTab, setActiveTab] = useState('signin') // 'signin' or 'create'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [createError, setCreateError] = useState('')

  const handleLoginClick = () => {
    setShowLoginPopup(!showLoginPopup)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'user' && password === 'pass') {
      setCurrentScreen('main')
      setShowLoginPopup(false)
      setLoginError('')
      setUsername('')
      setPassword('')
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const handleCreateAccount = (e) => {
    e.preventDefault()
    // For now, just simulate successful account creation
    setCurrentScreen('main')
    setShowLoginPopup(false)
    setCreateError('')
    setName('')
    setEmail('')
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    setCurrentScreen('home')
    setShowLoginPopup(false)
  }

  const handleMusicPrompt = () => {
    setCurrentScreen('parameters')
  }

  if (currentScreen === 'parameters') {
    return (
      <div className="app parameters-app">
        <header className="header">
          <div className="title">Synthra</div>
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
          <div className="title">Synthra</div>
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
        <div className="title">Synthra</div>
        <div className="header-right">
          <button className="login-text" onClick={handleLoginClick}>Login</button>
          <button className="login-button"></button>
          {showLoginPopup && (
            <div className="login-popup">
              <div className="login-popup-header">
                <h3>Sign In</h3>
              </div>
              
              <div className="tab-container">
                <div 
                  className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => setActiveTab(activeTab === 'signin' ? '' : 'signin')}
                >
                  <span className="tab-arrow">▶</span>
                  <span>Sign In</span>
                </div>
                
                {activeTab === 'signin' && (
                  <div className="tab-content signin-tab-content">
                    <form onSubmit={handleLogin}>
                      <div className="form-group">
                        <label>Username:</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password:</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      {loginError && <div className="error-message">{loginError}</div>}
                      <button type="submit" className="signin-btn">Sign In</button>
                    </form>
                  </div>
                )}
                
                <div 
                  className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                  onClick={() => setActiveTab(activeTab === 'create' ? '' : 'create')}
                >
                  <span className="tab-arrow">▶</span>
                  <span>Create An Account</span>
                </div>
                
                {activeTab === 'create' && (
                  <div className="tab-content">
                    <form onSubmit={handleCreateAccount}>
                      <div className="form-group">
                        <label>Name:</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email:</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Username:</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password:</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      {createError && <div className="error-message">{createError}</div>}
                      <button type="submit" className="signin-btn">Create Account</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="main-content">
        <h1 className="slogan">synthesize your musical + artistic visions</h1>
      </main>
    </div>
  )
}

export default App
