import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Basic security: only allow alphanumeric characters, hyphens, and dots
    if (!/^[a-zA-Z0-9.-]+$/.test(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // For old images that don't exist anymore, return a placeholder SVG
    const placeholderSvg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#f1f5f9"/>
        <text x="100" y="90" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="14">Image</text>
        <text x="100" y="110" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="14">Not Available</text>
        <text x="100" y="130" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="12">(Legacy Entry)</text>
      </svg>
    `;

    return new NextResponse(placeholderSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('Image serving error:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}