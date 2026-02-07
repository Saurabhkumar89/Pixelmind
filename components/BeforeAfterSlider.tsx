'use client';

import React from "react"

import { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg bg-black smooth-transition"
      onMouseMove={handleMove}
      onMouseLeave={() => setIsDragging(false)}
      style={{ aspectRatio: '16/9' }}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage || "/placeholder.svg"}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Before Image (Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage || "/placeholder.svg"}
          alt={beforeLabel}
          className="h-full w-full object-cover"
          style={{ width: `${(100 / sliderPosition) * 100}%` }}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 h-full w-1 cursor-col-resize bg-blue-400 smooth-transition hover:w-2"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="rounded-full bg-blue-400 p-3 text-white shadow-lg">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M9 19l7-7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur">
        {afterLabel}
      </div>
    </div>
  );
}
