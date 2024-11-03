import React from 'react';
import { useStore } from '../store';
import { ForceChart } from './BeamDiagram/ForceChart';

const BendingMomentChart = () => {
  const { diagramPoints } = useStore();

  const bendingMomentData = diagramPoints.map((point, index) => ({
    ...point,
    id: `moment-${point.distance}-${index}`
  }));

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <ForceChart 
        data={bendingMomentData} 
        type="moment" 
        height={300}
      />
    </div>
  );
};

export default BendingMomentChart;