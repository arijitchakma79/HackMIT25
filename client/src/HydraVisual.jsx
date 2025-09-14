import { useEffect, useRef, useState } from 'react';
import { getRandomPattern, applyUserParameters } from './hydraPatterns.js';

const HydraVisual = ({ 
  width = 600, 
  height = 600,
  userParams = { pixelate: 30, brightness: 50, invert: 0 }
}) => {
  const canvasRef = useRef(null);
  const hydraRef = useRef(null);
  const debugCleanupRef = useRef(null);
  const [currentPattern, setCurrentPattern] = useState(null);

  useEffect(() => {
    const loadHydra = async () => {
      if (canvasRef.current && !hydraRef.current) {
        try {
          // Ensure global is defined for Hydra compatibility
          if (typeof global === 'undefined') {
            window.global = globalThis;
          }
          
          // Dynamically import Hydra to avoid SSR issues
          const Hydra = (await import('hydra-synth')).default;
          
          // Initialize Hydra with the canvas
          hydraRef.current = new Hydra({
            canvas: canvasRef.current,
            detectAudio: true, // Enable audio detection for FFT data
            makeGlobal: true, // Use global mode for simplicity
            width: width,
            height: height,
            autoLoop: true,
            enableStreamCapture: false, // Disable stream capture to avoid overlays
            numOutputs: 1, // Limit to single output
            numSources: 1  // Limit to single source
          });

          // Wait a bit for Hydra to initialize
          setTimeout(() => {
            try {
              // Hide any debug canvases that Hydra might create
              const hideDebugCanvases = () => {
                const debugCanvases = document.querySelectorAll('canvas[style*="position: absolute"][style*="right: 0px"][style*="bottom: 0px"]');
                debugCanvases.forEach(canvas => {
                  canvas.style.display = 'none';
                });
              };
              
              // Hide immediately
              hideDebugCanvases();
              
              // Set up periodic cleanup for debug canvases
              debugCleanupRef.current = setInterval(hideDebugCanvases, 1000);
              
              // Select a random pattern
              const selectedPattern = getRandomPattern();
              setCurrentPattern(selectedPattern);
              
              // Execute the selected pattern with dynamic parameters
              let visualization = selectedPattern.pattern(userParams);
              
              // Apply user parameters
              visualization = applyUserParameters(visualization, userParams);
              
              visualization.out();
                
              console.log('Hydra visualization initialized successfully with pattern:', selectedPattern.name);
            } catch (error) {
              console.error('Error executing Hydra code:', error);
              // Fallback to a simple visualization
              try {
                osc(10, 0.1, 0.8).out();
              } catch (fallbackError) {
                console.error('Error with fallback visualization:', fallbackError);
              }
            }
          }, 100);
          
        } catch (error) {
          console.error('Error loading or initializing Hydra:', error);
          // Create a simple canvas animation as fallback
          createFallbackAnimation();
        }
      }
    };

    const createFallbackAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      let animationId;
      let time = 0;
      
      const animate = () => {
        time += 0.02;
        
        // Clear canvas with dark background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // Draw animated patterns
        for (let i = 0; i < 3; i++) {
          const hue = (time * 50 + i * 120) % 360;
          ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.6)`;
          
          const x = width / 2 + Math.sin(time + i) * (100 + i * 50);
          const y = height / 2 + Math.cos(time * 0.7 + i) * (100 + i * 50);
          const radius = 30 + Math.sin(time * 2 + i) * 15;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      // Store animation ID for cleanup
      hydraRef.current = { animationId };
    };

    loadHydra();

    // Cleanup function
    return () => {
      if (debugCleanupRef.current) {
        clearInterval(debugCleanupRef.current);
      }
      if (hydraRef.current) {
        try {
          if (hydraRef.current.animationId) {
            cancelAnimationFrame(hydraRef.current.animationId);
          }
          hydraRef.current = null;
        } catch (error) {
          console.error('Error cleaning up:', error);
        }
      }
    };
  }, [width, height]);

  // Update visualization when parameters change
  useEffect(() => {
    if (hydraRef.current && currentPattern) {
      try {
        // Execute the current pattern with updated parameters
        let visualization = currentPattern.pattern(userParams);
        
        // Apply user parameters
        visualization = applyUserParameters(visualization, userParams);
        
        visualization.out();
      } catch (error) {
        console.error('Error updating visualization with parameters:', error);
      }
    }
  }, [userParams, currentPattern]);

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
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
};

export default HydraVisual;