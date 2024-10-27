export interface Load {
  id: number;
  force: number;
  distance: number;
  angle: number;
  type: 'point' | 'distributed';
  length?: number; // For distributed loads
}

export interface Beam {
  length: number;
  type: 'simple' | 'cantilever' | 'overhanging';
  supports: {
    left: number;
    right?: number;
  };
}

export interface Results {
  resultantForce: number;
  resultantAngle: number;
  reactionForceA: number;
  reactionForceB: number;
  centerOfGravity: number;
  maxShearForce: number;
  maxBendingMoment: number;
}

export interface BeamDiagramPoint {
  distance: number;
  shearForce: number;
  bendingMoment: number;
  deflection: number;
}