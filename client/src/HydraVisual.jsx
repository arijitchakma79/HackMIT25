import { useEffect, useRef } from 'react';

const HydraVisual = ({ width = 600, height = 600 }) => {
  const canvasRef = useRef(null);
  const hydraRef = useRef(null);
  const debugCleanupRef = useRef(null);

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
              
              // Execute the visualization code - cleaned up version
              osc(100,-0.0018,0.17).diff(osc(20,0.00008).rotate(Math.PI/0.00003))
                .modulateScale(noise(1.5,0.18).modulateScale(osc(13).rotate(()=>Math.sin(time/22))),3)
                .color(11,0.5,0.4, 0.9, 0.2, 0.011, 5, 22,  0.5, -1).contrast(1.4)
                .invert().brightness(0.0003, 2).contrast( 0.5, 2, 0.1, 2).color(4, -2, 0.1)
                .modulateScale(osc(2),-0.2, 2, 1, 0.3)
                .posterize(200) .rotate(1, 0.2, 0.01, 0.001)
                .color(22, -2, 0.5, 0.5, 0.0001,  0.1, 0.2, 8).contrast(0.18, 0.3, 0.1, 0.2, 0.03, 1).brightness(0.0001, -1, 10)
                .out();
                
              console.log('Hydra visualization initialized successfully');
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