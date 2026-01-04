
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
  const [result, setResult] = useState<VirtualTryOnResult | null>(null);

  const tryOnClothing = async (avatarUri: string, clothingImageUrl: string) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Processing virtual try-on...');
      
      if (!BACKEND_URL || BACKEND_URL === 'BACKEND_URL_PLACEHOLDER') {
        throw new Error('Backend URL not configured. Please wait for backend deployment.');
      }

      // TODO: Backend Integration - Call virtual try-on API
      // The backend will:
      // 1. Take the AI avatar with aesthetic background
      // 2. Overlay the clothing item onto the avatar
      // 3. Use AI to ensure proper fit and realistic appearance
      // 4. Return the final image with clothing on avatar
      
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
      
      const tryOnResult: VirtualTryOnResult = {
        imageUrl: data.imageUrl || data.url,
        confidence: data.confidence || 0.95,
        processingTime: data.processingTime || 0,
      };
      
      setResult(tryOnResult);
      return tryOnResult;
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
    setResult(null);
    setError(null);
  };

  return { 
    isProcessing, 
    error,
    result,
    tryOnClothing,
    reset
  };
};
