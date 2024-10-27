import React from 'react';
import { useStore } from '../store';
import { ArrowDown, ArrowUp } from 'lucide-react';

const ReactionDiagram: React.FC = () => {
  const { beam, loads, results } = useStore();
  const scale = 600 / beam.length;

  const renderLoad = (load: any, index: number) => {
    if (load.type === 'point') {
      return (
        <div
          key={load.id}
          className="absolute flex flex-col items-center"
          style={{
            left: `${load.distance * scale}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <ArrowDown className="w-6 h-6 text-red-500" />
          <span className="text-xs mt-1">{load.force}N</span>
        </div>
      );
    }
    
    return (
      <div
        key={load.id}
        className="absolute"
        style={{
          left: `${load.distance * scale}px`,
          width: `${(load.length || 1) * scale}px`
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-evenly">
            {[...Array(5)].map((_, i) => (
              <ArrowDown key={i} className="w-4 h-4 text-red-500" />
            ))}
          </div>
          <span className="text-xs mt-1">{load.force}N/m</span>
        </div>
      </div>
    );
  };

  const renderReaction = (force: number, position: number, label: string) => {
    if (force === 0) return null;
    
    return (
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: `${position * scale}px`,
          bottom: '0',
          transform: 'translateX(-50%)'
        }}
      >
        <ArrowUp className="w-6 h-6 text-blue-500" />
        <span className="text-xs mt-1">{Math.abs(force).toFixed(1)}N</span>
        <span className="text-xs">{label}</span>
      </div>
    );
  };

  // Generate markers based on beam length
  const markers = Array.from({ length: 6 }, (_, i) => {
    const position = (beam.length * i) / 5;
    return {
      position,
      label: position.toFixed(1)
    };
  });

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Reactions and Loads</h3>
      <div className="relative h-[200px] bg-gray-800 rounded-lg p-4">
        {/* Beam */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-600 rounded" />
        
        {/* Applied Loads */}
        <div className="absolute top-8 left-0 right-0">
          {loads.map((load, index) => renderLoad(load, index))}
        </div>
        
        {/* Reaction Forces */}
        {renderReaction(results.reactionForceA, beam.supports.left, 'Ra')}
        {beam.type === 'simple' && renderReaction(results.reactionForceB, beam.supports.right, 'Rb')}
        
        {/* Length markers */}
        <div className="absolute bottom-4 left-0 right-0">
          {markers.map((marker, i) => (
            <div
              key={i}
              className="flex flex-col items-center absolute"
              style={{ left: `${marker.position * scale}px` }}
            >
              <div className="h-3 w-0.5 bg-gray-500" />
              <span className="text-sm text-gray-400 mt-1">{marker.label}m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReactionDiagram;