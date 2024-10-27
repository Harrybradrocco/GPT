import { create } from 'zustand';

export interface Load {
  id: number;
  force: number;
  distance: number;
  angle: number;
  type: 'point' | 'distributed';
  length?: number;
}

export interface Material {
  id: string;
  name: string;
  yieldStrength: number;
  elasticModulus: number;
  density: number;
  poissonRatio: number;
  maxAllowableStress: number;
  thermalExpansion: number;
  isCustom?: boolean;
}

export type CrossSectionType = 'rectangular' | 'circular' | 'i-beam' | 'c-channel' | 't-beam';

export interface CrossSection {
  type: CrossSectionType;
  dimensions: {
    width?: number;       // All shapes
    height?: number;      // All shapes
    flangeWidth?: number; // I-beam, C-channel, T-beam
    flangeThick?: number; // I-beam, C-channel, T-beam
    webThick?: number;    // I-beam, C-channel, T-beam
    diameter?: number;    // Circular
  };
}

export interface Beam {
  length: number;
  type: 'simple' | 'cantilever' | 'overhanging';
  supports: {
    left: number;
    right?: number;
  };
  material: Material;
  crossSection: CrossSection;
}

export interface Results {
  resultantForce: number;
  resultantAngle: number;
  reactionForceA: number;
  reactionForceB: number;
  centerOfGravity: number;
  maxShearForce: number;
  maxBendingMoment: number;
  maxNormalStress: number;
  maxShearStress: number;
  deflection: number;
  safetyFactor: number;
  area: number;
  momentOfInertia: number;
}

export interface BeamDiagramPoint {
  distance: number;
  shearForce: number;
  bendingMoment: number;
  deflection: number;
}