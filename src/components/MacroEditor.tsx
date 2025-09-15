'use client';

import { useState } from 'react';

interface MacroEditorProps {
  protein: number;
  fats: number;
  carbs: number;
  calories: number;
  onUpdate: (macros: { protein: number; fats: number; carbs: number; calories: number }) => void;
}

const MacroEditor = ({ protein, fats, carbs, calories, onUpdate }: MacroEditorProps) => {
  const [values, setValues] = useState({ protein, fats, carbs, calories });

  const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    const newValues = { ...values, [field]: newValue };
    setValues(newValues);
    onUpdate(newValues);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Protein (g)
        </label>
        <input
          type="number"
          step="0.1"
          value={values.protein}
          onChange={handleChange('protein')}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Fats (g)
        </label>
        <input
          type="number"
          step="0.1"
          value={values.fats}
          onChange={handleChange('fats')}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Carbs (g)
        </label>
        <input
          type="number"
          step="0.1"
          value={values.carbs}
          onChange={handleChange('carbs')}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Calories
        </label>
        <input
          type="number"
          step="1"
          value={values.calories}
          onChange={handleChange('calories')}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default MacroEditor;