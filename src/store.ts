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
    length: 10,
    type: 'simple',
    supports: { left: 0, right: 10 },
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
    
    // Calculate total vertical forces and moments
    let totalVerticalForce = 0;
    let totalMoment = 0;

    loads.forEach(load => {
      if (load.type === 'point') {
        const verticalForce = load.force * Math.cos((load.angle * Math.PI) / 180);
        totalVerticalForce += verticalForce;
        totalMoment += verticalForce * load.distance;
      } else {
        const totalForce = load.force * (load.length || 0);
        totalVerticalForce += totalForce;
        const centroid = load.distance + (load.length || 0) / 2;
        totalMoment += totalForce * centroid;
      }
    });

    // Calculate reaction forces
    let reactionA = 0;
    let reactionB = 0;

    if (beam.type === 'simple') {
      const spanLength = beam.supports.right - beam.supports.left;
      reactionB = totalMoment / spanLength;
      reactionA = totalVerticalForce - reactionB;
    } else if (beam.type === 'cantilever') {
      reactionA = totalVerticalForce;
      reactionB = 0;
    }

    // Generate diagram points
    const numPoints = 100;
    const points: BeamDiagramPoint[] = [];
    const dx = beam.length / numPoints;

    let maxShearForce = 0;
    let maxBendingMoment = 0;

    for (let i = 0; i <= numPoints; i++) {
      const x = i * dx;
      let shearForce = -reactionA;
      let bendingMoment = -reactionA * (x - beam.supports.left);
      let deflection = 0;

      // Add effects of loads
      loads.forEach(load => {
        if (load.type === 'point' && x > load.distance) {
          const verticalForce = load.force * Math.cos((load.angle * Math.PI) / 180);
          shearForce += verticalForce;
          bendingMoment += verticalForce * (x - load.distance);
        } else if (load.type === 'distributed' && x > load.distance) {
          const w = load.force;
          const loadLength = Math.min(x - load.distance, load.length || 0);
          const partialForce = w * loadLength;
          shearForce += partialForce;
          const centroid = load.distance + loadLength / 2;
          bendingMoment += partialForce * (x - centroid);
        }
      });

      // Add reaction B effect
      if (x > beam.supports.right) {
        shearForce += reactionB;
        bendingMoment += reactionB * (x - beam.supports.right);
      }

      maxShearForce = Math.max(maxShearForce, Math.abs(shearForce));
      maxBendingMoment = Math.max(maxBendingMoment, Math.abs(bendingMoment));

      // Calculate deflection using elastic beam theory
      if (beam.type === 'simple' && momentOfInertia > 0) {
        deflection = (bendingMoment * Math.pow(x, 2)) / (2 * beam.material.elasticModulus * 1e9 * momentOfInertia);
      }

      points.push({ distance: x, shearForce, bendingMoment, deflection });
    }

    // Calculate stresses
    const maxNormalStress = momentOfInertia > 0 ? (maxBendingMoment * 1000) / (momentOfInertia / (beam.crossSection.dimensions.height || 0) * 2) : 0;
    const maxShearStress = area > 0 ? (1.5 * maxShearForce) / area : 0;
    const safetyFactor = maxNormalStress > 0 ? beam.material.yieldStrength / maxNormalStress : 0;

    // Calculate center of gravity
    const centerOfGravity = totalVerticalForce !== 0 ? totalMoment / totalVerticalForce : 0;

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
        deflection: Math.max(...points.map(p => Math.abs(p.deflection))),
        safetyFactor,
        area,
        momentOfInertia
      },
      diagramPoints: points
    });
  },
}));