'use client';

import { useEffect, useRef } from 'react';

interface PlaceholderImageProps {
  width: number;
  height: number;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function PlaceholderImage({ 
  width, 
  height, 
  text = '', 
  backgroundColor = '#e2e8f0', 
  textColor = '#334155' 
}: PlaceholderImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    if (text) {
      ctx.fillStyle = textColor;
      ctx.font = `${Math.max(16, Math.floor(width / 20))}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Support multiline text
      const lines = text.split('+');
      const lineHeight = Math.floor(width / 20);
      
      lines.forEach((line, i) => {
        const y = height / 2 - ((lines.length - 1) * lineHeight / 2) + i * lineHeight;
        ctx.fillText(line, width / 2, y);
      });
    }

    // Draw dimensions
    const dimensionText = `${width} × ${height}`;
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText(dimensionText, width / 2, height - 14);
  }, [width, height, text, backgroundColor, textColor]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
} 