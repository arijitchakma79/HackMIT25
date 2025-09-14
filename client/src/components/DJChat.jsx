import { useState, useEffect, useRef } from 'react';
import useSpeechToText from '../hooks/useSpeechToText';
import useTextToSpeech from '../hooks/useTextToSpeech';

const DJChat = ({ onMusicPrompt, disabled = false }) => {
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [djPersonality, setDjPersonality] = useState('Ready to drop some beats! What vibe are you feeling today?');
  
  const {
    isListening,
    transcript,
    error: speechError,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText();

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: ttsSupported
  } = useTextToSpeech();

  const conversationRef = useRef(null);

  // Welcome message when component mounts
  useEffect(() => {
    const welcomeMessage = "Hey there! I'm DJ Synthra, your AI music companion. Tell me what kind of vibe you're going for and I'll cook up the perfect track for you!";
    
    // Add welcome to conversation
    setConversation([{
      type: 'dj',
      message: welcomeMessage,
      timestamp: Date.now()
    }]);

    // Speak welcome message after a short delay
    const timer = setTimeout(() => {
      if (ttsSupported) {
        speak(welcomeMessage);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [speak, ttsSupported]);

  // Handle transcript changes
  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      handleUserMessage(transcript);
    }
  }, [transcript, isListening, isProcessing]);

  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleUserMessage = async (message) => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);

    // Add user message to conversation
    const userEntry = {
      type: 'user',
      message: message,
      timestamp: Date.now()
    };
    setConversation(prev => [...prev, userEntry]);

    try {
      // Send to DJ API
      const response = await fetch('http://localhost:5001/api/dj-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Add DJ response to conversation
      const djEntry = {
        type: 'dj',
        message: result.dj_response,
        timestamp: Date.now()
      };
      setConversation(prev => [...prev, djEntry]);

      // DJ speaks the response
      if (ttsSupported && result.dj_response) {
        await speak(result.dj_response);
      }

      // If we have a music prompt, trigger music generation
      if (result.music_prompt && onMusicPrompt) {
        console.log('DJ extracted prompt:', result.music_prompt);
        onMusicPrompt(result.music_prompt);
      }

    } catch (error) {
      console.error('Error in DJ chat:', error);
      const errorMessage = "Yo, I'm having some tech issues right now. Mind saying that again?";
      
      setConversation(prev => [...prev, {
        type: 'dj',
        message: errorMessage,
        timestamp: Date.now()
      }]);

      if (ttsSupported) {
        speak(errorMessage);
      }
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  const handleStartListening = () => {
    if (disabled || isProcessing) return;
    
    // Stop any ongoing speech
    if (isSpeaking) {
      stopSpeaking();
    }
    
    resetTranscript();
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
  };

  const handleManualInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = e.target.value.trim();
      if (message) {
        handleUserMessage(message);
        e.target.value = '';
      }
    }
  };

  if (!speechSupported) {
    return (
      <div className="dj-chat-unsupported">
        <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
          Speech recognition is not supported in this browser.
          <br />
          Try using Chrome, Edge, or Safari for the full DJ experience.
        </p>
      </div>
    );
  }

  return (
    <div className="dj-chat-container">
      {/* Conversation Display */}
      <div 
        className="conversation-display" 
        ref={conversationRef}
        style={{
          height: '300px',
          overflowY: 'auto',
          backgroundColor: '#1a1a1a',
          border: '2px solid #333',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '15px',
          scrollBehavior: 'smooth'
        }}
      >
        {conversation.map((entry, index) => (
          <div
            key={index}
            className={`message ${entry.type}`}
            style={{
              marginBottom: '12px',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: entry.type === 'user' ? '#0066cc' : '#333',
              color: 'white',
              maxWidth: '80%',
              marginLeft: entry.type === 'user' ? 'auto' : '0',
              marginRight: entry.type === 'user' ? '0' : 'auto',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', opacity: 0.8 }}>
              {entry.type === 'user' ? 'You' : '🎧 DJ Synthra'}
            </div>
            {entry.message}
          </div>
        ))}
        
        {isProcessing && (
          <div className="processing-indicator" style={{
            padding: '10px 15px',
            borderRadius: '15px',
            backgroundColor: '#333',
            color: '#ccc',
            maxWidth: '80%',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', opacity: 0.8 }}>
              🎧 DJ Synthra
            </div>
            <div className="typing-dots">
              DJ is thinking...
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        )}
      </div>

      {/* Voice Controls */}
      <div className="dj-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <button
          className={`dj-voice-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={disabled || isProcessing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: isListening ? '#ff6b6b' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: disabled || isProcessing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            opacity: disabled || isProcessing ? 0.6 : 1,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
          title={isListening ? 'Stop talking to DJ' : 'Talk to DJ'}
        >
          <span style={{ fontSize: '18px' }}>
            {isListening ? '⏹️' : '🎤'}
          </span>
          <span>
            {isListening ? 'Stop Talking' : 'Talk to DJ'}
          </span>
        </button>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            style={{
              padding: '8px 16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title="Stop DJ speaking"
          >
            🔇 Stop DJ
          </button>
        )}
      </div>

      {/* Status Indicators */}
      {isListening && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 15px',
          backgroundColor: '#e8f5e8',
          border: '1px solid #c8e6c9',
          borderRadius: '8px',
          color: '#2e7d32',
          fontSize: '14px',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ff4444',
            animation: 'pulse 1s infinite'
          }}></div>
          <span>🎙️ DJ is listening... Speak now!</span>
        </div>
      )}

      {transcript && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f0f8ff',
          border: '1px solid #b0d4f1',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '10px'
        }}>
          <strong>You said:</strong>
          <p style={{ 
            margin: '8px 0 0 0', 
            fontStyle: 'italic',
            color: '#333'
          }}>
            "{transcript}"
          </p>
        </div>
      )}

      {speechError && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffcccc',
          borderRadius: '4px',
          color: '#cc0000',
          fontSize: '14px',
          marginBottom: '10px'
        }}>
          <strong>Error:</strong> {speechError}
          <br />
          <small>Please check your microphone permissions and try again.</small>
        </div>
      )}

      {/* Manual Text Input */}
      <textarea
        placeholder="Or type your message here and press Enter..."
        onKeyPress={handleManualInput}
        disabled={disabled || isProcessing}
        style={{
          width: '100%',
          minHeight: '60px',
          padding: '12px',
          backgroundColor: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          .dj-voice-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          }
          
          .dj-voice-btn.listening {
            animation: pulse 2s infinite;
          }

          .typing-dots .dot {
            animation: typing 1.5s infinite;
          }
          
          .typing-dots .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .typing-dots .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes typing {
            0%, 60%, 100% { opacity: 0; }
            30% { opacity: 1; }
          }

          .conversation-display::-webkit-scrollbar {
            width: 6px;
          }
          
          .conversation-display::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 3px;
          }
          
          .conversation-display::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 3px;
          }
          
          .conversation-display::-webkit-scrollbar-thumb:hover {
            background: #777;
          }
        `}
      </style>
    </div>
  );
};

export default DJChat;
