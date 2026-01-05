
import { useState } from 'react';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL || 'http://localhost:3000';
const AVATAR_STORAGE_KEY = '@avatar_data';

export interface BodyMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
}

export interface AvatarData {
  imageUrl: string;
  measurements: BodyMeasurements;
  createdAt: string;
}

export function useAvatarGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);

  const generateAvatar = async (faceImageUri: string, measurements: BodyMeasurements) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting avatar generation...');
      console.log('Backend URL:', BACKEND_URL);
      console.log('Face image URI:', faceImageUri);
      console.log('Measurements:', measurements);

      // TODO: Backend Integration - This endpoint will:
      // 1. Accept the face photo and body measurements
      // 2. Use OpenAI Vision API to analyze the face photo
      // 3. Remove background from the face photo using AI
      // 4. Generate a full-body avatar using DALL-E with the face and measurements
      // 5. Return the generated avatar URL
      
      const formData = new FormData();
      formData.append('face_image', {
        uri: faceImageUri,
        type: 'image/jpeg',
        name: 'face.jpg',
      } as any);
      formData.append('measurements', JSON.stringify(measurements));

      console.log('Sending request to backend...');
      
      const response = await fetch(`${BACKEND_URL}/api/avatar/generate`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Failed to generate avatar: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Avatar generated successfully:', data);

      const newAvatarData: AvatarData = {
        imageUrl: data.avatar_url,
        measurements,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(newAvatarData));
      setAvatarData(newAvatarData);

      return newAvatarData;
    } catch (err) {
      console.error('Avatar generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadAvatar = async () => {
    try {
      const stored = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        console.log('Loaded avatar from storage:', parsedData);
        setAvatarData(parsedData);
      }
    } catch (err) {
      console.error('Failed to load avatar:', err);
    }
  };

  return {
    generateAvatar,
    loadAvatar,
    loading,
    error,
    avatarData,
  };
}
