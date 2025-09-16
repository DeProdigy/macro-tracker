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
      color: 'bg-purple-400',
      textColor: 'text-purple-300',
    },
    {
      name: 'Protein',
      value: Math.round(summary.totalProtein * 10) / 10,
      unit: 'g',
      color: 'bg-cyan-400',
      textColor: 'text-cyan-300',
    },
    {
      name: 'Fats',
      value: Math.round(summary.totalFats * 10) / 10,
      unit: 'g',
      color: 'bg-orange-400',
      textColor: 'text-orange-300',
    },
    {
      name: 'Carbs',
      value: Math.round(summary.totalCarbs * 10) / 10,
      unit: 'g',
      color: 'bg-green-400',
      textColor: 'text-green-300',
    },
  ];

  return (
    <div className="bg-blue-800 p-6 rounded-lg shadow-lg border border-blue-700">
      <h3 className="text-lg font-semibold mb-4 text-center text-white">Daily Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {macros.map((macro) => (
          <div key={macro.name} className="text-center">
            <div className={`w-16 h-16 ${macro.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">
                {macro.value}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{macro.name}</p>
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