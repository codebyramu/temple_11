import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const framesDir = path.join(process.cwd(), 'public', 'frames');
    if (!fs.existsSync(framesDir)) {
      return NextResponse.json({ frames: [] });
    }
    
    const files = fs.readdirSync(framesDir)
      .filter(file => file.endsWith('.webp') || file.endsWith('.png'))
      .sort();
      
    return NextResponse.json({ frames: files });
  } catch {
    return NextResponse.json({ error: 'Failed to read frames' }, { status: 500 });
  }
}
