import React from 'react';
import { CrossSectionType } from '../types';

interface CrossSectionDiagramProps {
  type: CrossSectionType;
}

const CrossSectionDiagram: React.FC<CrossSectionDiagramProps> = ({ type }) => {
  const renderDiagram = () => {
    switch (type) {
      case 'rectangular':
        return (
          <svg viewBox="0 0 200 160" className="w-full h-auto max-w-[200px]">
            <rect x="40" y="20" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="2"/>
            
            {/* Width arrow */}
            <line x1="30" y1="150" x2="170" y2="150" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="100" y="165" textAnchor="middle" className="text-sm">Width</text>
            
            {/* Height arrow */}
            <line x1="20" y1="30" x2="20" y2="130" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="10" y="80" textAnchor="middle" transform="rotate(-90, 10, 80)" className="text-sm">Height</text>
          </svg>
        );

      case 'circular':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[200px]">
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2"/>
            
            {/* Diameter arrow */}
            <line x1="30" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="100" y="85" textAnchor="middle" className="text-sm">Diameter</text>
          </svg>
        );

      case 'i-beam':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-auto max-w-[200px]">
            {/* I-beam shape */}
            <path
              d="M40,20 H160 V40 H110 V180 H160 V200 H40 V180 H90 V40 H40 V20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            
            {/* Total height */}
            <line x1="20" y1="20" x2="20" y2="200" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="10" y="110" textAnchor="middle" transform="rotate(-90, 10, 110)" className="text-sm">Height</text>
            
            {/* Flange width */}
            <line x1="40" y1="215" x2="160" y2="215" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="100" y="230" textAnchor="middle" className="text-sm">Flange Width</text>
            
            {/* Web thickness */}
            <line x1="85" y1="110" x2="115" y2="110" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="100" y="100" textAnchor="middle" className="text-sm">Web</text>
            
            {/* Flange thickness */}
            <line x1="165" y1="20" x2="165" y2="40" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="180" y="30" textAnchor="middle" className="text-sm">Flange</text>
          </svg>
        );

      case 'c-channel':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-auto max-w-[200px]">
            {/* C-channel shape */}
            <path
              d="M120,20 H40 V200 H120 V180 H60 V40 H120 V20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            
            {/* Total height */}
            <line x1="20" y1="20" x2="20" y2="200" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="10" y="110" textAnchor="middle" transform="rotate(-90, 10, 110)" className="text-sm">Height</text>
            
            {/* Flange width */}
            <line x1="40" y1="215" x2="120" y2="215" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="80" y="230" textAnchor="middle" className="text-sm">Flange Width</text>
            
            {/* Web thickness */}
            <line x1="35" y1="110" x2="65" y2="110" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="50" y="100" textAnchor="middle" className="text-sm">Web</text>
            
            {/* Flange thickness */}
            <line x1="125" y1="20" x2="125" y2="40" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="140" y="30" textAnchor="middle" className="text-sm">Flange</text>
          </svg>
        );

      case 't-beam':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-auto max-w-[200px]">
            {/* T-beam shape */}
            <path
              d="M40,20 H160 V40 H110 V200 H90 V40 H40 V20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            
            {/* Total height */}
            <line x1="20" y1="20" x2="20" y2="200" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="10" y="110" textAnchor="middle" transform="rotate(-90, 10, 110)" className="text-sm">Height</text>
            
            {/* Flange width */}
            <line x1="40" y1="15" x2="160" y2="15" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="100" y="10" textAnchor="middle" className="text-sm">Flange Width</text>
            
            {/* Web thickness */}
            <line x1="85" y1="110" x2="115" y2="110" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="100" y="100" textAnchor="middle" className="text-sm">Web</text>
            
            {/* Flange thickness */}
            <line x1="165" y1="20" x2="165" y2="40" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
            <text x="180" y="30" textAnchor="middle" className="text-sm">Flange</text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="text-gray-600">
      <svg width="0" height="0">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
      </svg>
      {renderDiagram()}
    </div>
  );
};

export default CrossSectionDiagram;