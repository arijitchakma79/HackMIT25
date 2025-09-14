import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import './LoginPopup.css'
import './SavedSong.css'
import HydraVisual from './HydraVisual.jsx'
import VoiceInput from './components/VoiceInput'
import DJChat from './components/DJChat'

// Helper function to format time in MM:SS format
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0 || !isFinite(timeInSeconds)) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function App() {

  // Animation variants
  const screenVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const screenTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.6
  };

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const slideVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 }
  };

  const scaleVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.9 }
  };

  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [activeTab, setActiveTab] = useState('signin') // 'signin' or 'create'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [createError, setCreateError] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const parameterNames = [
    'pixelatation', 
    'brightness', 
    'inversion'
  ]

  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'main', 'parameters', 'profile'
  // Sliders state for parameters screen (now only 3 parameters)
  const [sliderValues, setSliderValues] = useState([0, 50, 5]); // pixelate, brightness, invert
  // Text input state for main screen
  const [vibeText, setVibeText] = useState('');
  // Audio playback state
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Restore song data from sessionStorage on component mount
  useEffect(() => {
    const savedSongData = sessionStorage.getItem('synthraCurrentSong');
    if (savedSongData) {
      try {
        const songData = JSON.parse(savedSongData);
        console.log('Restoring song data from session:', songData);
        
        // Restore audioUrl if it exists
        if (songData.audioUrl) {
          console.log('Restoring audioUrl:', songData.audioUrl);
          setAudioUrl(songData.audioUrl);
        }
        
        // Restore vibeText if it exists
        if (songData.vibeText) {
          console.log('Restoring vibeText:', songData.vibeText);
          setVibeText(songData.vibeText);
        }
        
        // Restore slider values if they exist and match current parameter count
        if (songData.sliderValues) {
          console.log('Restoring sliderValues:', songData.sliderValues);
          // Only restore if the array length matches current parameter count
          if (songData.sliderValues.length === parameterNames.length) {
            setSliderValues(songData.sliderValues);
          } else {
            console.log('Slider values length mismatch, using defaults');
            // Keep the default values we set in useState
          }
        }
      } catch (error) {
        console.error('Error parsing saved song data:', error);
        // Clear corrupted data
        sessionStorage.removeItem('synthraCurrentSong');
      }
    } else {
      console.log('No saved song data found in session storage');
    }
  }, []);

  // Helper function to save song data to sessionStorage
  const saveSongToSession = (audioUrl, vibeText, sliderValues) => {
    const songData = {
      audioUrl,
      vibeText,
      sliderValues,
      timestamp: Date.now()
    };
    console.log('Saving song data to session:', songData);
    sessionStorage.setItem('synthraCurrentSong', JSON.stringify(songData));
  };

  // Helper function to clear song data from sessionStorage
  const clearSongFromSession = () => {
    sessionStorage.removeItem('synthraCurrentSong');
  };


  const handleLoginClick = () => {
    setShowLoginPopup(!showLoginPopup)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'hacker' && password === 'hackmit') {
      // Check if there's a saved song to determine where to navigate
      const savedSongData = sessionStorage.getItem('synthraCurrentSong');
      let hasSavedSong = false;
      
      if (savedSongData) {
        try {
          const songData = JSON.parse(savedSongData);
          hasSavedSong = songData.audioUrl;
        } catch (error) {
          console.error('Error checking saved song data:', error);
        }
      }
      
      // Navigate to parameters if there's a saved song, otherwise to main
      setCurrentScreen(hasSavedSong ? 'parameters' : 'main')
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
    // Check if there's a saved song to determine where to navigate
    const savedSongData = sessionStorage.getItem('synthraCurrentSong');
    let hasSavedSong = false;
    
    if (savedSongData) {
      try {
        const songData = JSON.parse(savedSongData);
        hasSavedSong = songData.audioUrl;
      } catch (error) {
        console.error('Error checking saved song data:', error);
      }
    }
    
    // Navigate to parameters if there's a saved song, otherwise to main
    setCurrentScreen(hasSavedSong ? 'parameters' : 'main')
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
    // Clear song data when logging out
    clearSongFromSession();
    setAudioUrl(null);
    setVibeText('');
  }

  const handleMusicPrompt = () => {
    setCurrentScreen('parameters')
  }

  const handleSliderChange = (index, value) => {
    const newValues = [...sliderValues]
    newValues[index] = value
    setSliderValues(newValues)
    
    // Save updated slider values to sessionStorage if there's an active song
    if (audioUrl && vibeText) {
      saveSongToSession(audioUrl, vibeText, newValues);
    }
  }

  const handleValueClick = (index) => {
    setEditingIndex(index)
  }

  const handleValueChange = (index, value) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0))
    handleSliderChange(index, numValue)
  }


  const handleValueBlur = () => {
    setEditingIndex(null)
  }

  const handleVisualize = async () => {
    if (!vibeText.trim()) {
      alert('Please describe your vision first!');
      return;
    }

    setIsLoading(true);
    setAudioUrl(null);
    
    try {
      // Use the new style-based generation endpoint
      const response = await fetch('http://localhost:5001/api/generate-from-style', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: vibeText  // Send as style description, not lyrics
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.audio_url) {
        setAudioUrl(result.audio_url);
        setCurrentScreen('parameters'); // Navigate to parameters page after generating music
        // Save song data to sessionStorage for persistence across navigation
        saveSongToSession(result.audio_url, vibeText, sliderValues);
      } else {
        throw new Error('No audio URL returned from server');
      }
    } catch (error) {
      console.error('Error generating music:', error);
      console.error('Error details:', error.message);
      alert(`Failed to generate music: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleValueKeyPress = (e) => {
    if (e.key === 'Enter') {
      setEditingIndex(null)
    }
  }

  const handleAddVocals = () => {
    // Add vocals functionality here
    console.log('Add vocals clicked');
  }

  const handleHomeClick = () => {
    console.log('Navigating to home, current audioUrl:', audioUrl);
    setCurrentScreen('home')
  }

  const handleParametersClick = () => {
    console.log('Navigating to parameters, current audioUrl:', audioUrl);
    setCurrentScreen('parameters')
  }

  const handleNewSongClick = () => {
    console.log('Starting new song creation');
    setCurrentScreen('main')
  }

  const handleDiscardSongClick = () => {
    console.log('Discarding current song');
    // Clear song data from state
    setAudioUrl(null);
    setVibeText('');
    // Clear song data from sessionStorage
    clearSongFromSession();
    // Go back to main screen for new song creation
    setCurrentScreen('main');
  }

  const handleProfileClick = () => {
    setCurrentScreen('profile')
  }

  const handleVoiceTranscript = (transcript) => {
    setVibeText(transcript)
  }

  const handleDJMusicPrompt = async (prompt) => {
    if (!prompt.trim()) {
      alert('DJ needs a better description to work with!');
      return;
    }

    setVibeText(prompt); // Store the prompt for display
    setIsLoading(true);
    setAudioUrl(null);
    
    try {
      // Use the new style-based generation endpoint for DJ prompts too
      const response = await fetch('http://localhost:5001/api/generate-from-style', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: prompt  // Send as style description
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.audio_url) {
        setAudioUrl(result.audio_url);
        setCurrentScreen('parameters'); // Navigate to parameters page after generating music
        // Save song data to sessionStorage for persistence across navigation
        saveSongToSession(result.audio_url, prompt, sliderValues);
      } else {
        throw new Error('No audio URL returned from server');
      }
    } catch (error) {
      console.error('Error generating music:', error);
      console.error('Error details:', error.message);
      alert(`Failed to generate music: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }

  if (currentScreen === 'parameters') {
    console.log('Rendering parameters screen with audioUrl:', audioUrl, 'vibeText:', vibeText);
    return (
      <motion.div 
        className="app parameters-app"
        variants={screenVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={screenTransition}
      >
        <motion.header 
          className="header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="title"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Synthra
          </motion.div>
          <div className="header-right">
            <motion.button 
              className="home-button" 
              onClick={handleHomeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </motion.button>
            <motion.button 
              className="new-song-button" 
              onClick={handleNewSongClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Song
            </motion.button>
            <motion.button 
              className="discard-song-button" 
              onClick={handleDiscardSongClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discard Song
            </motion.button>
            <motion.button 
              className="login-button" 
              onClick={handleProfileClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </div>
        </motion.header>
        
        <motion.main 
          className="parameters-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div 
            className="left-panel"
            variants={slideVariants}
            initial="initial"
            animate="in"
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <HydraVisual 
              width={600} 
              height={600} 
              userParams={{
                pixelate: sliderValues[0],
                brightness: sliderValues[1],
                invert: sliderValues[2]
              }}
            />
          </motion.div>
          <motion.div 
            className="right-panel"
            variants={slideVariants}
            initial="initial"
            animate="in"
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <motion.h2 
              className="parameters-title"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Parameters
            </motion.h2>
            <div className="parameters-list">
              {sliderValues.map((value, index) => (
                <motion.div 
                  className="parameter-item" 
                  key={index}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="param-label">{parameterNames[index]}</span>
                  <div className="slider-container">
                    <motion.input 
                      type="range" 
                      className="param-slider" 
                      min="0" 
                      max="100" 
                      value={value} 
                      onChange={(e) => handleSliderChange(index, e.target.value)}
                      whileHover={{ scale: 1.05 }}
                      whileFocus={{ scale: 1.05 }}
                    />
                    {editingIndex === index ? (
                      <motion.input 
                        type="number" 
                        className="param-value-edit" 
                        value={value} 
                        onChange={(e) => handleValueChange(index, e.target.value)} 
                        onBlur={handleValueBlur} 
                        onKeyPress={handleValueKeyPress}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                      />
                    ) : (
                      <motion.span 
                        className="param-value" 
                        onClick={() => handleValueClick(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {value}%
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <AnimatePresence>
              {audioUrl && (
                <motion.div 
                  className="audio-player-params"
                  variants={scaleVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="player-header"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h3>Your Generated Music</h3>
                    <p>Based on: "{vibeText}"</p>
                  </motion.div>
                  <motion.audio 
                    src={audioUrl}
                    controls
                    className="audio-element-params"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    onLoadedMetadata={(e) => {
                      const audioDuration = e.target.duration;
                      console.log('onLoadedMetadata - duration:', audioDuration);
                      console.log('onLoadedMetadata - isFinite:', isFinite(audioDuration));
                      console.log('onLoadedMetadata - readyState:', e.target.readyState);
                      if (isFinite(audioDuration) && audioDuration > 0) {
                        setDuration(audioDuration);
                        console.log('Duration set to:', audioDuration);
                      } else if (audioDuration === Infinity) {
                        console.log('Streaming audio detected - duration will be unknown until buffered');
                        setDuration(-1); // Use -1 to indicate streaming/unknown duration
                      }
                    }}
                    onCanPlayThrough={(e) => {
                      const audioDuration = e.target.duration;
                      console.log('onCanPlayThrough - duration:', audioDuration);
                      console.log('onCanPlayThrough - isFinite:', isFinite(audioDuration));
                      if (isFinite(audioDuration) && audioDuration > 0) {
                        setDuration(audioDuration);
                        console.log('Duration set via onCanPlayThrough:', audioDuration);
                      }
                    }}
                    onTimeUpdate={(e) => {
                      setCurrentTime(e.target.currentTime);
                      // Fallback: try to get duration if not already set
                      if (duration === 0 && isFinite(e.target.duration) && e.target.duration > 0) {
                        console.log('Duration found in onTimeUpdate:', e.target.duration);
                        setDuration(e.target.duration);
                      }
                    }}
                    onLoadedData={(e) => {
                      const audioDuration = e.target.duration;
                      console.log('onLoadedData - duration:', audioDuration);
                      if (isFinite(audioDuration) && audioDuration > 0) {
                        setDuration(audioDuration);
                        console.log('Duration set via onLoadedData:', audioDuration);
                      }
                    }}
                    onDurationChange={(e) => {
                      const audioDuration = e.target.duration;
                      console.log('onDurationChange - duration:', audioDuration);
                      if (isFinite(audioDuration) && audioDuration > 0) {
                        setDuration(audioDuration);
                        console.log('Duration set via onDurationChange:', audioDuration);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setIsPlaying(false);
                    }}
                  >
                    Your browser does not support audio playback.
                  </motion.audio>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.main>
      </motion.div>
    )
  }

  if (currentScreen === 'profile') {
    return (
      <motion.div 
        className="app"
        variants={screenVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={screenTransition}
      >
        <motion.header 
          className="header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="title"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Synthra
          </motion.div>
          <div className="header-right">
            <motion.button 
              className="home-button" 
              onClick={handleHomeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </motion.button>
            <motion.button 
              className="login-button" 
              onClick={handleProfileClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </div>
        </motion.header>
        
        <motion.main 
          className="profile-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div 
            className="profile-header"
            variants={fadeVariants}
            initial="initial"
            animate="in"
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <motion.div 
              className="profile-picture"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
            <motion.div 
              className="profile-info"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.h2 
                className="profile-name"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                John Doe
              </motion.h2>
              <motion.p 
                className="profile-bio"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                Music enthusiast and creative visionary. Love experimenting with different sounds and artistic expressions.
              </motion.p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="saved-songs-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <motion.h3 
              className="saved-songs-title"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              Saved Songs
            </motion.h3>
            <div className="songs-list">
              {['Ethereal Dreams - Created 2 days ago', 'Urban Nights - Created 1 week ago', 'Ocean Breeze - Created 2 weeks ago', 'Mountain Echo - Created 1 month ago'].map((song, index) => (
                <motion.div 
                  key={index}
                  className="song-item"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {song}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.main>
      </motion.div>
    )
  }

  if (currentScreen === 'main') {
    return (
      <motion.div 
        className="app"
        variants={screenVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={screenTransition}
      >
        <motion.header 
          className="header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="title"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Synthra
          </motion.div>
          <div className="header-right">
            <motion.button 
              className="home-button" 
              onClick={handleHomeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </motion.button>
            <AnimatePresence>
              {audioUrl && (
                <motion.button 
                  className="generated-song-button" 
                  onClick={handleParametersClick}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Generated Song
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button 
              className="login-button" 
              onClick={handleProfileClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </div>
        </motion.header>

        <motion.main 
          className="main-screen"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div 
            className="vibe-input-container"
            variants={fadeVariants}
            initial="initial"
            animate="in"
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <DJChat 
              onMusicPrompt={handleDJMusicPrompt}
              disabled={isLoading}
            />
            
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  className="loading-state"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    DJ Synthra is cooking up your track... This may take up to 2 minutes.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.main>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="app"
      variants={screenVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={screenTransition}
    >
      <motion.header 
        className="header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div 
          className="title"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Synthra
        </motion.div>
        <div className="header-right">
          <motion.button 
            className="login-text" 
            onClick={handleLoginClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <motion.button 
            className="login-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <AnimatePresence>
            {showLoginPopup && (
              <motion.div 
                className="login-popup"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="login-popup-header"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <h3>Sign In</h3>
                </motion.div>
                
                <div className="tab-container">
                  <motion.div 
                    className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
                    onClick={() => setActiveTab(activeTab === 'signin' ? '' : 'signin')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span 
                      className="tab-arrow"
                      animate={{ rotate: activeTab === 'signin' ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▶
                    </motion.span>
                    <span>Sign In</span>
                  </motion.div>
                  
                  <AnimatePresence>
                    {activeTab === 'signin' && (
                      <motion.div 
                        className="tab-content signin-tab-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <form onSubmit={handleLogin}>
                          <motion.div 
                            className="form-group"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          >
                            <label>Username:</label>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </motion.div>
                          <motion.div 
                            className="form-group"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <label>Password:</label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </motion.div>
                          <AnimatePresence>
                            {loginError && (
                              <motion.div 
                                className="error-message"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                              >
                                {loginError}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <motion.button 
                            type="submit" 
                            className="signin-btn"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sign In
                          </motion.button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab(activeTab === 'create' ? '' : 'create')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span 
                      className="tab-arrow"
                      animate={{ rotate: activeTab === 'create' ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▶
                    </motion.span>
                    <span>Create An Account</span>
                  </motion.div>
                  
                  <AnimatePresence>
                    {activeTab === 'create' && (
                      <motion.div 
                        className="tab-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <form onSubmit={handleCreateAccount}>
                          <motion.div 
                            className="form-group"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          >
                            <label>Name:</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </motion.div>
                          <motion.div 
                            className="form-group"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.3 }}
                          >
                            <label>Email:</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </motion.div>
                          <motion.div 
                            className="form-group"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <label>Username:</label>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </motion.div>
                          <motion.div 
                            className="form-group"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.3 }}
                          >
                            <label>Password:</label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </motion.div>
                          <AnimatePresence>
                            {createError && (
                              <motion.div 
                                className="error-message"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                              >
                                {createError}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <motion.button 
                            type="submit" 
                            className="signin-btn"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Create Account
                          </motion.button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
      
      <motion.main 
        className="main-content"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h1 
          className="slogan"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          synthesize your musical + artistic visions
        </motion.h1>
      </motion.main>
    </motion.div>
  )
}

export default App
