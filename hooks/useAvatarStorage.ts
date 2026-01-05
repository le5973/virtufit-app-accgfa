
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_STORAGE_KEY = '@avatar_data';
const STYLE_PROFILE_KEY = '@style_profile';

export interface AvatarData {
  imageUri: string;
  measurements: {
    height: string;
    weight: string;
    bust: string;
    waist: string;
    hip: string;
  };
  createdAt: Date;
}

export interface StyleProfile {
  fitPreference: 'tight' | 'fitted' | 'regular' | 'loose' | 'oversized';
  insecurities: string[];
  stylePreferences: string[];
  completedAt: Date;
}

export function useAvatarStorage() {
  const [avatar, setAvatar] = useState<AvatarData | null>(null);
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvatar();
    loadStyleProfile();
  }, []);

  const loadAvatar = async () => {
    try {
      const data = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      if (data) {
        setAvatar(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAvatar = async (avatarData: AvatarData) => {
    try {
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatarData));
      setAvatar(avatarData);
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  const loadStyleProfile = async () => {
    try {
      const data = await AsyncStorage.getItem(STYLE_PROFILE_KEY);
      if (data) {
        setStyleProfile(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading style profile:', error);
    }
  };

  const saveStyleProfile = async (profile: StyleProfile) => {
    try {
      await AsyncStorage.setItem(STYLE_PROFILE_KEY, JSON.stringify(profile));
      setStyleProfile(profile);
    } catch (error) {
      console.error('Error saving style profile:', error);
    }
  };

  return {
    avatar,
    styleProfile,
    loading,
    saveAvatar,
    saveStyleProfile,
  };
}
