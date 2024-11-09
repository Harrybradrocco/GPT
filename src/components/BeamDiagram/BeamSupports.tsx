import React from 'react';

interface BeamSupportsProps {
  type: 'simple' | 'cantilever';
  leftSupport: number;
  rightSupport?: number;
  scale: number;
  paddingX: number;
}

export const BeamSupports: React.FC<BeamSupportsProps> = ({ 
  type, 
  leftSupport, 
  rightSupport, 
  scale,
  paddingX
}) => {
  const PinSupport = ({ position }: { position: number }) => (
    <div 
      className="absolute bottom-16"
      style={{ 
        left: `calc(${paddingX}px + ${position * scale}%)`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Triangle support */}
      <div className="w-8 h-8 relative">
        <div className="absolute inset-0">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path
              d="M0,0 L16,32 L32,0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-900"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  const FixedSupport = () => (
    <div 
      className="absolute bottom-16"
      style={{ 
        left: `${paddingX}px`,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Fixed support rectangle with hatching */}
      <div className="w-8 h-16 relative">
        <svg viewBox="0 0 32 64" className="w-full h-full">
          <pattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="4"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-900"
            />
          </pattern>
          <rect
            width="32"
            height="64"
            fill="url(#hatch)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-900"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <>
      {type === 'simple' ? (
        <>
          <PinSupport position={leftSupport} />
          {rightSupport !== undefined && <PinSupport position={rightSupport} />}
        </>
      ) : (
        <FixedSupport />
      )}
    </>
  );
};