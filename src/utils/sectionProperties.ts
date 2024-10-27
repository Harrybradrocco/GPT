import { CrossSection } from '../types';

export const calculateSectionProperties = (section: CrossSection): { area: number; momentOfInertia: number } => {
  switch (section.type) {
    case 'rectangular': {
      const width = section.dimensions.width || 0;
      const height = section.dimensions.height || 0;
      const area = width * height;
      const momentOfInertia = (width * Math.pow(height, 3)) / 12;
      return { area, momentOfInertia };
    }

    case 'circular': {
      const diameter = section.dimensions.diameter || 0;
      const radius = diameter / 2;
      const area = Math.PI * Math.pow(radius, 2);
      const momentOfInertia = (Math.PI * Math.pow(diameter, 4)) / 64;
      return { area, momentOfInertia };
    }

    case 'i-beam': {
      const h = section.dimensions.height || 0;
      const b = section.dimensions.flangeWidth || 0;
      const tw = section.dimensions.webThick || 0;
      const tf = section.dimensions.flangeThick || 0;
      
      const area = 2 * b * tf + (h - 2 * tf) * tw;
      const momentOfInertia = (
        (b * Math.pow(h, 3)) / 12 -
        ((b - tw) * Math.pow(h - 2 * tf, 3)) / 12
      );
      return { area, momentOfInertia };
    }

    case 'c-channel': {
      const h = section.dimensions.height || 0;
      const b = section.dimensions.flangeWidth || 0;
      const tw = section.dimensions.webThick || 0;
      const tf = section.dimensions.flangeThick || 0;
      
      const area = 2 * b * tf + h * tw;
      const momentOfInertia = (
        (tw * Math.pow(h, 3)) / 12 +
        2 * ((tf * Math.pow(b, 3)) / 12 + b * tf * Math.pow(h/2 - tf/2, 2))
      );
      return { area, momentOfInertia };
    }

    case 't-beam': {
      const h = section.dimensions.height || 0;
      const b = section.dimensions.flangeWidth || 0;
      const tw = section.dimensions.webThick || 0;
      const tf = section.dimensions.flangeThick || 0;
      
      const area = b * tf + (h - tf) * tw;
      const momentOfInertia = (
        (tw * Math.pow(h - tf, 3)) / 12 +
        (b * Math.pow(tf, 3)) / 12 +
        b * tf * Math.pow(h - tf/2, 2)
      );
      return { area, momentOfInertia };
    }

    default:
      return { area: 0, momentOfInertia: 0 };
  }
};