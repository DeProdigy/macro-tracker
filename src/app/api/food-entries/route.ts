import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import type { FoodEntry } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imagePath, description, protein, fats, carbs, calories } = await request.json();

    if (!imagePath || protein === undefined || fats === undefined || carbs === undefined || calories === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const foodEntry = await prisma.foodEntry.create({
      data: {
        userId: user.userId,
        imagePath,
        description: description || null,
        protein: parseFloat(protein),
        fats: parseFloat(fats),
        carbs: parseFloat(carbs),
        calories: parseFloat(calories),
      },
    });

    return NextResponse.json(foodEntry);

  } catch (error) {
    console.error('Food entry creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create food entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let whereClause: any = {
      userId: user.userId,
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.createdAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const foodEntries = await prisma.foodEntry.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(foodEntries);

  } catch (error) {
    console.error('Food entries fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food entries' },
      { status: 500 }
    );
  }
}