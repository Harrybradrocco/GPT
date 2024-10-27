import React from 'react';
import { useStore } from '../store';
import MaterialSelector from './MaterialSelector';

const BeamConfig = () => {
  const { beam, updateBeam } = useStore();

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Beam Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Beam Type</label>
          <select
            value={beam.type}
            onChange={(e) => updateBeam({ ...beam, type: e.target.value as any })}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="simple">Simple Beam</option>
            <option value="cantilever">Cantilever Beam</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">Beam Length (m)</label>
          <input
            type="number"
            value={beam.length}
            onChange={(e) => updateBeam({ ...beam, length: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            min="0"
            step="0.1"
          />
        </div>

        {beam.type === 'simple' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Left Support Position (m)</label>
              <input
                type="number"
                value={beam.supports.left}
                onChange={(e) => updateBeam({
                  ...beam,
                  supports: { ...beam.supports, left: parseFloat(e.target.value) || 0 }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                max={beam.length}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Right Support Position (m)</label>
              <input
                type="number"
                value={beam.supports.right}
                onChange={(e) => updateBeam({
                  ...beam,
                  supports: { ...beam.supports, right: parseFloat(e.target.value) || 0 }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                max={beam.length}
                step="0.1"
              />
            </div>
          </div>
        )}

        <MaterialSelector />
      </div>
    </div>
  );
};

export default BeamConfig;