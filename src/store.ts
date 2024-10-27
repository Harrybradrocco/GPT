import { create } from 'zustand';
import { Load, Results, Beam, BeamDiagramPoint } from './types';

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
    supports: { left: 0, right: 10 }
  },
  results: {
    resultantForce: 0,
    resultantAngle: 0,
    reactionForceA: 0,
    reactionForceB: 0,
    centerOfGravity: 0,
    maxShearForce: 0,
    maxBendingMoment: 0
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
    
    // Calculate total vertical forces and moments
    let totalVerticalForce = 0;
    let totalMoment = 0;

    loads.forEach(load => {
      if (load.type === 'point') {
        const verticalForce = load.force * Math.cos((load.angle * Math.PI) / 180);
        totalVerticalForce += verticalForce;
        totalMoment += verticalForce * load.distance;
      } else {
        // Distributed load
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
      // For simple beam: sum of moments about A = 0
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

      points.push({
        distance: x,
        shearForce,
        bendingMoment,
        deflection: 0 // Placeholder for future deflection calculation
      });
    }

    // Calculate center of gravity
    const centerOfGravity = totalVerticalForce !== 0 ? totalMoment / totalVerticalForce : 0;

    set({
      results: {
        resultantForce: totalVerticalForce,
        resultantAngle: 90, // Assuming vertical loads
        reactionForceA: reactionA,
        reactionForceB: reactionB,
        centerOfGravity,
        maxShearForce,
        maxBendingMoment
      },
      diagramPoints: points
    });
  },
}));