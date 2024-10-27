import React from 'react';
import { useStore } from '../store';

const CenterOfGravity = () => {
  const { loads, results } = useStore();
  
  const maxDistance = Math.max(...loads.map(l => l.distance), 10);
  const scale = 400 / maxDistance; // Scale factor for visualization
  
  return (
    <div className="bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Center of Gravity Visualization</h3>
      <div className="relative h-[200px] bg-gray-800 rounded-lg p-4">
        {/* Beam */}
        <div className="absolute bottom-1/2 left-0 right-0 h-2 bg-gray-600 rounded"></div>
        
        {/* Loads */}
        {loads.map((load, index) => (
          <div
            key={index}
            className="absolute bottom-1/2 w-1 h-8 bg-blue-400"
            style={{ left: `${(load.distance * scale)}px` }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm">
              {load.force}N
            </div>
          </div>
        ))}
        
        {/* Center of Gravity */}
        <div
          className="absolute bottom-1/2 w-2 h-16 bg-red-400"
          style={{ left: `${(results.centerOfGravity * scale)}px` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm whitespace-nowrap">
            CoG: {results.centerOfGravity.toFixed(2)}m
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterOfGravity;