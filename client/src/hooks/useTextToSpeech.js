import { useState, useRef, useCallback, useEffect } from 'react';

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  // Load available voices
  const loadVoices = useCallback(() => {
    if (!isSupported) return [];
    
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    return availableVoices;
  }, [isSupported]);

  // Find a good DJ voice (prefer male, deep voices)
  const getDJVoice = useCallback(() => {
    const availableVoices = voices.length > 0 ? voices : loadVoices();
    
    // Try to find a good DJ voice
    const preferredVoices = [
      // Look for specific voice names that sound good for DJ
      availableVoices.find(voice => voice.name.includes('Daniel')),
      availableVoices.find(voice => voice.name.includes('Alex')),
      availableVoices.find(voice => voice.name.includes('Fred')),
      availableVoices.find(voice => voice.name.includes('Diego')),
      // Look for male voices
      availableVoices.find(voice => voice.name.toLowerCase().includes('male')),
      // Look for deep or bass voices
      availableVoices.find(voice => voice.name.toLowerCase().includes('deep')),
      availableVoices.find(voice => voice.name.toLowerCase().includes('bass')),
      // Fallback to any English voice
      availableVoices.find(voice => voice.lang.startsWith('en')),
      // Final fallback
      availableVoices[0]
    ].find(Boolean);

    return preferredVoices;
  }, [voices, loadVoices]);

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return Promise.resolve();

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set voice
      const djVoice = getDJVoice();
      if (djVoice) {
        utterance.voice = djVoice;
      }

      // Configure utterance for DJ personality
      utterance.rate = options.rate || 0.9; // Slightly slower for DJ effect
      utterance.pitch = options.pitch || 0.8; // Slightly deeper for DJ effect
      utterance.volume = options.volume || 1;

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Speak the text
      speechSynthesis.speak(utterance);
    });
  }, [isSupported, getDJVoice]);

  const stop = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Load voices when the hook is first used
  useEffect(() => {
    if (isSupported) {
      // Voices might not be loaded immediately
      loadVoices();
      // Also listen for voices changed event
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported, loadVoices]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    loadVoices
  };
};

export default useTextToSpeech;
