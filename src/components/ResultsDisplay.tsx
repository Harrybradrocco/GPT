import React from 'react';
import { useStore } from '../store';
import { Download, FileText, FileImage } from 'lucide-react';
import { downloadResults } from '../utils/downloadResults';

const ResultsDisplay = () => {
  const { results, loads, beam, diagramPoints } = useStore();

  const handleDownload = (format: 'txt' | 'pdf') => {
    downloadResults({ results, loads, beam, diagramPoints }, format);
  };

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Results</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('txt')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            <FileImage className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-300">Resultant Force</p>
            <p className="text-2xl font-bold">{results.resultantForce.toFixed(2)} N</p>
          </div>
          <div>
            <p className="text-gray-300">Resultant Angle</p>
            <p className="text-2xl font-bold">{results.resultantAngle.toFixed(2)}°</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-300">Reaction Force A</p>
            <p className="text-2xl font-bold">{results.reactionForceA.toFixed(2)} N</p>
          </div>
          <div>
            <p className="text-gray-300">Reaction Force B</p>
            <p className="text-2xl font-bold">{results.reactionForceB.toFixed(2)} N</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-300">Max Shear Force</p>
            <p className="text-2xl font-bold">{results.maxShearForce.toFixed(2)} N</p>
          </div>
          <div>
            <p className="text-gray-300">Max Bending Moment</p>
            <p className="text-2xl font-bold">{results.maxBendingMoment.toFixed(2)} Nm</p>
          </div>
        </div>

        <div>
          <p className="text-gray-300">Center of Gravity</p>
          <p className="text-2xl font-bold">{results.centerOfGravity.toFixed(2)} m</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;