import { create } from 'zustand';
import { Load, Results, Beam, BeamDiagramPoint, Material } from './types';
import { materials } from './data/materials';
import { calculateSectionProperties } from './utils/sectionProperties';

interface State {
  loads: Load[];
  beam: Beam;
  results: Results;
  diagramPoints: BeamDiagramPoint[];
  addLoad: () => void;
  removeLoad: (index: number) => void;
  updateLoad: (index: number, load: Load) => void;
  updateBeam: (beam: Beam) => void;
  calculateResults: () => void;
}

export const useStore = create<State>((set, get) => ({
  loads: [],
  beam: {
    length: 1000,
    type: 'simple',
    supports: { left: 0, right: 1000 },
    material: materials[0],
    crossSection: {
      type: 'rectangular',
      dimensions: {
        width: 100,
        height: 200
      }
    }
  },
  results: {
    resultantForce: 0,
    resultantAngle: 0,
    reactionForceA: 0,
    reactionForceB: 0,
    centerOfGravity: 0,
    maxShearForce: 0,
    maxBendingMoment: 0,
    maxNormalStress: 0,
    maxShearStress: 0,
    deflection: 0,
    safetyFactor: 0,
    area: 0,
    momentOfInertia: 0
  },
  diagramPoints: [],
  
  addLoad: () => {
    set((state) => ({
      loads: [...state.loads, { 
        id: Date.now(), 
        force: 0, 
        distance: 0, 
        angle: 90, 
        type: 'point'
      }],
    }));
    get().calculateResults();
  },
  
  removeLoad: (index) => {
    set((state) => ({
      loads: state.loads.filter((_, i) => i !== index),
    }));
    get().calculateResults();
  },
  
  updateLoad: (index, load) => {
    set((state) => ({
      loads: state.loads.map((l, i) => (i === index ? load : l)),
    }));
    get().calculateResults();
  },

  updateBeam: (beam) => {
    set({ beam });
    get().calculateResults();
  },
  
  calculateResults: () => {
    const { loads, beam } = get();
    
    // Calculate section properties
    const { area, momentOfInertia } = calculateSectionProperties(beam.crossSection);
    
    // Convert beam length from mm to m for calculations
    const beamLengthM = beam.length / 1000;
    
    // Calculate total vertical forces and moments for reaction forces
    let totalVerticalForce = 0;
    let totalMoment = 0;

    loads.forEach(load => {
      if (load.type === 'point') {
        const angleRad = (load.angle * Math.PI) / 180;
        const verticalForce = load.force * Math.cos(angleRad);
        totalVerticalForce += verticalForce;
        totalMoment += verticalForce * (load.distance / 1000);
      } else if (load.type === 'distributed') {
        const lengthM = (load.length || 0) / 1000;
        const totalForce = load.force * lengthM * 1000; // Convert N/m to N
        totalVerticalForce += totalForce;
        const centerPoint = (load.distance + (load.length || 0) / 2) / 1000;
        totalMoment += totalForce * centerPoint;
      }
    });

    // Calculate reaction forces
    let reactionA = 0;
    let reactionB = 0;

    if (beam.type === 'simple') {
      const spanM = Math.max((beam.supports.right - beam.supports.left) / 1000, 0.001); // Prevent division by zero
      reactionB = totalMoment / spanM;
      reactionA = totalVerticalForce - reactionB;
    } else if (beam.type === 'cantilever') {
      reactionA = totalVerticalForce;
      reactionB = 0;
    }

    // Generate diagram points
    const numPoints = 100;
    const points: BeamDiagramPoint[] = [];
    const dx = beamLengthM / numPoints;

    let maxShearForce = 0;
    let maxBendingMoment = 0;
    let maxDeflection = 0;

    for (let i = 0; i <= numPoints; i++) {
      const x = i * dx;
      let shearForce = -reactionA;
      let bendingMoment = -reactionA * x;
      let deflection = 0;

      // Add effects of loads
      loads.forEach(load => {
        const loadDistanceM = load.distance / 1000;
        
        if (load.type === 'point' && x > loadDistanceM) {
          const angleRad = (load.angle * Math.PI) / 180;
          const verticalForce = load.force * Math.cos(angleRad);
          shearForce += verticalForce;
          bendingMoment += verticalForce * (x - loadDistanceM);
        } else if (load.type === 'distributed' && x > loadDistanceM) {
          const lengthM = (load.length || 0) / 1000;
          const endPointM = loadDistanceM + lengthM;
          const forcePerMeter = load.force * 1000; // Convert N/m to N/mm
          
          if (x <= endPointM) {
            const partialLength = x - loadDistanceM;
            const partialForce = forcePerMeter * partialLength;
            shearForce += partialForce;
            bendingMoment += partialForce * (partialLength / 2);
          } else {
            const totalForce = forcePerMeter * lengthM;
            shearForce += totalForce;
            bendingMoment += totalForce * (x - (loadDistanceM + lengthM/2));
          }
        }
      });

      if (beam.type === 'simple' && x > beam.supports.right / 1000) {
        shearForce += reactionB;
        bendingMoment += reactionB * (x - beam.supports.right / 1000);
      }

      // Calculate deflection
      if (momentOfInertia > 0) {
        const E = beam.material.elasticModulus * 1e9; // Convert GPa to Pa
        const I = momentOfInertia * 1e-12; // Convert mm⁴ to m⁴
        
        if (beam.type === 'simple') {
          deflection = Math.abs(bendingMoment) * Math.pow(x, 2) / (2 * E * I);
        } else if (beam.type === 'cantilever') {
          deflection = Math.abs(bendingMoment) * Math.pow(x, 2) / (2 * E * I);
        }
      }

      maxShearForce = Math.max(maxShearForce, Math.abs(shearForce));
      maxBendingMoment = Math.max(maxBendingMoment, Math.abs(bendingMoment));
      maxDeflection = Math.max(maxDeflection, Math.abs(deflection));

      points.push({ 
        distance: x * 1000,
        shearForce, 
        bendingMoment, 
        deflection 
      });
    }

    // Calculate stresses
    const height = beam.crossSection.dimensions.height || 1; // Prevent division by zero
    const maxNormalStress = momentOfInertia > 0 
      ? (maxBendingMoment * 1000 * (height / 2)) / momentOfInertia 
      : 0;

    const maxShearStress = area > 0 
      ? (1.5 * maxShearForce) / area 
      : 0;

    // Calculate safety factor using von Mises criterion
    const vonMisesStress = Math.sqrt(Math.pow(maxNormalStress, 2) + 3 * Math.pow(maxShearStress, 2));
    
    // Ensure we have a valid yield strength and stress value
    const yieldStrength = beam.material.yieldStrength || 1;
    const safetyFactor = vonMisesStress > 0 
      ? yieldStrength / vonMisesStress 
      : loads.length > 0 ? 999 : 0; // Show 0 if no loads, 999 if loads but no stress

    // Calculate center of gravity
    const centerOfGravity = totalVerticalForce !== 0 
      ? (totalMoment / totalVerticalForce) * 1000 
      : 0;

    set({
      results: {
        resultantForce: totalVerticalForce,
        resultantAngle: 90,
        reactionForceA: reactionA,
        reactionForceB: reactionB,
        centerOfGravity,
        maxShearForce,
        maxBendingMoment,
        maxNormalStress,
        maxShearStress,
        deflection: maxDeflection,
        safetyFactor,
        area,
        momentOfInertia
      },
      diagramPoints: points
    });
  },
}));