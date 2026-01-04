
import { useState } from 'react';
import { apiPost } from '@/utils/api';

export const useVirtualTryOn = () => {
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tryOnClothing = async (avatarUri: string, clothingImageUrl: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Processing virtual try-on...');
      
      // TODO: Backend Integration - Call the virtual try-on API
      // POST /api/virtual-tryon with avatarUri, clothingImageUrl
      // Backend will:
      // 1. Take the background-removed AI avatar
      // 2. Extract clothing from the clothing image URL
      // 3. Visually overlay/composite the clothing onto the AI model
      // 4. Return the final try-on image URL
      const response = await apiPost('/api/virtual-tryon', {
        avatarUri,
        clothingImageUrl,
      });

      const resultUri = response.tryOnImageUrl;
      setTryOnResult(resultUri);
      
      console.log('Virtual try-on completed:', resultUri);
      return resultUri;
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
    tryOnResult, 
    isProcessing, 
    error,
    tryOnClothing,
    reset 
  };
};
