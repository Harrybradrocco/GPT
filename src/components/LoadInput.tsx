import React from 'react';
import { Trash2 } from 'lucide-react';
import { Load } from '../types';

interface LoadInputProps {
  load: Load;
  onUpdate: (load: Load) => void;
  onRemove: () => void;
  maxDistance: number;
}

const LoadInput: React.FC<LoadInputProps> = ({ load, onUpdate, onRemove, maxDistance }) => {
  return (
    <div className="flex gap-4 items-start bg-gray-700/50 p-4 rounded-lg">
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Load Type</label>
            <select
              value={load.type}
              onChange={(e) => onUpdate({ ...load, type: e.target.value as 'point' | 'distributed' })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="point">Point Load</option>
              <option value="distributed">Distributed Load</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              {load.type === 'point' ? 'Force (N)' : 'Force per meter (N/m)'}
            </label>
            <input
              type="number"
              value={load.force}
              onChange={(e) => onUpdate({ ...load, force: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              step="0.1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Distance from Left (m)</label>
            <input
              type="number"
              value={load.distance}
              onChange={(e) => onUpdate({ ...load, distance: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              min="0"
              max={maxDistance}
              step="0.1"
            />
          </div>
          {load.type === 'distributed' ? (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Length (m)</label>
              <input
                type="number"
                value={load.length || 0}
                onChange={(e) => onUpdate({ ...load, length: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                max={maxDistance - load.distance}
                step="0.1"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Angle (°)</label>
              <input
                type="number"
                value={load.angle}
                onChange={(e) => onUpdate({ ...load, angle: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                max="360"
                step="1"
              />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-red-400 hover:text-red-300 transition-colors"
        title="Remove Load"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default LoadInput;