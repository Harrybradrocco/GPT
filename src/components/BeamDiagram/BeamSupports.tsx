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
  const supportStyle = "absolute flex flex-col items-center";
  const triangleSize = "w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-blue-500";
  
  const PinSupport = ({ position }: { position: number }) => (
    <div 
      className={supportStyle}
      style={{ 
        left: `calc(${paddingX}px + ${position * scale}%)`,
        top: '50%',
        transform: 'translate(-50%, -1px)' // -1px to ensure precise beam contact
      }}
    >
      <div className={triangleSize} />
    </div>
  );

  const FixedSupport = () => (
    <div 
      className={supportStyle}
      style={{ 
        left: `${paddingX}px`,
        top: '50%',
        transform: 'translate(-50%, -1px)' // -1px to ensure precise beam contact
      }}
    >
      <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[24px] border-l-transparent border-r-transparent border-b-blue-500" />
      <div className="w-8 absolute left-0 flex flex-col justify-evenly mt-2">
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