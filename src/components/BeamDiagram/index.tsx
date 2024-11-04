import React from 'react';
import { useStore } from '../../store';
import { BeamSupports } from './BeamSupports';
import { LoadMarker } from './LoadMarker';
import { DeflectionVisualization } from './DeflectionVisualization';

const BeamDiagram: React.FC = () => {
  const { beam, loads, diagramPoints, results } = useStore();
  
  // Calculate scale factor
  const scale = 100 / beam.length;

  // Generate length markers with proper spacing
  const numMarkers = Math.min(Math.max(Math.floor(beam.length / 100), 5), 10);
  const markers = Array.from({ length: numMarkers + 1 }, (_, i) => ({
    position: (beam.length * i) / numMarkers,
    label: ((beam.length * i) / numMarkers).toFixed(0)
  }));

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-50 rounded-lg p-8 h-[200px]">
        {/* Main beam */}
        <div className="absolute top-1/2 left-[60px] right-[60px] h-3 bg-gray-400 rounded transform -translate-y-1/2" />
        
        {/* Length markers */}
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
              <span className="text-sm text-gray-600 mt-2">{marker.label}mm</span>
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
              scale={scale}
              beamLength={beam.length}
            />
          ))}
        </div>
      </div>

      {/* Deflection visualization */}
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