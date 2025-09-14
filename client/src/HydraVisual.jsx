import { useEffect, useRef } from 'react';

const HydraVisual = ({ width = 600, height = 600 }) => {
  const canvasRef = useRef(null);
  const hydraRef = useRef(null);

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
            makeGlobal: true, // Use global mode for simplicity
            width: width,
            height: height,
            autoLoop: true
          });

          // Wait a bit for Hydra to initialize
          setTimeout(() => {
            try {
              // Execute the visualization code
              osc(40, 0.2, 1)
                .modulateScale(osc(40, 0, 1).kaleid(8))
                .repeat(2, 4)
                .modulate(o0, 0.05)
                .modulateKaleid(shape(4, 0.1, 1))
                .out(o0);
                
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
        borderRadius: '8px'
      }}
    />
  );
};

export default HydraVisual;