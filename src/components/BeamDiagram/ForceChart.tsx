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
  const unit = isShear ? 'N' : 'Nm';

  // Calculate domain for Y axis
  const values = data.map(d => isShear ? d.shearForce : d.bendingMoment).filter(Boolean) as number[];
  const maxAbs = Math.max(...values.map(Math.abs), 0.1);
  const yDomain = [-maxAbs, maxAbs];

  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 80,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="distance"
            height={50}
            label={{
              value: 'Distance (m)',
              position: 'bottom',
              offset: 40,
              style: {
                fill: '#e5e7eb',
                fontSize: '14px',
                fontWeight: 500
              }
            }}
            tick={{
              fontSize: 12,
              fill: '#e5e7eb'
            }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis
            domain={yDomain}
            width={70}
            label={{
              value: isShear ? 'Shear Force (N)' : 'Bending Moment (Nm)',
              angle: -90,
              position: 'insideLeft',
              offset: -60,
              style: {
                fill: '#e5e7eb',
                fontSize: '14px',
                fontWeight: 500,
                textAnchor: 'middle'
              }
            }}
            tick={{
              fontSize: 12,
              fill: '#e5e7eb'
            }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, isShear ? 'Shear Force' : 'Bending Moment']}
            labelFormatter={(label: number) => `Distance: ${label.toFixed(2)} m`}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.375rem',
              padding: '8px 12px'
            }}
            itemStyle={{ color: '#e5e7eb' }}
            labelStyle={{ color: '#e5e7eb', marginBottom: '4px' }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
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