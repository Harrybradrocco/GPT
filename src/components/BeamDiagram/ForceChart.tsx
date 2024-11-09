import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BeamDiagramPoint } from '../../types';

interface ForceChartProps {
  data: BeamDiagramPoint[];
  type: 'shear' | 'moment';
  height?: number;
}

export const ForceChart: React.FC<ForceChartProps> = ({ data, type, height = 200 }) => {
  const isShear = type === 'shear';
  const dataKey = isShear ? 'shearForce' : 'bendingMoment';
  const color = isShear ? '#dc2626' : '#2563eb';
  const unit = isShear ? 'N' : 'N·mm';

  const chartData = isShear ? data : data.map(point => ({
    ...point,
    bendingMoment: point.bendingMoment * 1000
  }));

  const values = chartData.map(d => isShear ? d.shearForce : d.bendingMoment).filter(Boolean) as number[];
  const maxAbs = Math.max(...values.map(Math.abs), 0.1);
  const yDomain = [-maxAbs, maxAbs];

  return (
    <div style={{ width: '100%', height: height }} className="max-w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 60,
            bottom: 40
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="distance"
            height={40}
            label={{
              value: 'Distance (mm)',
              position: 'bottom',
              offset: 20,
              style: {
                fill: '#374151',
                fontSize: '12px',
                fontWeight: 500
              }
            }}
            tick={{
              fontSize: 10,
              fill: '#374151'
            }}
            tickFormatter={(value) => value.toFixed(0)}
            stroke="#9ca3af"
          />
          <YAxis
            domain={yDomain}
            width={50}
            label={{
              value: isShear ? 'Shear Force (N)' : 'Bending Moment (N·mm)',
              angle: -90,
              position: 'insideLeft',
              offset: -40,
              style: {
                fill: '#374151',
                fontSize: '12px',
                fontWeight: 500,
                textAnchor: 'middle'
              }
            }}
            tick={{
              fontSize: 10,
              fill: '#374151'
            }}
            tickFormatter={(value) => value.toFixed(0)}
            stroke="#9ca3af"
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, isShear ? 'Shear Force' : 'Bending Moment']}
            labelFormatter={(label: number) => `Distance: ${label.toFixed(0)} mm`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '8px 12px'
            }}
            itemStyle={{ color: '#374151' }}
            labelStyle={{ color: '#374151', marginBottom: '4px' }}
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