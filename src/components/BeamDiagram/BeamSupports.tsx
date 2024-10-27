import React from 'react';

interface BeamSupportsProps {
  type: 'simple' | 'cantilever';
  leftSupport: number;
  rightSupport?: number;
  scale: number;
}

export const BeamSupports: React.FC<BeamSupportsProps> = ({ 
  type, 
  leftSupport, 
  rightSupport, 
  scale 
}) => {
  const supportStyle = "w-6 h-10 flex flex-col items-center";
  
  const PinSupport = ({ position }: { position: number }) => (
    <div 
      className={`absolute bottom-0 ${supportStyle}`} 
      style={{ left: `${position * scale}px`, transform: 'translateX(-50%)' }}
    >
      <div className="w-4 h-4 bg-blue-500 rotate-45" />
      <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-blue-500" />
    </div>
  );

  const FixedSupport = () => (
    <div className={`absolute bottom-0 left-0 ${supportStyle}`}>
      <div className="w-4 h-full bg-blue-500" />
      <div className="w-6 h-full absolute left-0 flex flex-col justify-evenly">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-3 h-0.5 bg-blue-500" />
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