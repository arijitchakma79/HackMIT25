import { useState, useEffect } from 'react'
import './App.css'
import './SavedSong.css'
import './responsive.css'
import HydraVisual from './HydraVisual.jsx'
import VoiceInput from './components/VoiceInput'
import LoginPage from './LoginPage.jsx'

// Helper function to format time in MM:SS format
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0 || !isFinite(timeInSeconds)) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function App() {

  const [showLoginPage, setShowLoginPage] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [savedSongs, setSavedSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [audioElement, setAudioElement] = useState(null)
  const parameterNames = [
    'Pixelverse (pixelate)', 
    'Luminance (brightness)', 
    'Inversion (invert)'
  ]

  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'main', 'parameters', 'profile'
  // Sliders state for parameters screen (now only 3 parameters)
  const [sliderValues, setSliderValues] = useState([30, 50, 0]); // pixelate, brightness, invert
  // Text input state for main screen
  const [vibeText, setVibeText] = useState('');
  // Audio playback state
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
    setShowLoginPage(true)
  }

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
    setShowLoginPage(false)
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
  }

  const handleBackToApp = () => {
    setShowLoginPage(false)
  }


  const handleLogout = () => {
    setCurrentScreen('home')
    setIsLoggedIn(false)
    setUser(null)
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

    setIsGenerating(true);
    setAudioUrl(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: vibeText
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
      setIsGenerating(false);
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

  if (currentScreen === 'parameters') {
    console.log('Rendering parameters screen with audioUrl:', audioUrl, 'vibeText:', vibeText);
    return (
      <div className="app parameters-app">
        <header className="header">
          <div className="title">Synthra</div>
          <div className="header-right">
            <button className="home-button" onClick={handleHomeClick}>Home</button>
            <button className="new-song-button" onClick={handleNewSongClick}>New Song</button>
            <button className="discard-song-button" onClick={handleDiscardSongClick}>Discard Song</button>
            <button className="login-button" onClick={handleProfileClick}></button>
          </div>
        </header>
        
        <main className="parameters-screen">
          <div className="left-panel">
            <HydraVisual 
              width={600} 
              height={600} 
              userParams={{
                pixelate: sliderValues[0],
                brightness: sliderValues[1],
                invert: sliderValues[2]
              }}
            />
          </div>
          <div className="right-panel">
            <h2 className="parameters-title">Parameters</h2>
            <div className="parameters-list">
              {sliderValues.map((value, index) => (
                <div className="parameter-item" key={index}>
                  <span className="param-label">{parameterNames[index]}</span>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      className="param-slider" 
                      min="0" 
                      max="100" 
                      value={value} 
                      onChange={(e) => handleSliderChange(index, e.target.value)}
                    />
                    {editingIndex === index ? (
                      <input 
                        type="number" 
                        className="param-value-edit" 
                        value={value} 
                        onChange={(e) => handleValueChange(index, e.target.value)} 
                        onBlur={handleValueBlur} 
                        onKeyPress={handleValueKeyPress}
                      />
                    ) : (
                      <span className="param-value" onClick={() => handleValueClick(index)}>{value}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {audioUrl && (
              <div className="audio-player-params">
                <div className="player-header">
                  <h3>Your Generated Music</h3>
                  <p>Based on: "{vibeText}"</p>
                </div>
                <audio 
                  src={audioUrl}
                  controls
                  className="audio-element-params"
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
                </audio>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  if (currentScreen === 'profile') {
    return (
      <div className="app">
        <header className="header">
          <div className="title">Synthra</div>
          <div className="header-right">
            <button className="home-button" onClick={handleHomeClick}>Home</button>
            <button className="login-button" onClick={handleProfileClick}></button>
          </div>
        </header>
        
        <main className="profile-content">
          <div className="profile-header">
            <div className="profile-picture"></div>
            <div className="profile-info">
              <h2 className="profile-name">John Doe</h2>
              <p className="profile-bio">Music enthusiast and creative visionary. Love experimenting with different sounds and artistic expressions.</p>
            </div>
          </div>
          
          <div className="saved-songs-section">
            <h3 className="saved-songs-title">Saved Songs</h3>
            <div className="songs-list">
              <div className="song-item">Ethereal Dreams - Created 2 days ago</div>
              <div className="song-item">Urban Nights - Created 1 week ago</div>
              <div className="song-item">Ocean Breeze - Created 2 weeks ago</div>
              <div className="song-item">Mountain Echo - Created 1 month ago</div>
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
            <button className="home-button" onClick={handleHomeClick}>Home</button>
            {audioUrl && (
              <button className="generated-song-button" onClick={handleParametersClick}>Generated Song</button>
            )}
            <button className="login-button" onClick={handleProfileClick}></button>
          </div>
        </header>

        <main className="main-screen">
          <div className="vibe-input-container">
            <VoiceInput 
              onTranscriptChange={handleVoiceTranscript}
              disabled={isGenerating}
              placeholder="Click to start voice input"
            />
            
            <input 
              type="text" 
              className="vibe-input" 
              placeholder="Describe your vision... or use voice input above"
              value={vibeText}
              onChange={(e) => setVibeText(e.target.value)}
              disabled={isGenerating}
            />
            
            <div className="button-row">
              <button className="add-vocals-btn" onClick={handleAddVocals} disabled={isGenerating}>Add vocals</button>
              <button className="visualize-btn" onClick={handleVisualize} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Visualize'}
              </button>
            </div>
            
            {isGenerating && (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Generating your music... This may take up to 2 minutes.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // Show login page if requested
  if (showLoginPage) {
    return <LoginPage onLogin={handleLoginSuccess} onBack={handleBackToApp} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title">Synthra</div>
        <div className="header-right">
          {isLoggedIn ? (
            <>
              <span className="user-name">Welcome, {user?.name || user?.email}</span>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="login-text" onClick={handleLoginClick}>Login</button>
          )}
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
