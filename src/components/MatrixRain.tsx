import React, { useRef, useEffect } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configure dimensions and settings
    const fontSize = 16;
    const columnWidth = 30;
    const columns = Math.floor(window.innerWidth / columnWidth);
    const drops: number[] = Array(columns).fill(0);
    
    // Keep track of characters in each column
    const streamChars: string[][] = [];
    for (let i = 0; i < columns; i++) {
      streamChars.push([]);
    }

    // Set canvas size to match viewport exactly, no overflow
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();

    // Chinese proverb: "A journey of a thousand miles begins with a single step"
    const characters = '千里之行，始于足下。';

    const draw = () => {
      // Trail effect - darker fade for more contrast with text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Arial Unicode MS", monospace`;
        
      for (let i = 0; i < drops.length; i++) {
        const x = i * columnWidth;
        const y = Math.floor(drops[i]) * fontSize;
        
        // Get a random character for the leading position
        const currentIndex = Math.floor(drops[i]);
        if (currentIndex >= streamChars[i].length) {
          streamChars[i].push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        
        // Draw each character in the stream with varying opacity
        const streamLength = 8; // How many characters to show in each stream
        for (let j = 0; j < streamLength; j++) {
          const charIndex = currentIndex - j;
          if (charIndex < 0 || charIndex >= streamChars[i].length) continue;
          
          const streamChar = streamChars[i][charIndex];
          const charY = y - (j * fontSize);
          
          if (charY < 0) continue;
          
          // Set color based on position in the stream (no shadow effects)
          if (j === 0) {
            // Leading character is just slightly brighter - not too bright
            ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
          } else {
            // Trailing characters fade out more quickly
            const opacity = (1 - j / streamLength) * 0.6;
            ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
          }
          
          ctx.fillText(streamChar, x, charY);
        }
        
        // Reset column if it reaches the bottom with a random chance
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          streamChars[i] = [];
        }
        
        // Slow down the falling speed
        drops[i] += 0.2;
      }
      
      requestAnimationFrame(draw);
    };

    draw();

    // Handle window resize without causing layout shifts
    const handleResize = () => {
      updateCanvasSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain fixed inset-0 pointer-events-none"
      style={{ 
        mixBlendMode: 'lighten', 
        zIndex: 0, // Lower z-index so it renders behind content
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'block'
      }}
    />
  );
};

export default MatrixRain;
