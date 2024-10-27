import React, { useState } from 'react';
import { useStore } from '../store';
import { materials } from '../data/materials';
import { Material, CrossSectionType } from '../types';

const MaterialSelector = () => {
  const { beam, updateBeam } = useStore();
  const [isCustomMaterial, setIsCustomMaterial] = useState(false);

  const handleMaterialChange = (materialId: string) => {
    if (materialId === 'custom') {
      setIsCustomMaterial(true);
      updateBeam({
        ...beam,
        material: {
          ...beam.material,
          id: 'custom',
          name: 'Custom Material',
          isCustom: true
        }
      });
    } else {
      setIsCustomMaterial(false);
      const selectedMaterial = materials.find(m => m.id === materialId) as Material;
      updateBeam({
        ...beam,
        material: selectedMaterial
      });
    }
  };

  const updateMaterialProperty = (property: keyof Material, value: number) => {
    updateBeam({
      ...beam,
      material: {
        ...beam.material,
        [property]: value
      }
    });
  };

  const crossSectionTypes: { value: CrossSectionType; label: string }[] = [
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'circular', label: 'Circular' },
    { value: 'i-beam', label: 'I-Beam' },
    { value: 'c-channel', label: 'C-Channel' },
    { value: 't-beam', label: 'T-Beam' }
  ];

  const renderCrossSectionInputs = () => {
    switch (beam.crossSection.type) {
      case 'rectangular':
        return (
          <>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Width (mm)</label>
              <input
                type="number"
                value={beam.crossSection.dimensions.width || 0}
                onChange={(e) => updateBeam({
                  ...beam,
                  crossSection: {
                    ...beam.crossSection,
                    dimensions: {
                      ...beam.crossSection.dimensions,
                      width: parseFloat(e.target.value) || 0
                    }
                  }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Height (mm)</label>
              <input
                type="number"
                value={beam.crossSection.dimensions.height || 0}
                onChange={(e) => updateBeam({
                  ...beam,
                  crossSection: {
                    ...beam.crossSection,
                    dimensions: {
                      ...beam.crossSection.dimensions,
                      height: parseFloat(e.target.value) || 0
                    }
                  }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                step="1"
              />
            </div>
          </>
        );

      case 'circular':
        return (
          <div>
            <label className="block text-sm text-gray-300 mb-1">Diameter (mm)</label>
            <input
              type="number"
              value={beam.crossSection.dimensions.diameter || 0}
              onChange={(e) => updateBeam({
                ...beam,
                crossSection: {
                  ...beam.crossSection,
                  dimensions: {
                    ...beam.crossSection.dimensions,
                    diameter: parseFloat(e.target.value) || 0
                  }
                }
              })}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              min="0"
              step="1"
            />
          </div>
        );

      case 'i-beam':
      case 'c-channel':
      case 't-beam':
        return (
          <>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Height (mm)</label>
              <input
                type="number"
                value={beam.crossSection.dimensions.height || 0}
                onChange={(e) => updateBeam({
                  ...beam,
                  crossSection: {
                    ...beam.crossSection,
                    dimensions: {
                      ...beam.crossSection.dimensions,
                      height: parseFloat(e.target.value) || 0
                    }
                  }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Flange Width (mm)</label>
              <input
                type="number"
                value={beam.crossSection.dimensions.flangeWidth || 0}
                onChange={(e) => updateBeam({
                  ...beam,
                  crossSection: {
                    ...beam.crossSection,
                    dimensions: {
                      ...beam.crossSection.dimensions,
                      flangeWidth: parseFloat(e.target.value) || 0
                    }
                  }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Flange Thickness (mm)</label>
              <input
                type="number"
                value={beam.crossSection.dimensions.flangeThick || 0}
                onChange={(e) => updateBeam({
                  ...beam,
                  crossSection: {
                    ...beam.crossSection,
                    dimensions: {
                      ...beam.crossSection.dimensions,
                      flangeThick: parseFloat(e.target.value) || 0
                    }
                  }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Web Thickness (mm)</label>
              <input
                type="number"
                value={beam.crossSection.dimensions.webThick || 0}
                onChange={(e) => updateBeam({
                  ...beam,
                  crossSection: {
                    ...beam.crossSection,
                    dimensions: {
                      ...beam.crossSection.dimensions,
                      webThick: parseFloat(e.target.value) || 0
                    }
                  }
                })}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                min="0"
                step="1"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-300 mb-1">Material</label>
        <select
          value={beam.material.isCustom ? 'custom' : beam.material.id}
          onChange={(e) => handleMaterialChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          {materials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
          <option value="custom">Custom Material</option>
        </select>
      </div>

      {isCustomMaterial && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Yield Strength (MPa)</label>
            <input
              type="number"
              value={beam.material.yieldStrength}
              onChange={(e) => updateMaterialProperty('yieldStrength', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              min="0"
              step="1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Elastic Modulus (GPa)</label>
            <input
              type="number"
              value={beam.material.elasticModulus}
              onChange={(e) => updateMaterialProperty('elasticModulus', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-300 mb-1">Cross Section Shape</label>
        <select
          value={beam.crossSection.type}
          onChange={(e) => updateBeam({
            ...beam,
            crossSection: {
              type: e.target.value as CrossSectionType,
              dimensions: {}
            }
          })}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          {crossSectionTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderCrossSectionInputs()}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-3 rounded">
          <p className="text-sm text-gray-300">Yield Strength</p>
          <p className="text-lg font-semibold">{beam.material.yieldStrength} MPa</p>
        </div>
        <div className="bg-gray-800/50 p-3 rounded">
          <p className="text-sm text-gray-300">Elastic Modulus</p>
          <p className="text-lg font-semibold">{beam.material.elasticModulus} GPa</p>
        </div>
      </div>
    </div>
  );
};

export default MaterialSelector;