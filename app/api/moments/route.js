import { NextResponse } from 'next/server';
import { getAllMoments } from '@/lib/momentStore';

export async function GET() {
  try {
    const moments = await getAllMoments();
    return NextResponse.json({ success: true, data: moments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
