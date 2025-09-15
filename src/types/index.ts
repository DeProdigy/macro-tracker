import type { FoodEntry, User } from '@prisma/client';

// Re-export Prisma types
export type { FoodEntry, User };

export interface MacroSummary {
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
  totalCalories: number;
}

export interface FoodAnalysisRequest {
  imageBase64: string;
  description?: string;
}

export interface OpenAIAnalysisResult {
  protein: number;
  fats: number;
  carbs: number;
  calories: number;
  confidence: number;
  detectedFoods: string[];
}

export interface FoodAnalysisResponse {
  protein: number;
  fats: number;
  carbs: number;
  calories: number;
  confidence: number;
  detectedFoods: string[];
}