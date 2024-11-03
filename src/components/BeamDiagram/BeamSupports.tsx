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
  const supportStyle = "w-8 h-16 flex flex-col items-center";
  
  const PinSupport = ({ position }: { position: number }) => (
    <div 
      className={`absolute bottom-8 ${supportStyle}`}
      style={{ 
        left: `calc(${paddingX}px + ${position * scale}%)`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="w-6 h-6 bg-blue-500 rotate-45" />
      <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-blue-500" />
    </div>
  );

  const FixedSupport = () => (
    <div 
      className={`absolute bottom-8 ${supportStyle}`}
      style={{ left: `${paddingX}px` }}
    >
      <div className="w-6 h-full bg-blue-500" />
      <div className="w-8 h-full absolute left-0 flex flex-col justify-evenly">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-4 h-1 bg-blue-500" />
        ))}
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