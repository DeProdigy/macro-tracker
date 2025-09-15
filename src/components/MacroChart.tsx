'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MacroChartProps {
  protein: number;
  fats: number;
  carbs: number;
}

const MacroChart = ({ protein, fats, carbs }: MacroChartProps) => {
  const data = [
    { name: 'Protein', value: protein * 4, grams: protein, color: '#3B82F6' },
    { name: 'Fats', value: fats * 9, grams: fats, color: '#EF4444' },
    { name: 'Carbs', value: carbs * 4, grams: carbs, color: '#10B981' },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-300 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-slate-700">{data.grams}g ({data.value} cal)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Macro Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.map((macro) => (
          <div key={macro.name} className="text-center">
            <div
              className="w-4 h-4 rounded mx-auto mb-1"
              style={{ backgroundColor: macro.color }}
            />
            <p className="text-sm font-medium">{macro.name}</p>
            <p className="text-xs text-slate-700">{macro.grams}g</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MacroChart;