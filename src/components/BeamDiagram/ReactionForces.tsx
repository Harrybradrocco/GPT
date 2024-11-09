import React from 'react';

interface ReactionForcesProps {
  type: 'simple' | 'cantilever';
  leftSupport: number;
  rightSupport?: number;
  reactionForceA: number;
  reactionForceB: number;
  scale: number;
  paddingX: number;
}

export const ReactionForces: React.FC<ReactionForcesProps> = ({
  type,
  leftSupport,
  rightSupport,
  reactionForceA,
  reactionForceB,
  scale,
  paddingX
}) => {
  const ForceArrow = ({ 
    position, 
    force, 
    label 
  }: { 
    position: number; 
    force: number;
    label: string;
  }) => {
    const arrowLength = 40;
    const direction = force >= 0 ? -1 : 1; // Negative force points downward

    return (
      <div
        className="absolute bottom-24"
        style={{
          left: `calc(${paddingX}px + ${position * scale}%)`,
          transform: 'translateX(-50%)'
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="-40 -40 80 80"
          className="transform -translate-x-1/2"
        >
          <defs>
            <marker
              id="reactionArrow"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
          
          {/* Reaction force arrow */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={arrowLength * direction}
            stroke="currentColor"
            strokeWidth="2"
            markerEnd="url(#reactionArrow)"
            className="text-blue-500"
          />
          
          {/* Force label */}
          <text
            x="15"
            y={arrowLength * direction * 0.5}
            className="text-sm fill-current text-gray-600"
            textAnchor="start"
          >
            {label}={Math.abs(force).toFixed(1)}N
          </text>
        </svg>
      </div>
    );
  };

  return (
    <>
      <ForceArrow
        position={leftSupport}
        force={reactionForceA}
        label="RA"
      />
      {type === 'simple' && rightSupport !== undefined && (
        <ForceArrow
          position={rightSupport}
          force={reactionForceB}
          label="RB"
        />
      )}
    </>
  );
};