import React from 'react';
import { useStore } from '../../store';
import { BeamSupports } from './BeamSupports';
import { LoadMarker } from './LoadMarker';
import { ForceChart } from './ForceChart';

const BeamDiagram: React.FC = () => {
  const { beam, loads, diagramPoints } = useStore();
  const height = 100;
  const width = 600;
  const scale = width / beam.length;

  const shearForceData = diagramPoints.map((point, index) => ({
    ...point,
    id: `shear-${point.distance}-${index}`
  }));

  const bendingMomentData = diagramPoints.map((point, index) => ({
    ...point,
    id: `moment-${point.distance}-${index}`
  }));

  // Generate length markers
  const numMarkers = 5;
  const markers = Array.from({ length: numMarkers + 1 }, (_, i) => ({
    position: (beam.length * i) / numMarkers,
    label: ((beam.length * i) / numMarkers).toFixed(1)
  }));

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg space-y-6">
      <h3 className="text-xl font-semibold">Beam Diagram</h3>
      
      <div className="relative h-[140px] bg-gray-800 rounded-lg p-4 mb-6">
        {/* Main beam */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-600 rounded" />
        
        {/* Length markers */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between">
          {markers.map((marker, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center"
              style={{ position: 'absolute', left: `${(marker.position * scale)}px` }}
            >
              <div className="h-3 w-0.5 bg-gray-500" />
              <span className="text-sm text-gray-400 mt-1">{marker.label}m</span>
            </div>
          ))}
        </div>
        
        <BeamSupports 
          type={beam.type}
          leftSupport={beam.supports.left}
          rightSupport={beam.supports.right}
          scale={scale}
        />
        
        {loads.map((load) => (
          <LoadMarker
            key={load.id}
            type={load.type}
            force={load.force}
            distance={load.distance}
            length={load.length}
            scale={scale}
          />
        ))}
      </div>

      <div className="space-y-6">
        <ForceChart data={shearForceData} type="shear" />
        <ForceChart data={bendingMomentData} type="moment" />
      </div>
    </div>
  );
};

export default BeamDiagram;