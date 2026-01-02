
import { useState, useEffect } from 'react';
import { SavedOutfit } from '@/types/bodyMeasurements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ervenista_saved_outfits';

export const useSavedOutfits = () => {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setOutfits(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOutfit = async (outfit: Omit<SavedOutfit, 'id' | 'dateAdded'>) => {
    try {
      const newOutfit: SavedOutfit = {
        ...outfit,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      };
      const updated = [...outfits, newOutfit];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setOutfits(updated);
      return newOutfit;
    } catch (error) {
      console.log('Error adding outfit:', error);
      throw error;
    }
  };

  const removeOutfit = async (id: string) => {
    try {
      const updated = outfits.filter(o => o.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setOutfits(updated);
    } catch (error) {
      console.log('Error removing outfit:', error);
      throw error;
    }
  };

  return { outfits, loading, addOutfit, removeOutfit, refreshOutfits: loadOutfits };
};
