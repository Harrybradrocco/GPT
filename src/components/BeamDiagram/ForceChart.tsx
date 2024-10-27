import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  distance: number;
  shearForce?: number;
  bendingMoment?: number;
  id: string;
}

interface ForceChartProps {
  data: DataPoint[];
  type: 'shear' | 'moment';
  height?: number;
}

export const ForceChart: React.FC<ForceChartProps> = ({ data, type, height = 200 }) => {
  const isShear = type === 'shear';
  const dataKey = isShear ? 'shearForce' : 'bendingMoment';
  const color = isShear ? '#ef4444' : '#3b82f6';
  const title = isShear ? 'Shear Force Diagram' : 'Bending Moment Diagram';
  const unit = isShear ? 'N' : 'Nm';

  // Calculate domain for Y axis
  const values = data.map(d => isShear ? d.shearForce : d.bendingMoment).filter(Boolean) as number[];
  const maxAbs = Math.max(...values.map(Math.abs), 0.1); // Avoid zero domain
  const yDomain = [-maxAbs, maxAbs];

  // Get the maximum X value from the data
  const maxX = Math.max(...data.map(d => d.distance));

  return (
    <div style={{ height: `${height}px` }}>
      <h4 className="text-lg font-medium mb-2">{title}</h4>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="distance"
            domain={[0, maxX]}
            label={{ value: 'Distance (m)', position: 'bottom' }}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            domain={yDomain}
            label={{
              value: `${isShear ? 'Shear Force (N)' : 'Bending Moment (Nm)'}`,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, isShear ? 'Shear Force' : 'Bending Moment']}
            labelFormatter={(label: number) => `Distance: ${label.toFixed(2)} m`}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            dot={false}
            name={isShear ? 'Shear Force' : 'Bending Moment'}
            key={`${type}-line-${dataKey}`}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};