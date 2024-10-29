import React from 'react';
import { useStore } from '../../store';
import { BeamSupports } from './BeamSupports';
import { LoadMarker } from './LoadMarker';
import { ForceChart } from './ForceChart';

const BeamDiagram: React.FC = () => {
  const { beam, loads, diagramPoints } = useStore();
  
  // Calculate scale factor
  const scale = 100 / beam.length;

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
    <div className="space-y-8">
      {/* Beam Visualization */}
      <div className="bg-gray-700/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">Beam Diagram</h3>
        <div className="relative bg-gray-800 rounded-lg p-8 h-[200px]">
          {/* Main beam */}
          <div className="absolute top-1/2 left-[60px] right-[60px] h-3 bg-gray-600 rounded transform -translate-y-1/2" />
          
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
                <div className="h-4 w-0.5 bg-gray-500" />
                <span className="text-sm text-gray-300 mt-2">{marker.label}m</span>
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
      </div>

      {/* Shear Force Diagram */}
      <div className="bg-gray-700/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">Shear Force Diagram</h3>
        <div className="bg-gray-800 rounded-lg p-8">
          <ForceChart 
            data={shearForceData} 
            type="shear" 
            height={300}
          />
        </div>
      </div>

      {/* Bending Moment Diagram */}
      <div className="bg-gray-700/50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">Bending Moment Diagram</h3>
        <div className="bg-gray-800 rounded-lg p-8">
          <ForceChart 
            data={bendingMomentData} 
            type="moment" 
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default BeamDiagram;