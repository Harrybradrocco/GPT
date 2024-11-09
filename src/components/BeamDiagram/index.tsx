import React from 'react';
import { useStore } from '../../store';
import { BeamSupports } from './BeamSupports';
import { LoadMarker } from './LoadMarker';
import { DeflectionVisualization } from './DeflectionVisualization';
import { ReactionForces } from './ReactionForces';

const BeamDiagram: React.FC = () => {
  const { beam, loads, diagramPoints, results } = useStore();
  
  const scale = 100 / beam.length;
  const numMarkers = Math.min(Math.max(Math.floor(beam.length / 100), 5), 10);
  const markers = Array.from({ length: numMarkers + 1 }, (_, i) => ({
    position: (beam.length * i) / numMarkers,
    label: ((beam.length * i) / numMarkers).toFixed(0)
  }));

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <div className="relative bg-gray-50 rounded-lg p-4 h-[200px] min-w-[300px]">
        <div className="absolute bottom-16 left-[60px] w-8 h-4">
          <div className="absolute w-full border-t-2 border-gray-400 -rotate-45" />
          <div className="absolute w-full border-t-2 border-gray-400 rotate-45" />
        </div>
        {beam.type === 'simple' && (
          <div className="absolute bottom-16 right-[60px] w-8 h-4">
            <div className="absolute w-full border-t-2 border-gray-400 -rotate-45" />
            <div className="absolute w-full border-t-2 border-gray-400 rotate-45" />
          </div>
        )}

        <div className="absolute top-1/2 left-[60px] right-[60px] h-[2px] bg-gray-900" />
        
        <ReactionForces
          type={beam.type}
          leftSupport={beam.supports.left}
          rightSupport={beam.supports.right}
          reactionForceA={results.reactionForceA}
          reactionForceB={results.reactionForceB}
          scale={scale}
          paddingX={60}
        />
        
        <div className="absolute bottom-4 left-[60px] right-[60px] h-[30px]">
          {markers.map((marker, i) => (
            <div 
              key={i} 
              className="absolute flex flex-col items-center"
              style={{ 
                left: `${marker.position * scale}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="h-4 w-0.5 bg-gray-400" />
              <span className="text-xs text-gray-600 mt-1">{marker.label}mm</span>
            </div>
          ))}
        </div>
        
        <BeamSupports 
          type={beam.type}
          leftSupport={beam.supports.left}
          rightSupport={beam.supports.right}
          scale={scale}
          paddingX={60}
        />
        
        <div className="absolute left-[60px] right-[60px] top-[20%] bottom-[40%]">
          {loads.map((load) => (
            <LoadMarker
              key={load.id}
              type={load.type}
              force={load.force}
              distance={load.distance}
              length={load.length}
              angle={load.angle}
              scale={scale}
              beamLength={beam.length}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-[60px] right-[60px] flex justify-between items-center">
          <div className="w-1 h-4 bg-gray-400" />
          <div className="text-xs text-gray-600">{beam.length} mm</div>
          <div className="w-1 h-4 bg-gray-400" />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Deflection Visualization</h4>
        <DeflectionVisualization
          points={diagramPoints}
          beamLength={beam.length}
          maxDeflection={results.deflection}
        />
      </div>
    </div>
  );
};

export default BeamDiagram;