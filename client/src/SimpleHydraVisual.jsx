import { useEffect, useRef } from 'react';

const SimpleHydraVisual = ({ width = 400, height = 400 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        // Simple canvas animation as a fallback
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        let animationId;
        let time = 0;
        
        const animate = () => {
          time += 0.02;
          
          // Clear canvas
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, width, height);
          
          // Draw animated circle
          ctx.fillStyle = `hsl(${time * 50}, 70%, 50%)`;
          const x = width / 2 + Math.sin(time) * 100;
          const y = height / 2 + Math.cos(time * 0.7) * 100;
          const radius = 50 + Math.sin(time * 2) * 20;
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          
          animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        };
      } catch (error) {
        console.error('Error with simple animation:', error);
      }
    }
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
        backgroundColor: '#000'
      }}
    />
  );
};

export default SimpleHydraVisual;