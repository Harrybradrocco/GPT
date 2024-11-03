import React from 'react';
import { useStore } from '../store';
import LoadInput from './LoadInput';
import ResultsDisplay from './ResultsDisplay';
import BeamConfig from './BeamConfig';
import BeamDiagram from './BeamDiagram';
import ShearForceChart from './ShearForceChart';
import BendingMomentChart from './BendingMomentChart';

const Calculator = () => {
  const { loads, addLoad, removeLoad, updateLoad, beam } = useStore();

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <BeamConfig />
          
          <div className="space-y-4">
            {loads.map((load, index) => (
              <LoadInput
                key={load.id}
                load={load}
                onUpdate={(updatedLoad) => updateLoad(index, updatedLoad)}
                onRemove={() => removeLoad(index)}
                maxDistance={beam.length}
              />
            ))}
          </div>
          
          <button
            onClick={addLoad}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Load
          </button>
        </div>
        
        <ResultsDisplay />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Beam Visualization */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Beam Diagram</h3>
          <BeamDiagram />
        </div>

        {/* Shear Force Diagram */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Shear Force Diagram</h3>
          <ShearForceChart />
        </div>

        {/* Bending Moment Diagram */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Bending Moment Diagram</h3>
          <BendingMomentChart />
        </div>
      </div>
    </div>
  );
};

export default Calculator;