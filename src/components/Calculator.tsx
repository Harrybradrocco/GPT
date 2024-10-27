import React from 'react';
import { useStore } from '../store';
import LoadInput from './LoadInput';
import ResultsDisplay from './ResultsDisplay';
import BeamConfig from './BeamConfig';
import BeamDiagram from './BeamDiagram';
import ReactionDiagram from './ReactionDiagram';

const Calculator = () => {
  const { loads, addLoad, removeLoad, updateLoad, beam } = useStore();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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
            onClick={() => addLoad()}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Add Load
          </button>
        </div>
        
        <ResultsDisplay />
      </div>

      <ReactionDiagram />
      <BeamDiagram />
    </div>
  );
};

export default Calculator;