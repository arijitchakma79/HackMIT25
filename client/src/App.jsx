
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const APP_TITLE = 'Synthra';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'main', 'parameters', 'profile'
  // Sliders state for parameters screen
  const [sliderValues, setSliderValues] = useState([95, 95, 95, 95]);
  // Text input state for main screen
  const [vibeText, setVibeText] = useState('');

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

  const handleAddVocals = () => {
    // Navigate to parameters screen or handle add vocals functionality
    setCurrentScreen('parameters')
  }

  const handleVisualize = () => {
    // Navigate to parameters screen for visualization
    setCurrentScreen('parameters')
  }

  if (currentScreen === 'profile') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          className="app"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <motion.header 
            className="header"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div 
              className="title"
              whileHover={{ color: "#ff4444", scale: 1.05 }}
            >
              {APP_TITLE}
            </motion.div>
            <div className="header-right">
              <motion.button 
                className="home-button" 
                onClick={handleHomeClick}
                whileHover={{ 
                  color: "#ff4444",
                  backgroundColor: "rgba(255, 68, 68, 0.1)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
            </div>
          </motion.header>
          
          <motion.main 
            className="profile-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div 
              className="profile-header"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div 
                className="profile-picture"
                whileHover={{ scale: 1.05, rotate: 5 }}
              ></motion.div>
              <div className="profile-info">
                <motion.h2 
                  className="profile-name"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Profile Name
                </motion.h2>
                <motion.p 
                  className="profile-bio"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Bio words:
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div 
              className="saved-songs-section"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.h3 
                className="saved-songs-title"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Saved Songs:
              </motion.h3>
              <motion.div className="songs-list">
                {['Song1 - Vibe description', 'Song2 - Vibe description', 'Song3 - Vibe description', 'Song4 - Vibe description'].map((song, index) => (
                  <motion.div 
                    key={index}
                    className="song-item"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    whileHover={{ 
                      x: 10, 
                      backgroundColor: "rgba(255, 68, 68, 0.1)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {song}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.main>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (currentScreen === 'parameters') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          className="app parameters-app"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <motion.header 
            className="header"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div 
              className="title"
              whileHover={{ color: "#ff4444", scale: 1.05 }}
            >
              {APP_TITLE}
            </motion.div>
            <div className="header-right">
              <motion.button 
                className="home-button" 
                onClick={handleHomeClick}
                whileHover={{ 
                  color: "#ff4444",
                  backgroundColor: "rgba(255, 68, 68, 0.1)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
            </div>
          </motion.header>
          <motion.main 
            className="parameters-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="left-panel"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.img 
                src="/splash.png" 
                alt="Splash" 
                className="splash-image"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div 
              className="right-panel"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <motion.h2 
                className="parameters-title"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Parameters
              </motion.h2>
              <motion.div className="parameters-list">
                {[0, 1, 2, 3].map((idx) => (
                  <motion.div 
                    className="parameter-item" 
                    key={idx}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      backgroundColor: "rgba(255, 68, 68, 0.05)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <span className="param-label">Param</span>
                    <div className="slider-container">
                      <motion.input
                        type="range"
                        className="param-slider"
                        min="0"
                        max="100"
                        value={sliderValues[idx]}
                        onChange={e => handleSliderChange(idx, Number(e.target.value))}
                        whileHover={{ scale: 1.02 }}
                        whileFocus={{ scale: 1.02 }}
                      />
                      <motion.span 
                        className="param-value"
                        key={sliderValues[idx]}
                        initial={{ scale: 1.2, color: "#ff4444" }}
                        animate={{ scale: 1, color: "#333" }}
                        transition={{ duration: 0.2 }}
                      >
                        {sliderValues[idx]}%
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.main>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (currentScreen === 'main') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          className="app"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.header 
            className="header"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div 
              className="title"
              whileHover={{ color: "#ff4444", scale: 1.05 }}
            >
              {APP_TITLE}
            </motion.div>
            <div className="header-right">
              <motion.button 
                className="home-button" 
                onClick={handleHomeClick}
                whileHover={{ 
                  color: "#ff4444",
                  backgroundColor: "rgba(255, 68, 68, 0.1)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
            </div>
          </motion.header>
          
          <motion.main 
            className="main-screen"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div 
              className="vibe-input-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.input 
                type="text" 
                className="vibe-input" 
                placeholder="Describe your vision..."
                value={vibeText}
                onChange={(e) => setVibeText(e.target.value)}
                whileFocus={{ 
                  scale: 1.02,
                  borderColor: "#ff4444",
                  boxShadow: "0 0 0 3px rgba(255, 68, 68, 0.1)"
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.div 
                className="button-row"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.button 
                  className="add-vocals-btn" 
                  onClick={handleAddVocals}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#ff6666",
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Add vocals
                </motion.button>
                <motion.button 
                  className="visualize-btn" 
                  onClick={handleVisualize}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#f0f0f0",
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Visualize
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.main>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <motion.div 
      className="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="title"
          whileHover={{ 
            color: "#ff4444", 
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        >
          {APP_TITLE}
        </motion.div>
        <div className="header-right">
          <motion.button 
            className="login-text" 
            onClick={handleLogin}
            whileHover={{ 
              y: -2,
              color: "#ff4444",
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <motion.button 
            className="login-button" 
            onClick={handleProfileClick}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              backgroundColor: "#ff6666",
              boxShadow: "0 4px 16px rgba(255, 68, 68, 0.5)",
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
          </motion.button>
        </div>
      </motion.header>
      
      <motion.main 
        className="main-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <motion.h1 
          className="slogan"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          synthesize your musical + artistic visions
        </motion.h1>
      </motion.main>
    </motion.div>
  )
}

export default App
