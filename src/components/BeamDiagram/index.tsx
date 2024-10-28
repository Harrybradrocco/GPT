import React from 'react';
import { useStore } from '../../store';
import { BeamSupports } from './BeamSupports';
import { LoadMarker } from './LoadMarker';
import { ForceChart } from './ForceChart';

const BeamDiagram: React.FC = () => {
  const { beam, loads, diagramPoints } = useStore();
  
  // Calculate the container width and height
  const containerWidth = '100%';
  const containerHeight = 180; // Increased height for better visibility
  const paddingX = 60; // Increased padding for better support visibility
  
  // Calculate scale factor based on container size minus padding
  const scale = (100 - (2 * (paddingX / 5))) / beam.length; // Adjusted scale calculation

  const shearForceData = diagramPoints.map((point, index) => ({
    ...point,
    id: `shear-${point.distance}-${index}`
  }));

  const bendingMomentData = diagramPoints.map((point, index) => ({
    ...point,
    id: `moment-${point.distance}-${index}`
  }));

  // Generate length markers with proper spacing
  const numMarkers = Math.min(Math.max(Math.floor(beam.length), 5), 10);
  const markers = Array.from({ length: numMarkers + 1 }, (_, i) => ({
    position: (beam.length * i) / numMarkers,
    label: ((beam.length * i) / numMarkers).toFixed(1)
  }));

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg space-y-6">
      <h3 className="text-xl font-semibold">Beam Diagram</h3>
      
      <div className="relative bg-gray-800 rounded-lg p-8 mb-6" style={{ height: containerHeight, width: containerWidth }}>
        {/* Main beam */}
        <div 
          className="absolute h-3 bg-gray-600 rounded"
          style={{
            top: '50%',
            left: `${paddingX}px`,
            right: `${paddingX}px`,
            transform: 'translateY(-50%)'
          }}
        />
        
        {/* Length markers */}
        <div 
          className="absolute bottom-6"
          style={{
            left: `${paddingX}px`,
            right: `${paddingX}px`,
            height: '24px'
          }}
        >
          {markers.map((marker, i) => (
            <div 
              key={i} 
              className="absolute flex flex-col items-center"
              style={{ 
                left: `${marker.position * scale}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="h-4 w-0.5 bg-gray-500" />
              <span className="text-sm text-gray-300 mt-1">{marker.label}m</span>
            </div>
          ))}
        </div>
        
        <BeamSupports 
          type={beam.type}
          leftSupport={beam.supports.left}
          rightSupport={beam.supports.right}
          scale={scale}
          paddingX={paddingX}
        />
        
        <div 
          className="absolute"
          style={{
            left: `${paddingX}px`,
            right: `${paddingX}px`,
            top: '20%',
            bottom: '40%'
          }}
        >
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

      <div className="space-y-6">
        <ForceChart data={shearForceData} type="shear" />
        <ForceChart data={bendingMomentData} type="moment" />
      </div>
    </div>
  );
};

export default BeamDiagram;