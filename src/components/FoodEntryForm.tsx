'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import MacroEditor from './MacroEditor';
import { apiCall, apiCallFormData } from '@/lib/api';
import type { OpenAIAnalysisResult } from '@/types';

const FoodEntryForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [macros, setMacros] = useState({
    protein: 0,
    fats: 0,
    carbs: 0,
    calories: 0,
  });
  const [confidence, setConfidence] = useState(0);
  const [detectedFoods, setDetectedFoods] = useState<string[]>([]);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setImagePreview(preview);
    setMacros({ protein: 0, fats: 0, carbs: 0, calories: 0 });
    setConfidence(0);
    setDetectedFoods([]);
  };

  const analyzeFood = async () => {
    if (!selectedFile || !imagePreview) return;

    setAnalyzing(true);
    try {
      const response = await apiCall('/api/analyze-food', {
        method: 'POST',
        body: JSON.stringify({
          imageBase64: imagePreview,
          description: description.trim() || undefined,
        }),
      });

      if (response.ok) {
        const result: OpenAIAnalysisResult = await response.json();
        setMacros({
          protein: result.protein,
          fats: result.fats,
          carbs: result.carbs,
          calories: result.calories,
        });
        setConfidence(result.confidence);
        setDetectedFoods(result.detectedFoods);
      } else {
        console.error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveFoodEntry = async () => {
    if (!selectedFile) return;

    setSaving(true);
    try {
      // First upload the image
      const formData = new FormData();
      formData.append('image', selectedFile);

      const uploadResponse = await apiCallFormData('/api/upload-image', formData);

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { path: imagePath } = await uploadResponse.json();

      // Then save the food entry
      const entryResponse = await apiCall('/api/food-entries', {
        method: 'POST',
        body: JSON.stringify({
          imagePath,
          description: description.trim() || null,
          ...macros,
        }),
      });

      if (entryResponse.ok) {
        // Reset form
        setSelectedFile(null);
        setImagePreview('');
        setDescription('');
        setMacros({ protein: 0, fats: 0, carbs: 0, calories: 0 });
        setConfidence(0);
        setDetectedFoods([]);
        alert('Food entry saved successfully!');
      } else {
        throw new Error('Failed to save food entry');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save food entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-slate-900">Add Food Entry</h1>

      <ImageUpload
        onImageSelect={handleImageSelect}
        preview={imagePreview}
      />

      {selectedFile && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., grilled chicken breast with rice"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={analyzeFood}
            disabled={analyzing}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Food'}
          </button>

          {confidence > 0 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Analysis Results</h3>
                  <span className="text-sm text-slate-700">
                    Confidence: {Math.round(confidence * 100)}%
                  </span>
                </div>
                {detectedFoods.length > 0 && (
                  <p className="text-sm text-slate-700">
                    Detected: {detectedFoods.join(', ')}
                  </p>
                )}
              </div>

              <MacroEditor
                protein={macros.protein}
                fats={macros.fats}
                carbs={macros.carbs}
                calories={macros.calories}
                onUpdate={setMacros}
              />

              <button
                onClick={saveFoodEntry}
                disabled={saving}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Food Entry'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodEntryForm;