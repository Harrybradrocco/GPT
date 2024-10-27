import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useStore } from '../store';

const ReactionForcePlot = () => {
  const { loads, results } = useStore();
  
  const generatePlotData = () => {
    const points = [];
    const beamLength = Math.max(...loads.map(l => l.distance), 10);
    
    for (let x = 0; x <= beamLength; x += beamLength / 20) {
      const point = {
        distance: x,
        shearForce: calculateShearForce(x),
        bendingMoment: calculateBendingMoment(x)
      };
      points.push(point);
    }
    return points;
  };

  const calculateShearForce = (x: number) => {
    let force = -results.reactionForceA;
    loads.forEach(load => {
      if (x > load.distance) {
        force += load.force * Math.sin(load.angle * Math.PI / 180);
      }
    });
    return force;
  };

  const calculateBendingMoment = (x: number) => {
    let moment = -results.reactionForceA * x;
    loads.forEach(load => {
      if (x > load.distance) {
        moment += load.force * Math.sin(load.angle * Math.PI / 180) * (x - load.distance);
      }
    });
    return moment;
  };

  const plotData = generatePlotData();

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Reaction Forces Plot</h3>
      <div className="w-full h-[300px]">
        <LineChart
          width={500}
          height={300}
          data={plotData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="distance" label={{ value: 'Distance (m)', position: 'bottom' }} />
          <YAxis label={{ value: 'Force (N)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="shearForce" stroke="#8884d8" name="Shear Force" />
          <Line type="monotone" dataKey="bendingMoment" stroke="#82ca9d" name="Bending Moment" />
        </LineChart>
      </div>
    </div>
  );
};

export default ReactionForcePlot;