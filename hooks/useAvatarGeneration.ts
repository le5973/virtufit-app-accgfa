
import { useState } from 'react';
import { apiPost } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_STORAGE_KEY = '@avatar_data';

export const useAvatarGeneration = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAvatar = async (imageUri: string, height: number, weight: number) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating avatar with background removal...');
      
      // TODO: Backend Integration - Call the background removal + avatar generation API
      // POST /api/generate-avatar with imageUri, height, weight
      // Backend will:
      // 1. Remove background from uploaded photo using AI
      // 2. Generate clean AI avatar as human replica
      // 3. Return avatar URL with transparent background
      const response = await apiPost('/api/generate-avatar', {
        imageUri,
        height,
        weight,
      });

      const generatedAvatarUri = response.avatarUrl;
      setAvatarUri(generatedAvatarUri);
      
      // Save to local storage
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify({
        avatarUrl: generatedAvatarUri,
        height,
        weight,
        createdAt: new Date().toISOString(),
      }));
      
      console.log('Avatar generated successfully:', generatedAvatarUri);
      return generatedAvatarUri;
    } catch (err: any) {
      console.error('Avatar generation failed:', err);
      const errorMessage = err?.message || 'Failed to generate avatar. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadAvatar = async () => {
    try {
      const saved = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setAvatarUri(data.avatarUrl);
        console.log('Loaded saved avatar:', data.avatarUrl);
      }
    } catch (err) {
      console.error('Failed to load avatar:', err);
    }
  };

  const clearAvatar = async () => {
    try {
      await AsyncStorage.removeItem(AVATAR_STORAGE_KEY);
      setAvatarUri(null);
      console.log('Avatar cleared');
    } catch (err) {
      console.error('Failed to clear avatar:', err);
    }
  };

  return { 
    avatarUri, 
    isGenerating, 
    error,
    generateAvatar, 
    loadAvatar,
    clearAvatar 
  };
};
