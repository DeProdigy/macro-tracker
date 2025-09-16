'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiCall } from '@/lib/api';
import type { FoodEntry } from '@/types';

const FoodLog = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Today&apos;s Food Log
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto"></div>
          <p className="mt-2 text-blue-100">Loading...</p>
        </div>
      ) : foodEntries.length === 0 ? (
        <div className="bg-blue-800 p-8 rounded-lg shadow-md text-center border border-blue-700">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-white mb-2">No food entries</h3>
          <p className="text-blue-100">
            You haven&apos;t logged any food for this day yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {foodEntries.map((entry) => (
            <div key={entry.id} className="bg-blue-800 p-6 rounded-lg shadow-md border border-blue-700">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    {entry.imagePath.startsWith('/api/images/') ? (
                      <img
                        src={entry.imagePath}
                        alt="Food"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Image
                        src={entry.imagePath}
                        alt="Food"
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-white">
                      {entry.description || 'Food Entry'}
                    </h3>
                    <span className="text-sm text-blue-100">
                      {formatTime(entry.createdAt.toString())}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-300">
                        {Math.round(entry.calories)}
                      </p>
                      <p className="text-sm text-blue-100">Calories</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-300">
                        {entry.protein}
                      </p>
                      <p className="text-sm text-blue-100">Protein (g)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-300">
                        {entry.fats}
                      </p>
                      <p className="text-sm text-blue-100">Fats (g)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-300">
                        {entry.carbs}
                      </p>
                      <p className="text-sm text-blue-100">Carbs (g)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-blue-800 p-4 rounded-lg border border-blue-700">
            <h3 className="font-medium text-white mb-2">Daily Totals</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-bold text-purple-300">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.calories, 0))}
                </p>
                <p className="text-xs text-blue-100">Calories</p>
              </div>
              <div>
                <p className="font-bold text-cyan-300">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.protein, 0) * 10) / 10}
                </p>
                <p className="text-xs text-blue-100">Protein</p>
              </div>
              <div>
                <p className="font-bold text-orange-300">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.fats, 0) * 10) / 10}
                </p>
                <p className="text-xs text-blue-100">Fats</p>
              </div>
              <div>
                <p className="font-bold text-green-300">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.carbs, 0) * 10) / 10}
                </p>
                <p className="text-xs text-blue-100">Carbs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodLog;