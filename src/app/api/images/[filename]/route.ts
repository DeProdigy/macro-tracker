import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    const filepath = join(process.cwd(), 'uploads', filename);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Read and serve the file
    const imageBuffer = await readFile(filepath);

    // Determine content type based on file extension
    const extension = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg'; // default

    switch (extension) {
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
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