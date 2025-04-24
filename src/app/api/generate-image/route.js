// app/api/generate-image/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;
    
    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    // Use Unsplash API to get images based on the prompt
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(prompt)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      // Fallback if Unsplash API fails or rate limit reached
      return NextResponse.json({ 
        imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(prompt)}`
      });
    }

    const data = await response.json();
    const imageUrl = data.urls.regular;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Fallback to Unsplash source URL if there's an error
    return NextResponse.json({ 
      imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(request.body?.prompt || 'landscape')}`
    });
  }
}