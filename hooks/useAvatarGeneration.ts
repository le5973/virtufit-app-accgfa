
import { useState } from 'react';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_STORAGE_KEY = '@avatar_data';

// Get backend URL from app.json configuration
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || '';

export const useAvatarGeneration = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAvatar = async (imageUri: string, height: number, weight: number) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating avatar with background removal and aesthetic background...');
      
      if (!BACKEND_URL || BACKEND_URL === 'BACKEND_URL_PLACEHOLDER') {
        throw new Error('Backend URL not configured. Please wait for backend deployment.');
      }

      // TODO: Backend Integration - Upload image and generate AI avatar
      // The backend will:
      // 1. Remove background from uploaded photo using OpenAI vision API
      // 2. Generate AI human body replica with aesthetic background
      // 3. Apply measurements to create accurate proportions
      // 4. Return avatar URL with aesthetic background
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add image file
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);
      
      // Add measurements
      formData.append('height', height.toString());
      formData.append('weight', weight.toString());
      
      console.log('Uploading to:', `${BACKEND_URL}/api/generate-avatar`);
      
      const response = await fetch(`${BACKEND_URL}/api/generate-avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error(`Failed to generate avatar: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Avatar generation response:', data);
      
      const generatedAvatarUri = data.avatarUrl || data.url;
      
      if (!generatedAvatarUri) {
        throw new Error('No avatar URL returned from backend');
      }
      
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
