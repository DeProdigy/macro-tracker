'use client';

import type { MacroSummary } from '@/types';

interface DailySummaryProps {
  summary: MacroSummary;
}

const DailySummary = ({ summary }: DailySummaryProps) => {
  const macros = [
    {
      name: 'Calories',
      value: Math.round(summary.totalCalories),
      unit: 'cal',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
    {
      name: 'Protein',
      value: Math.round(summary.totalProtein * 10) / 10,
      unit: 'g',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      name: 'Fats',
      value: Math.round(summary.totalFats * 10) / 10,
      unit: 'g',
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
    {
      name: 'Carbs',
      value: Math.round(summary.totalCarbs * 10) / 10,
      unit: 'g',
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-100">
      <h3 className="text-lg font-semibold mb-4 text-center text-slate-900">Daily Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {macros.map((macro) => (
          <div key={macro.name} className="text-center">
            <div className={`w-16 h-16 ${macro.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">
                {macro.value}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{macro.name}</p>
            <p className={`text-xs ${macro.textColor} font-medium`}>
              {macro.value} {macro.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySummary;