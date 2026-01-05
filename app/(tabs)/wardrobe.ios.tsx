
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useURL } from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { AvatarDisplay } from '@/components/AvatarDisplay';

interface OutfitItem {
  id: string;
  name: string;
  productUrl: string;
  addedAt: Date;
}

const OUTFITS_STORAGE_KEY = '@wardrobe_outfits';

export default function WardrobeScreen() {
  const url = useURL();
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [newOutfitUrl, setNewOutfitUrl] = useState('');

  useEffect(() => {
    loadOutfits();
  }, []);

  useEffect(() => {
    if (url) {
      handleIncomingURL(url);
    }
  }, [url]);

  const loadOutfits = async () => {
    try {
      const data = await AsyncStorage.getItem(OUTFITS_STORAGE_KEY);
      if (data) {
        setOutfits(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading outfits:', error);
    }
  };

  const saveOutfits = async (newOutfits: OutfitItem[]) => {
    try {
      await AsyncStorage.setItem(OUTFITS_STORAGE_KEY, JSON.stringify(newOutfits));
      setOutfits(newOutfits);
    } catch (error) {
      console.error('Error saving outfits:', error);
    }
  };

  const handleIncomingURL = (incomingUrl: string) => {
    const urlMatch = incomingUrl.match(/url=([^&]+)/);
    if (urlMatch) {
      const decodedUrl = decodeURIComponent(urlMatch[1]);
      setNewOutfitUrl(decodedUrl);
    }
  };

  const handleAddOutfit = () => {
    if (!newOutfitName.trim() || !newOutfitUrl.trim()) {
      Alert.alert('Error', 'Please enter both name and product URL');
      return;
    }

    const newOutfit: OutfitItem = {
      id: Date.now().toString(),
      name: newOutfitName.trim(),
      productUrl: newOutfitUrl.trim(),
      addedAt: new Date(),
    };

    saveOutfits([...outfits, newOutfit]);
    setNewOutfitName('');
    setNewOutfitUrl('');
    Alert.alert('Success', 'Outfit added to wardrobe!');
  };

  const handleRemoveOutfit = (id: string, name: string) => {
    Alert.alert('Remove Outfit', `Remove "${name}" from wardrobe?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => saveOutfits(outfits.filter(o => o.id !== id)),
      },
    ]);
  };

  const handleOpenProduct = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Wardrobe</Text>

        <View style={styles.avatarSection}>
          <AvatarDisplay size="medium" />
        </View>

        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add New Outfit</Text>
          <TextInput
            style={styles.input}
            placeholder="Outfit Name"
            placeholderTextColor={colors.grey}
            value={newOutfitName}
            onChangeText={setNewOutfitName}
          />
          <TextInput
            style={styles.input}
            placeholder="Product URL"
            placeholderTextColor={colors.grey}
            value={newOutfitUrl}
            onChangeText={setNewOutfitUrl}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddOutfit}>
            <IconSymbol ios_icon_name="plus.circle.fill" android_material_icon_name="add-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add to Wardrobe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.outfitsSection}>
          <Text style={styles.sectionTitle}>My Outfits ({outfits.length})</Text>
          {outfits.length === 0 ? (
            <Text style={styles.emptyText}>No outfits yet. Add your first one!</Text>
          ) : (
            outfits.map((outfit) => (
              <View key={outfit.id} style={styles.outfitCard}>
                <View style={styles.outfitInfo}>
                  <Text style={styles.outfitName}>{outfit.name}</Text>
                  <TouchableOpacity onPress={() => handleOpenProduct(outfit.productUrl)}>
                    <Text style={styles.outfitUrl} numberOfLines={1}>
                      {outfit.productUrl}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => handleRemoveOutfit(outfit.id, outfit.name)}>
                  <IconSymbol ios_icon_name="trash" android_material_icon_name="delete" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 100,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  addSection: {
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outfitsSection: {
    marginBottom: 24,
  },
  emptyText: {
    color: colors.grey,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  outfitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  outfitInfo: {
    flex: 1,
    marginRight: 12,
  },
  outfitName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  outfitUrl: {
    color: colors.accent,
    fontSize: 14,
  },
});
