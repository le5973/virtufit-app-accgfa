
import { useState } from 'react';
import Constants from 'expo-constants';

// Get backend URL from app.json configuration
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || '';

export interface VirtualTryOnResult {
  imageUrl: string;
  confidence: number;
  processingTime: number;
}

export const useVirtualTryOn = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);

  const tryOnClothing = async (avatarUri: string, clothingImageUrl: string) => {
    setIsProcessing(true);
    setError(null);
    setTryOnResult(null);
    
    try {
      console.log('Processing virtual try-on...');
      console.log('Avatar URI:', avatarUri);
      console.log('Clothing URL:', clothingImageUrl);
      
      if (!BACKEND_URL || BACKEND_URL === 'BACKEND_URL_PLACEHOLDER') {
        throw new Error('Backend URL not configured. Please wait for backend deployment.');
      }

      // TODO: Backend Integration - Call the /api/virtual-tryon endpoint
      // The backend will:
      // 1. Accept the avatar image URI and clothing product URL
      // 2. Use GPT-5.2 vision to analyze the clothing item from the product URL
      // 3. Extract clothing details (color, style, fit) from the product page
      // 4. Generate a realistic image of the clothing overlaid on the avatar
      // 5. Return the composite image URL showing the product on your avatar
      
      const response = await fetch(`${BACKEND_URL}/api/virtual-tryon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          avatarUrl: avatarUri,
          clothingUrl: clothingImageUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Virtual try-on error:', response.status, errorText);
        throw new Error(`Failed to process virtual try-on: ${response.status}`);
      }

      const data = await response.json();
      console.log('Virtual try-on response:', data);
      
      const imageUrl = data.imageUrl || data.url || data.tryOnImageUrl;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from backend');
      }
      
      setTryOnResult(imageUrl);
      
      return {
        imageUrl,
        confidence: data.confidence || 0.95,
        processingTime: data.processingTime || 0,
      };
    } catch (err: any) {
      console.error('Virtual try-on failed:', err);
      const errorMessage = err?.message || 'Failed to process virtual try-on. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setTryOnResult(null);
    setError(null);
  };

  return { 
    isProcessing, 
    error,
    tryOnResult,
    tryOnClothing,
    reset
  };
};
