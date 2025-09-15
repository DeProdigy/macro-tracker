import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getUserFromRequest } from '@/lib/auth';
import type { FoodAnalysisRequest, OpenAIAnalysisResult } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Generate the type definition as a string for the prompt
const getTypeDefinition = (): string => {
  return `{
  protein: number;
  fats: number;
  carbs: number;
  calories: number;
  confidence: number; // 0-1 scale
  detectedFoods: string[];
}`;
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageBase64, description }: FoodAnalysisRequest = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    const typeDefinition = getTypeDefinition();

    const prompt = `
Analyze this food image and provide nutritional information. ${description ? `Additional context: ${description}` : ''}

Please provide:
1. Estimated portion size and food items detected
2. Nutritional breakdown per serving:
   - Protein (grams)
   - Fats (grams)
   - Carbohydrates (grams)
   - Total calories

Respond ONLY with valid JSON matching this TypeScript interface:
${typeDefinition}

Be as accurate as possible with portion estimation. If unsure, provide a reasonable estimate and lower confidence score.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
                detail: 'high'
              },
            },
          ],
        },
      ],
    });

    const responseText = response.choices[0]?.message?.content || '';

    try {
      // Clean up the response text - remove markdown code blocks if present
      let cleanedText = responseText.trim();

      // Remove markdown code block markers
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const analysis: OpenAIAnalysisResult = JSON.parse(cleanedText);
      return NextResponse.json(analysis);
    } catch {
      console.error('Failed to parse OpenAI response:', responseText);
      return NextResponse.json(
        { error: 'Failed to analyze food image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Food analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze food image' },
      { status: 500 }
    );
  }
}