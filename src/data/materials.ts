import { Material } from '../types';

export const materials: Material[] = [
  {
    id: 'astm-a36',
    name: 'ASTM A36 Structural Steel',
    yieldStrength: 250,
    elasticModulus: 200,
    density: 7850,
    poissonRatio: 0.26,
    maxAllowableStress: 160,
    thermalExpansion: 11.7
  },
  {
    id: 'astm-a572-gr50',
    name: 'ASTM A572 Grade 50 Steel',
    yieldStrength: 345,
    elasticModulus: 200,
    density: 7850,
    poissonRatio: 0.26,
    maxAllowableStress: 230,
    thermalExpansion: 11.7
  },
  {
    id: 'astm-a992',
    name: 'ASTM A992 Steel',
    yieldStrength: 345,
    elasticModulus: 200,
    density: 7850,
    poissonRatio: 0.26,
    maxAllowableStress: 230,
    thermalExpansion: 11.7
  },
  {
    id: 'aisi-304',
    name: 'AISI 304 Stainless Steel',
    yieldStrength: 215,
    elasticModulus: 193,
    density: 8000,
    poissonRatio: 0.29,
    maxAllowableStress: 137,
    thermalExpansion: 17.3
  },
  {
    id: 'al-6061-t6',
    name: 'Aluminum 6061-T6',
    yieldStrength: 276,
    elasticModulus: 68.9,
    density: 2700,
    poissonRatio: 0.33,
    maxAllowableStress: 165,
    thermalExpansion: 23.6
  }
];