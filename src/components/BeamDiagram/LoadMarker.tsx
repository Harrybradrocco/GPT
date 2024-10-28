import React from 'react';

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
        <div className="w-1 h-8 bg-red-500" /> {/* Increased size */}
        <div className="text-sm mt-1 whitespace-nowrap font-medium text-gray-200">{force}N</div>
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
                <div className="w-1 h-6 bg-red-500" /> {/* Increased size */}
              </div>
            ))}
          </div>
          <div className="h-6 border-t-2 border-red-500" /> {/* Increased height */}
          <div className="text-sm mt-1 text-center whitespace-nowrap font-medium text-gray-200">
            {force}N/m
          </div>
        </div>
      </div>
    </div>
  );
};