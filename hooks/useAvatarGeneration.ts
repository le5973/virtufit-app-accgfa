
import { useState } from 'react';
import Constants from 'expo-constants';
import { useAvatarStorage, AvatarData } from './useAvatarStorage';

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'BACKEND_URL_PLACEHOLDER';

interface BodyMeasurements {
  height: number;
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulderWidth?: number;
  inseam?: number;
}

export const useAvatarGeneration = () => {
  const { avatar, saveAvatar } = useAvatarStorage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate avatar from FACE PHOTO ONLY + body measurements
  const generateAvatar = async (
    faceImageUri: string,
    measurements: {
      height: string;
      weight: string;
      bust?: string;
      waist?: string;
      hip?: string;
    }
  ): Promise<boolean> => {
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
      
      formData.append('faceImage', {
        uri: faceImageUri,
        type: 'image/jpeg',
        name: 'face.jpg',
      } as any);
      
      formData.append('height', measurements.height);
      formData.append('weight', measurements.weight);
      
      if (measurements.bust) {
        formData.append('bust', measurements.bust);
      }
      if (measurements.waist) {
        formData.append('waist', measurements.waist);
      }
      if (measurements.hip) {
        formData.append('hip', measurements.hip);
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

      // Save avatar with measurements
      const avatarData: AvatarData = {
        imageUri: generatedUri,
        measurements: {
          height: measurements.height,
          weight: measurements.weight,
          bust: measurements.bust || '',
          waist: measurements.waist || '',
          hip: measurements.hip || '',
        },
        createdAt: new Date(),
      };

      await saveAvatar(avatarData);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate avatar';
      setError(errorMessage);
      console.error('Avatar generation error:', err);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    avatarUri: avatar?.imageUri || null,
    isGenerating,
    error,
    generateAvatar,
    loadAvatar: () => {}, // Now handled by useAvatarStorage hook
  };
};
