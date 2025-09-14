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

  // Find Mac male voice
  const getMacMaleVoice = useCallback(() => {
    const availableVoices = voices.length > 0 ? voices : loadVoices();
    
    // Prioritize Mac male voices
    const preferredVoices = [
      // Mac male voices in order of preference
      availableVoices.find(voice => voice.name.includes('Alex')), // Mac default male
      availableVoices.find(voice => voice.name.includes('Daniel')), // Mac male
      availableVoices.find(voice => voice.name.includes('Fred')), // Mac male
      availableVoices.find(voice => voice.name.includes('Ralph')), // Mac male
      availableVoices.find(voice => voice.name.includes('Jorge')), // Mac Spanish male
      // Any voice with "male" in the name
      availableVoices.find(voice => voice.name.toLowerCase().includes('male')),
      // Google/Microsoft male voices as backup
      availableVoices.find(voice => voice.name.includes('Google US English') && voice.name.toLowerCase().includes('male')),
      availableVoices.find(voice => voice.name.includes('Microsoft') && voice.name.toLowerCase().includes('male')),
      // Fallback to any English voice
      availableVoices.find(voice => voice.lang.startsWith('en-US')),
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
      const macMaleVoice = getMacMaleVoice();
      if (macMaleVoice) {
        utterance.voice = macMaleVoice;
      }

      // Configure utterance for natural, casual speech
      utterance.rate = options.rate || 1.1; // Normal to slightly faster for casual feel
      utterance.pitch = options.pitch || 1.0; // Natural pitch
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
  }, [isSupported, getMacMaleVoice]);

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
