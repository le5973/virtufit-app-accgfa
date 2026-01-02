
import { useState, useEffect } from 'react';
import { WishlistItem } from '@/types/bodyMeasurements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ervenista_wishlist';

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<WishlistItem, 'id' | 'dateAdded'>) => {
    try {
      const newItem: WishlistItem = {
        ...item,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      };
      const updated = [...items, newItem];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setItems(updated);
      return newItem;
    } catch (error) {
      console.log('Error adding item:', error);
      throw error;
    }
  };

  const removeItem = async (id: string) => {
    try {
      const updated = items.filter(i => i.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setItems(updated);
    } catch (error) {
      console.log('Error removing item:', error);
      throw error;
    }
  };

  const togglePublic = async (id: string) => {
    try {
      const updated = items.map(item =>
        item.id === id ? { ...item, isPublic: !item.isPublic } : item
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setItems(updated);
    } catch (error) {
      console.log('Error toggling public:', error);
      throw error;
    }
  };

  const getPublicItems = () => items.filter(item => item.isPublic);

  return { 
    items, 
    loading, 
    addItem, 
    removeItem, 
    togglePublic,
    getPublicItems,
    refreshWishlist: loadWishlist 
  };
};
