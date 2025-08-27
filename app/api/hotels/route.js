import { NextResponse } from 'next/server';
import { getDummyHotels } from '@/lib/dummyData';

export async function POST(request) {
  const body = await request.json();
  const { destination, startDate, endDate } = body;

  // Real implementation would use an API.
  if (process.env.SOME_HOTEL_API_KEY) {
      // const realHotels = await fetchFromHotelProvider(destination, startDate, endDate);
      // return NextResponse.json(realHotels);
  }
  
  // Return dummy data.
  const dummyHotels = getDummyHotels();
  return NextResponse.json(dummyHotels);
}