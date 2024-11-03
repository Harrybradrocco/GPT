import React from 'react';
import { ArrowDown } from 'lucide-react';

interface LoadMarkerProps {
  type: 'point' | 'distributed';
  force: number;
  distance: number;
  length?: number;
  scale: number;
  beamLength: number;
}

export const LoadMarker: React.FC<LoadMarkerProps> = ({ 
  type, 
  force, 
  distance, 
  length, 
  scale,
  beamLength
}) => {
  const position = Math.min(distance, beamLength) * scale;
  
  if (type === 'point') {
    return (
      <div 
        className="absolute flex flex-col items-center"
        style={{
          left: `${position}%`,
          top: '0',
          transform: 'translateX(-50%)'
        }}
      >
        <ArrowDown className="w-8 h-8 text-red-500 stroke-[3]" />
        <div className="text-sm mt-1 whitespace-nowrap font-medium text-gray-600">
          {force}N
        </div>
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
        top: '0',
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex flex-col">
        <div 
          className="relative"
          style={{ width: `${distributedLength}%` }}
        >
          <div className="absolute top-0 left-0 right-0 flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <ArrowDown className="w-6 h-6 text-red-500 stroke-[3]" />
              </div>
            ))}
          </div>
          <div className="h-8 border-t-2 border-red-500" />
          <div className="text-sm mt-1 text-center whitespace-nowrap font-medium text-gray-600">
            {force}N/m
          </div>
        </div>
      </div>
    </div>
  );
};