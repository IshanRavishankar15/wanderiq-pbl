
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!unsplashAccessKey) {
        console.error("Unsplash Access Key not found.");
        return NextResponse.json({ error: "Unsplash Access Key not configured." }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
        }

        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: query,
                per_page: 1, 
                orientation: 'landscape', 
                content_filter: 'high' 
            },
            headers: {
                Authorization: `Client-ID ${unsplashAccessKey}`
            }
        });

        const photos = response.data.results;

        if (photos.length > 0) {
            const imageUrl = photos[0].urls.regular;
            const altDescription = photos[0].alt_description || query;
            return NextResponse.json({ imageUrl, altDescription });
        } else {
            return NextResponse.json({ imageUrl: null, altDescription: `No image found for ${query}` });
        }

    } catch (error) {
        console.error("Error fetching from Unsplash API:", error.response?.data || error.message);
        return NextResponse.json({ error: "Failed to fetch image from Unsplash." }, { status: 500 });
    }
}