import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface LoadMarkerProps {
  type: 'point' | 'distributed';
  force: number;
  distance: number;
  length?: number;
  angle: number;
  scale: number;
  beamLength: number;
}

export const LoadMarker: React.FC<LoadMarkerProps> = ({ 
  type, 
  force, 
  distance, 
  length,
  angle,
  scale,
  beamLength
}) => {
  const position = Math.min(distance, beamLength) * scale;
  
  if (type === 'point') {
    const angleRad = (angle * Math.PI) / 180;
    const arrowLength = 40; // Length of the force arrow
    
    // Calculate arrow end points
    const endX = arrowLength * Math.sin(angleRad);
    const endY = arrowLength * Math.cos(angleRad);

    return (
      <div 
        className="absolute"
        style={{
          left: `${position}%`,
          top: '0',
          transform: 'translateX(-50%)'
        }}
      >
        {/* Force arrow */}
        <svg
          width="80"
          height="80"
          viewBox="-40 -40 80 80"
          className="transform -translate-x-1/2"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
          
          {/* Force arrow line */}
          <line
            x1="0"
            y1="0"
            x2={endX}
            y2={-endY}
            stroke="currentColor"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            className="text-red-500"
          />
          
          {/* Force label */}
          <text
            x={endX * 1.2}
            y={-endY * 1.2}
            className="text-sm fill-current text-gray-600"
            textAnchor="middle"
          >
            {force}N
          </text>
        </svg>
      </div>
    );
  }

  const distributedLength = Math.min(
    (length || 1),
    beamLength - distance
  ) * scale;

  return (
    <div 
      className="absolute"
      style={{
        left: `${position}%`,
        top: '-20px',
        width: `${distributedLength}%`
      }}
    >
      <div className="relative w-full">
        {/* Distributed load arrows */}
        <div className="absolute inset-0 flex justify-between items-start">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <ArrowDown className="w-6 h-6 text-red-500 stroke-[3]" />
            </div>
          ))}
        </div>
        
        {/* Load intensity line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500" />
        
        {/* Load value */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600 whitespace-nowrap">
          {force}N/m
        </div>
      </div>
    </div>
  );
};

export default LoadMarker;