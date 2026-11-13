'use client';

import React, { useEffect, useRef } from 'react';

interface GridCell {
  x: number;
  y: number;
  alpha: number; // 0 to 1 decay
}

export function InteractiveGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const CELL_SIZE = 44; // Box size in CSS pixels
    const RADIUS = 180; // Distance of mouse influence

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    // Active trail map: key = `${col},${row}`, value = alpha
    const activeCells = new Map<string, number>();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 1200);
    };

    const onMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
      isMoving = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const draw = () => {
      // Smooth lerp mouse position for silky tracking
      mouseX += (targetMouseX - mouseX) * 0.25;
      mouseY += (targetMouseY - mouseY) * 0.25;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / CELL_SIZE);
      const rows = Math.ceil(height / CELL_SIZE);

      // Determine mouse cell index
      const mouseCol = Math.floor(mouseX / CELL_SIZE);
      const mouseRow = Math.floor(mouseY / CELL_SIZE);
      const cellRadius = Math.ceil(RADIUS / CELL_SIZE);

      // Light up cells within radius
      if (mouseX > -500 && mouseY > -500) {
        for (let c = mouseCol - cellRadius; c <= mouseCol + cellRadius; c++) {
          for (let r = mouseRow - cellRadius; r <= mouseRow + cellRadius; r++) {
            if (c >= 0 && c < cols && r >= 0 && r < rows) {
              const cellCenterX = c * CELL_SIZE + CELL_SIZE / 2;
              const cellCenterY = r * CELL_SIZE + CELL_SIZE / 2;
              const dist = Math.hypot(cellCenterX - mouseX, cellCenterY - mouseY);

              if (dist < RADIUS) {
                const intensity = Math.pow(1 - dist / RADIUS, 1.6);
                const key = `${c},${r}`;
                const current = activeCells.get(key) || 0;
                activeCells.set(key, Math.max(current, intensity));
              }
            }
          }
        }
      }

      // Draw base subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = 0; x <= width; x += CELL_SIZE) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = 0; y <= height; y += CELL_SIZE) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // Decay and render active lit-up boxes
      activeCells.forEach((alpha, key) => {
        if (alpha <= 0.01) {
          activeCells.delete(key);
          return;
        }

        const [colStr, rowStr] = key.split(',');
        const c = parseInt(colStr, 10);
        const r = parseInt(rowStr, 10);
        const cellX = c * CELL_SIZE;
        const cellY = r * CELL_SIZE;

        // Subtle box fill
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.065})`;
        ctx.fillRect(cellX + 1, cellY + 1, CELL_SIZE - 1, CELL_SIZE - 1);

        // Lit-up highlighted border
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.38})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX + 0.5, cellY + 0.5, CELL_SIZE, CELL_SIZE);

        // Tech crosshair at corners of active box
        if (alpha > 0.3) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          const crossSize = 3;
          // Top-left
          ctx.fillRect(cellX - 1, cellY - 1, crossSize, crossSize);
          // Top-right
          ctx.fillRect(cellX + CELL_SIZE - 1, cellY - 1, crossSize, crossSize);
          // Bottom-left
          ctx.fillRect(cellX - 1, cellY + CELL_SIZE - 1, crossSize, crossSize);
          // Bottom-right
          ctx.fillRect(cellX + CELL_SIZE - 1, cellY + CELL_SIZE - 1, crossSize, crossSize);
        }

        // Decay alpha smoothly
        activeCells.set(key, alpha * 0.91);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(moveTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        maskImage: 'radial-gradient(ellipse 95% 85% at 50% 30%, #000 60%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 95% 85% at 50% 30%, #000 60%, transparent 100%)',
      }}
      aria-hidden="true"
    />
  );
}
