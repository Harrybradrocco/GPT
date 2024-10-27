import React from 'react';
import { useStore } from '../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BeamDiagram = () => {
  const { beam, loads, diagramPoints } = useStore();

  const renderBeam = () => {
    const height = 100;
    const width = 600;
    const scale = width / beam.length;

    return (
      <div className="relative h-[100px] bg-gray-800 rounded-lg p-4 mb-6">
        {/* Beam */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-600 rounded"></div>
        
        {/* Supports */}
        {beam.type === 'simple' && (
          <>
            <div className="absolute bottom-0 left-0 w-4 h-8 bg-blue-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-8 bg-blue-500"></div>
          </>
        )}
        {beam.type === 'cantilever' && (
          <div className="absolute top-1/4 left-0 w-4 h-12 bg-blue-500"></div>
        )}
        
        {/* Loads */}
        {loads.map((load, index) => (
          <div
            key={load.id}
            className="absolute"
            style={{
              left: `${(load.distance * scale)}px`,
              top: '0',
              transform: 'translateY(-50%)'
            }}
          >
            {load.type === 'point' ? (
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-red-500"></div>
                <div className="text-xs mt-1">{load.force}N</div>
              </div>
            ) : (
              <div
                className="bg-red-500/30 border-t-2 border-red-500"
                style={{
                  width: `${((load.length || 1) * scale)}px`,
                  height: '20px'
                }}
              >
                <div className="text-xs mt-1">{load.force}N/m</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Add unique IDs to the data points to avoid key conflicts
  const shearForceData = diagramPoints.map((point, index) => ({
    ...point,
    id: `shear-${index}`
  }));

  const bendingMomentData = diagramPoints.map((point, index) => ({
    ...point,
    id: `moment-${index}`
  }));

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg space-y-6">
      <h3 className="text-xl font-semibold">Beam Diagram</h3>
      
      {renderBeam()}

      <div className="space-y-6">
        <div className="h-[200px]">
          <h4 className="text-lg font-medium mb-2">Shear Force Diagram</h4>
          <ResponsiveContainer>
            <LineChart data={shearForceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="distance" 
                label={{ value: 'Distance (m)', position: 'bottom' }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ 
                  value: 'Shear Force (N)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} N`, 'Shear Force']}
                labelFormatter={(label: number) => `Distance: ${label.toFixed(2)} m`}
              />
              <Line 
                type="monotone" 
                dataKey="shearForce" 
                stroke="#ef4444" 
                dot={false}
                name="Shear Force"
                key="shear-force-line"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[200px]">
          <h4 className="text-lg font-medium mb-2">Bending Moment Diagram</h4>
          <ResponsiveContainer>
            <LineChart data={bendingMomentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="distance" 
                label={{ value: 'Distance (m)', position: 'bottom' }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ 
                  value: 'Bending Moment (Nm)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} Nm`, 'Bending Moment']}
                labelFormatter={(label: number) => `Distance: ${label.toFixed(2)} m`}
              />
              <Line 
                type="monotone" 
                dataKey="bendingMoment" 
                stroke="#3b82f6" 
                dot={false}
                name="Bending Moment"
                key="bending-moment-line"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BeamDiagram;