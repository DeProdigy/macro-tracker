'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DailySummary from './DailySummary';
import MacroChart from './MacroChart';
import { apiCall } from '@/lib/api';
import type { FoodEntry, MacroSummary } from '@/types';

const Dashboard = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateMacroSummary = (entries: FoodEntry[]): MacroSummary => {
    return entries.reduce(
      (summary, entry) => ({
        totalProtein: summary.totalProtein + entry.protein,
        totalFats: summary.totalFats + entry.fats,
        totalCarbs: summary.totalCarbs + entry.carbs,
        totalCalories: summary.totalCalories + entry.calories,
      }),
      { totalProtein: 0, totalFats: 0, totalCarbs: 0, totalCalories: 0 }
    );
  };

  const fetchFoodEntries = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiCall(`/api/food-entries?date=${today}`);
      if (response.ok) {
        const entries = await response.json();
        setFoodEntries(entries);
      }
    } catch (error) {
      console.error('Failed to fetch food entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodEntries();
  }, []);

  const summary = calculateMacroSummary(foodEntries);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Today&apos;s Dashboard
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto"></div>
          <p className="mt-2 text-blue-100">Loading...</p>
        </div>
      ) : (
        <>
          <DailySummary summary={summary} />

          {summary.totalCalories > 0 ? (
            <MacroChart
              protein={summary.totalProtein}
              fats={summary.totalFats}
              carbs={summary.totalCarbs}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-slate-600">No food entries for this day</p>
              <p className="text-sm text-slate-500 mt-1">
                Add some food entries to see your macro breakdown
              </p>
            </div>
          )}

          {foodEntries.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Food Entries ({foodEntries.length})
              </h3>
              <div className="space-y-3">
                {foodEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={entry.imagePath}
                        alt="Food"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {entry.description || 'Food Entry'}
                        </p>
                        <p className="text-xs text-slate-600">
                          {new Date(entry.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{Math.round(entry.calories)} cal</p>
                      <p className="text-slate-700">
                        P: {entry.protein}g | F: {entry.fats}g | C: {entry.carbs}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;