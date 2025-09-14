import { useEffect, useRef } from 'react';
import AudioAnalyzer from './AudioAnalyzer.js';

const HydraVisual = ({ 
  width = 600, 
  height = 600, 
  userParams = { blur: 50, pixelate: 30, color: 180, kaleid: 40 },
  audioData = { bass: 0, mid: 0, treble: 0, tempo: 120, mood: 'happy', intensity: 0 },
  audioElement = null
}) => {
  const canvasRef = useRef(null);
  const hydraRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationRef = useRef(null);
  const lastUpdateRef = useRef({ userParams: null, audioData: null });

  useEffect(() => {
    const loadHydra = async () => {
      if (canvasRef.current && !hydraRef.current) {
        try {
          // Dynamically import Hydra to avoid SSR issues
          const Hydra = (await import('hydra-synth')).default;
          
          // Initialize Hydra with the canvas
          hydraRef.current = new Hydra({
            canvas: canvasRef.current,
            detectAudio: false,
            makeGlobal: true,
            width: width,
            height: height,
            autoLoop: true
          });

          // Wait a bit for Hydra to initialize
          setTimeout(() => {
            updateVisualization();
          }, 100);
          
        } catch (error) {
          console.error('Error loading or initializing Hydra:', error);
          createFallbackAnimation();
        }
      }
    };

    const updateVisualization = () => {
      if (!hydraRef.current) return;
      
      try {
        // Map user parameters
        const blurAmount = userParams.blur / 100; // 0-1
        const pixelateAmount = Math.floor(userParams.pixelate / 5) + 1; // 1-20
        const colorHue = userParams.color; // 0-360
        const kaleidAmount = Math.floor(userParams.kaleid / 10) + 2; // 2-12
        
        // Map audio parameters
        const bassIntensity = audioData.bass * 2; // 0-2 for oscillator frequency
        const midSpeed = audioData.mid * 0.5 + 0.1; // 0.1-0.6 for modulation speed
        const trebleScale = audioData.treble * 0.5 + 0.5; // 0.5-1 for scale
        const tempoMod = (audioData.tempo / 120) * 0.2; // Tempo-based modulation
        
        // Mood-based color adjustment
        const moodHueShift = audioData.mood === 'dark' ? -60 : 30;
        const finalHue = (colorHue + moodHueShift) % 360;
        
        // Create dynamic Hydra visualization
        osc(40 + bassIntensity * 20, 0.2, 1)
          .color(finalHue / 360, 0.8, 1)
          .modulateScale(
            osc(40 + midSpeed * 40, 0, 1).kaleid(kaleidAmount)
          )
          .repeat(2, 4)
          .modulate(o0, 0.05 + tempoMod)
          .modulateKaleid(shape(4, 0.1 + blurAmount * 0.5, trebleScale))
          .pixelate(pixelateAmount, pixelateAmount)
          .blur(blurAmount * 10, blurAmount * 10)
          .out(o0);
          
      } catch (error) {
        console.error('Error updating Hydra visualization:', error);
        // Fallback to simple visualization
        try {
          osc(10, 0.1, 0.8).out();
        } catch (fallbackError) {
          console.error('Error with fallback visualization:', fallbackError);
        }
      }
    };

    const createFallbackAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      let time = 0;
      
      const animate = () => {
        time += 0.02;
        
        // Apply audio reactivity to fallback
        const bassBoost = 1 + audioData.bass * 2;
        const colorShift = audioData.mid * 360;
        const intensity = audioData.intensity * 100; // Reduced for better visibility
        
        // Mood-based background
        const bgColor = audioData.mood === 'dark' ? '#0a0a1a' : '#1a1a2e';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Apply user blur effect to context if needed
        if (userParams.blur > 0) {
          ctx.filter = `blur(${userParams.blur / 10}px)`;
        } else {
          ctx.filter = 'none';
        }
        
        // Draw audio-reactive patterns with pixelation effect
        const pixelSize = Math.max(1, Math.floor(userParams.pixelate / 5));
        
        for (let i = 0; i < 8; i++) {
          const hue = (userParams.color + colorShift + i * 45) % 360;
          const saturation = 70 + audioData.treble * 30;
          const lightness = 40 + intensity + audioData.bass * 30;
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`;
          
          const baseRadius = 20 + audioData.treble * 40;
          const x = width / 2 + Math.sin(time + i) * (80 + audioData.bass * 120) * bassBoost;
          const y = height / 2 + Math.cos(time * 0.7 + i) * (80 + audioData.mid * 120) * bassBoost;
          
          // Apply kaleidoscope effect
          const kaleidCount = Math.floor(userParams.kaleid / 10) + 2;
          for (let k = 0; k < kaleidCount; k++) {
            const angle = (Math.PI * 2 * k) / kaleidCount;
            const kaleidX = x + Math.cos(angle) * (baseRadius * 2);
            const kaleidY = y + Math.sin(angle) * (baseRadius * 2);
            
            const radius = baseRadius + Math.sin(time * 3 + i + k) * 10;
            
            // Apply pixelation by snapping to grid
            const pixelX = Math.floor(kaleidX / pixelSize) * pixelSize;
            const pixelY = Math.floor(kaleidY / pixelSize) * pixelSize;
            
            ctx.beginPath();
            ctx.arc(pixelX, pixelY, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.filter = 'none';
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    };

    loadHydra();

    // Cleanup function
    return () => {
      if (hydraRef.current) {
        try {
          hydraRef.current = null;
        } catch (error) {
          console.error('Error cleaning up Hydra:', error);
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  // Update visualization when parameters change
  useEffect(() => {
    if (hydraRef.current) {
      // Check if userParams actually changed to avoid unnecessary updates
      const paramsChanged = !lastUpdateRef.current.userParams || 
        JSON.stringify(lastUpdateRef.current.userParams) !== JSON.stringify(userParams);
      
      if (paramsChanged) {
        lastUpdateRef.current.userParams = userParams;
        try {
          updateVisualization();
        } catch (error) {
          console.error('Error updating visualization:', error);
        }
      }
    }
  }, [userParams]);

  // Separate effect for audio data updates (can be more frequent)
  useEffect(() => {
    if (hydraRef.current) {
      // Use requestAnimationFrame for smooth audio updates
      const updateId = requestAnimationFrame(() => {
        try {
          updateVisualization();
          lastUpdateRef.current.audioData = audioData;
        } catch (error) {
          console.error('Error updating visualization:', error);
        }
      });
      
      return () => cancelAnimationFrame(updateId);
    }
  }, [audioData]);

  // Function to update visualization (extracted for reuse)
  const updateVisualization = () => {
    if (!hydraRef.current) return;
    
    try {
      // Map user parameters
      const blurAmount = userParams.blur / 100;
      const pixelateAmount = Math.floor(userParams.pixelate / 5) + 1;
      const colorHue = userParams.color;
      const kaleidAmount = Math.floor(userParams.kaleid / 10) + 2;
      
      // Map audio parameters
      const bassIntensity = audioData.bass * 2;
      const midSpeed = audioData.mid * 0.5 + 0.1;
      const trebleScale = audioData.treble * 0.5 + 0.5;
      const tempoMod = (audioData.tempo / 120) * 0.2;
      
      // Mood-based color adjustment
      const moodHueShift = audioData.mood === 'dark' ? -60 : 30;
      const finalHue = (colorHue + moodHueShift) % 360;
      
      // Create dynamic Hydra visualization
      osc(40 + bassIntensity * 20, 0.2, 1)
        .color(finalHue / 360, 0.8, 1)
        .modulateScale(
          osc(40 + midSpeed * 40, 0, 1).kaleid(kaleidAmount)
        )
        .repeat(2, 4)
        .modulate(o0, 0.05 + tempoMod)
        .modulateKaleid(shape(4, 0.1 + blurAmount * 0.5, trebleScale))
        .pixelate(pixelateAmount, pixelateAmount)
        .blur(blurAmount * 10, blurAmount * 10)
        .out(o0);
        
    } catch (error) {
      console.error('Error in updateVisualization:', error);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        backgroundColor: '#000',
        borderRadius: '8px'
      }}
    />
  );
};

export default HydraVisual;