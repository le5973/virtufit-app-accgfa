
import { useState } from 'react';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_STORAGE_KEY = '@avatar_uri';
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'BACKEND_URL_PLACEHOLDER';

interface BodyMeasurements {
  height: number; // in cm
  weight: number; // in kg
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  shoulderWidth?: number; // in cm
  inseam?: number; // in cm
}

export const useAvatarGeneration = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved avatar from storage
  const loadAvatar = async () => {
    try {
      const savedUri = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      if (savedUri) {
        setAvatarUri(savedUri);
      }
    } catch (err) {
      console.error('Failed to load avatar:', err);
    }
  };

  // Save avatar to storage
  const saveAvatar = async (uri: string) => {
    try {
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, uri);
      setAvatarUri(uri);
    } catch (err) {
      console.error('Failed to save avatar:', err);
    }
  };

  // Generate avatar from FACE PHOTO ONLY + body measurements
  // The backend will:
  // 1. Extract and isolate the face from the photo
  // 2. Remove background from face
  // 3. Generate a full 3D body based on the measurements provided
  // 4. Apply the face to the generated 3D body
  // 5. Render on aesthetic podium background
  const generateAvatar = async (
    faceImageUri: string,
    height: number,
    weight: number,
    additionalMeasurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      shoulderWidth?: number;
      inseam?: number;
    }
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      // TODO: Backend Integration - Call the face-to-avatar generation API
      // This endpoint will:
      // 1. Extract face from uploaded photo using AI face detection
      // 2. Remove background from face using AI background removal
      // 3. Generate 3D body model from height, weight, and optional measurements
      // 4. Map face texture onto 3D avatar head
      // 5. Render final avatar on aesthetic podium background
      // 6. Return URL of generated avatar image
      
      const formData = new FormData();
      
      // Append face image
      formData.append('faceImage', {
        uri: faceImageUri,
        type: 'image/jpeg',
        name: 'face.jpg',
      } as any);
      
      // Append required measurements
      formData.append('height', height.toString());
      formData.append('weight', weight.toString());
      
      // Append optional measurements if provided
      if (additionalMeasurements?.chest) {
        formData.append('chest', additionalMeasurements.chest.toString());
      }
      if (additionalMeasurements?.waist) {
        formData.append('waist', additionalMeasurements.waist.toString());
      }
      if (additionalMeasurements?.hips) {
        formData.append('hips', additionalMeasurements.hips.toString());
      }
      if (additionalMeasurements?.shoulderWidth) {
        formData.append('shoulderWidth', additionalMeasurements.shoulderWidth.toString());
      }
      if (additionalMeasurements?.inseam) {
        formData.append('inseam', additionalMeasurements.inseam.toString());
      }

      const response = await fetch(`${BACKEND_URL}/api/generate-avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate avatar');
      }

      const data = await response.json();
      const generatedUri = data.avatarUrl;

      if (!generatedUri) {
        throw new Error('No avatar URL returned from server');
      }

      await saveAvatar(generatedUri);
      return generatedUri;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate avatar';
      setError(errorMessage);
      console.error('Avatar generation error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear avatar
  const clearAvatar = async () => {
    try {
      await AsyncStorage.removeItem(AVATAR_STORAGE_KEY);
      setAvatarUri(null);
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
    clearAvatar,
  };
};
