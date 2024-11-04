import React from 'react';
import { BeamDiagramPoint } from '../../types';

interface DeflectionVisualizationProps {
  points: BeamDiagramPoint[];
  beamLength: number;
  maxDeflection: number;
}

export const DeflectionVisualization: React.FC<DeflectionVisualizationProps> = ({
  points,
  beamLength,
  maxDeflection
}) => {
  const height = 60; // Height of the visualization
  const numPoints = 100;
  
  // Create gradient stops for the deflection color scale
  const gradientId = 'deflection-gradient';
  
  // Generate path for the deflected shape
  const generatePath = () => {
    if (!points.length) return '';
    
    const scale = {
      x: 100 / beamLength,
      y: height / (2 * Math.abs(maxDeflection))
    };

    return points.map((point, i) => {
      const x = point.distance * scale.x;
      const y = height / 2 + (point.deflection * scale.y);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="relative w-full h-[60px] mt-4">
      {/* Color scale gradient definition */}
      <svg className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* Original beam position (center line) */}
        <line
          x1="0"
          y1={height / 2}
          x2="100%"
          y2={height / 2}
          stroke="#9ca3af"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        
        {/* Deflected shape */}
        <path
          d={generatePath()}
          fill="none"
          stroke="url(#deflection-gradient)"
          strokeWidth="3"
        />
      </svg>
      
      {/* Legend */}
      <div className="absolute right-0 top-0 flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500" />
          <span>Max (+{(maxDeflection * 1000).toFixed(2)}mm)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500" />
          <span>Min ({(-maxDeflection * 1000).toFixed(2)}mm)</span>
        </div>
      </div>
    </div>
  );
};