
import { useState } from 'react'
import './App.css'

const APP_TITLE = 'Synthra';

// Helper function to format time in MM:SS format
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0 || !isFinite(timeInSeconds)) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('home') // 'home', 'main', 'parameters', 'profile'
  // Sliders state for parameters screen
  const [sliderValues, setSliderValues] = useState([95, 95, 95, 95]);
  // Text input state for main screen
  const [vibeText, setVibeText] = useState('');
  // Audio playback state
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const handleVisualize = async () => {
    if (!vibeText.trim()) {
      alert('Please describe your vision first!');
      return;
    }

    setIsLoading(true);
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

  if (currentScreen === 'main') {
    return (
      <div className="app">
        <header className="header">
          <div className="title">{APP_TITLE}</div>
          <div className="header-right">
            <button className="home-button" onClick={handleHomeClick}>Home</button>
          </div>
        </header>
        
        <main className="main-screen">
          <div className="vibe-input-container">
            <input 
              type="text" 
              className="vibe-input" 
              placeholder="Describe your vision..."
              value={vibeText}
              onChange={(e) => setVibeText(e.target.value)}
              disabled={isLoading}
            />
            
            
            <div className="button-row">
              <button className="add-vocals-btn" onClick={handleAddVocals} disabled={isLoading}>Add vocals</button>
              <button className="visualize-btn" onClick={handleVisualize} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Visualize'}
              </button>
            </div>
            
            {isLoading && (
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
