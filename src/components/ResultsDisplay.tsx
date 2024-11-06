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
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Results</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('txt')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FileImage className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Material Properties */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Material Properties</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-700">Material</p>
              <p className="font-medium text-blue-900">{beam.material.name}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Yield Strength</p>
              <p className="font-medium text-blue-900">{beam.material.yieldStrength} MPa</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Elastic Modulus</p>
              <p className="font-medium text-blue-900">{beam.material.elasticModulus} GPa</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Density</p>
              <p className="font-medium text-blue-900">{beam.material.density} kg/m³</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Poisson's Ratio</p>
              <p className="font-medium text-blue-900">{beam.material.poissonRatio}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Thermal Expansion</p>
              <p className="font-medium text-blue-900">{beam.material.thermalExpansion} µm/m·K</p>
            </div>
          </div>
        </div>

        {/* Section Properties */}
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <h4 className="text-lg font-semibold text-indigo-900 mb-3">Section Properties</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-indigo-700">Cross-sectional Area</p>
              <p className="font-medium text-indigo-900">{results.area.toFixed(2)} mm²</p>
            </div>
            <div>
              <p className="text-sm text-indigo-700">Moment of Inertia</p>
              <p className="font-medium text-indigo-900">{results.momentOfInertia.toFixed(2)} mm⁴</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Resultant Force</p>
            <p className="text-2xl font-bold text-gray-900">{results.resultantForce.toFixed(2)} N</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Resultant Angle</p>
            <p className="text-2xl font-bold text-gray-900">{results.resultantAngle.toFixed(2)}°</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Reaction Force A</p>
            <p className="text-2xl font-bold text-gray-900">{results.reactionForceA.toFixed(2)} N</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Reaction Force B</p>
            <p className="text-2xl font-bold text-gray-900">{results.reactionForceB.toFixed(2)} N</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Max Shear Force</p>
            <p className="text-2xl font-bold text-gray-900">{results.maxShearForce.toFixed(2)} N</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Max Bending Moment</p>
            <p className="text-2xl font-bold text-gray-900">{(results.maxBendingMoment * 1000).toFixed(2)} N·mm</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Max Normal Stress</p>
            <p className="text-2xl font-bold text-gray-900">{results.maxNormalStress.toFixed(2)} MPa</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Max Shear Stress</p>
            <p className="text-2xl font-bold text-gray-900">{results.maxShearStress.toFixed(2)} MPa</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Max Deflection</p>
            <p className="text-2xl font-bold text-gray-900">{(results.deflection * 1000).toFixed(2)} mm</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Safety Factor</p>
            <p className={`text-2xl font-bold ${results.safetyFactor < 1.5 ? 'text-red-600' : 'text-green-600'}`}>
              {results.safetyFactor.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">Center of Gravity</p>
          <p className="text-2xl font-bold text-gray-900">{results.centerOfGravity.toFixed(2)} mm</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;