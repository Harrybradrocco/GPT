import React from 'react';
import { useStore } from '../store';
import { ForceChart } from './BeamDiagram/ForceChart';

const ShearForceChart = () => {
  const { diagramPoints } = useStore();

  const shearForceData = diagramPoints.map((point, index) => ({
    ...point,
    id: `shear-${point.distance}-${index}`
  }));

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <ForceChart 
        data={shearForceData} 
        type="shear" 
        height={300}
      />
    </div>
  );
};

export default ShearForceChart;