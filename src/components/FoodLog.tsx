'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiCall } from '@/lib/api';
import type { FoodEntry } from '@/types';

const FoodLog = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fetchFoodEntries = async (date: string) => {
    setLoading(true);
    try {
      const response = await apiCall(`/api/food-entries?date=${date}`);
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
    fetchFoodEntries(selectedDate);
  }, [selectedDate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {isToday ? "Today's" : formatDate(selectedDate)} Food Log
        </h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 font-medium"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-slate-700">Loading...</p>
        </div>
      ) : foodEntries.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No food entries</h3>
          <p className="text-slate-600">
            You haven&apos;t logged any food for this day yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {foodEntries.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <Image
                      src={entry.imagePath}
                      alt="Food"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-slate-900">
                      {entry.description || 'Food Entry'}
                    </h3>
                    <span className="text-sm text-slate-600">
                      {formatTime(entry.createdAt.toString())}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round(entry.calories)}
                      </p>
                      <p className="text-sm text-slate-700">Calories</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {entry.protein}
                      </p>
                      <p className="text-sm text-slate-700">Protein (g)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {entry.fats}
                      </p>
                      <p className="text-sm text-slate-700">Fats (g)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {entry.carbs}
                      </p>
                      <p className="text-sm text-slate-700">Carbs (g)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-slate-900 mb-2">Daily Totals</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-bold text-purple-600">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.calories, 0))}
                </p>
                <p className="text-xs text-slate-700">Calories</p>
              </div>
              <div>
                <p className="font-bold text-blue-600">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.protein, 0) * 10) / 10}
                </p>
                <p className="text-xs text-slate-700">Protein</p>
              </div>
              <div>
                <p className="font-bold text-red-600">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.fats, 0) * 10) / 10}
                </p>
                <p className="text-xs text-slate-700">Fats</p>
              </div>
              <div>
                <p className="font-bold text-green-600">
                  {Math.round(foodEntries.reduce((sum, entry) => sum + entry.carbs, 0) * 10) / 10}
                </p>
                <p className="text-xs text-slate-700">Carbs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodLog;