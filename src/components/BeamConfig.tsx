import React from 'react';
import { useStore } from '../store';
import MaterialSelector from './MaterialSelector';

const BeamConfig = () => {
  const { beam, updateBeam } = useStore();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Beam Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Beam Type</label>
          <select
            value={beam.type}
            onChange={(e) => updateBeam({ ...beam, type: e.target.value as any })}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="simple">Simple Beam</option>
            <option value="cantilever">Cantilever Beam</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Beam Length (mm)</label>
          <input
            type="number"
            value={beam.length}
            onChange={(e) => updateBeam({ ...beam, length: parseFloat(e.target.value) || 0 })}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="1"
          />
        </div>

        {beam.type === 'simple' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Left Support Position (mm)</label>
              <input
                type="number"
                value={beam.supports.left}
                onChange={(e) => updateBeam({
                  ...beam,
                  supports: { ...beam.supports, left: parseFloat(e.target.value) || 0 }
                })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={beam.length}
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Right Support Position (mm)</label>
              <input
                type="number"
                value={beam.supports.right}
                onChange={(e) => updateBeam({
                  ...beam,
                  supports: { ...beam.supports, right: parseFloat(e.target.value) || 0 }
                })}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={beam.length}
                step="1"
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