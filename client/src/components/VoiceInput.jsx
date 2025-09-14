import { useState, useEffect } from 'react';
import useSpeechToText from '../hooks/useSpeechToText';

const VoiceInput = ({ onTranscriptChange, disabled = false, placeholder = "Click to start voice input" }) => {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText();

  const [hasTranscript, setHasTranscript] = useState(false);

  // Update parent component when transcript changes
  useEffect(() => {
    if (transcript && onTranscriptChange) {
      onTranscriptChange(transcript);
      setHasTranscript(true);
    }
  }, [transcript, onTranscriptChange]);

  const handleToggleListening = () => {
    if (disabled) return;
    
    if (isListening) {
      stopListening();
    } else {
      // Clear any previous transcript
      resetTranscript();
      setHasTranscript(false);
      // Clear the parent component's text as well
      if (onTranscriptChange) {
        onTranscriptChange('');
      }
      startListening();
    }
  };

  const handleClearTranscript = () => {
    resetTranscript();
    setHasTranscript(false);
    if (onTranscriptChange) {
      onTranscriptChange('');
    }
  };

  if (!isSupported) {
    return (
      <div className="voice-input-unsupported">
        <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
          Speech recognition is not supported in this browser.
          <br />
          Try using Chrome, Edge, or Safari for voice input.
        </p>
      </div>
    );
  }

  return (
    <div className="voice-input-container" style={{ marginBottom: '15px' }}>
      <div className="voice-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={handleToggleListening}
          disabled={disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: isListening ? '#ff6b6b' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
          title={isListening ? 'Stop recording' : 'Start voice input'}
        >
          <span style={{ fontSize: '16px' }}>
            {isListening ? '⏹️' : '🎤'}
          </span>
          <span>
            {isListening ? 'Stop Recording' : 'Voice Input'}
          </span>
        </button>

        {hasTranscript && (
          <button
            onClick={handleClearTranscript}
            style={{
              padding: '8px 12px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title="Clear transcript"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffcccc',
          borderRadius: '4px',
          color: '#cc0000',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error}
          <br />
          <small>Please check your microphone permissions and try again.</small>
        </div>
      )}

      {isListening && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: '#e8f5e8',
          border: '1px solid #c8e6c9',
          borderRadius: '4px',
          color: '#2e7d32',
          fontSize: '14px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ff4444',
            animation: 'pulse 1s infinite'
          }}></div>
          <span>🎙️ Listening... Speak now</span>
        </div>
      )}

      {transcript && (
        <div style={{
          marginTop: '10px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Voice Input:</strong>
          <p style={{ 
            margin: '8px 0 0 0', 
            fontStyle: 'italic',
            color: '#555'
          }}>
            "{transcript}"
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          .voice-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          .voice-btn.listening {
            animation: pulse 2s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default VoiceInput;
