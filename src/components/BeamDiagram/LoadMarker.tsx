import React from 'react';

interface LoadMarkerProps {
  type: 'point' | 'distributed';
  force: number;
  distance: number;
  length?: number;
  scale: number;
}

export const LoadMarker: React.FC<LoadMarkerProps> = ({ type, force, distance, length, scale }) => {
  const style = {
    left: `${(distance * scale)}px`,
    top: '0',
    transform: 'translateY(-50%)'
  };

  if (type === 'point') {
    return (
      <div className="absolute" style={style}>
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-red-500"></div>
          <div className="text-xs mt-1">{force}N</div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute" style={style}>
      <div
        className="bg-red-500/30 border-t-2 border-red-500"
        style={{
          width: `${((length || 1) * scale)}px`,
          height: '20px'
        }}
      >
        <div className="text-xs mt-1">{force}N/m</div>
      </div>
    </div>
  );
};