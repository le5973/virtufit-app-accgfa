
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
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { AvatarPreview } from '@/components/AvatarPreview';
import { useURL } from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OutfitItem {
  id: string;
  name: string;
  productUrl: string;
  addedAt: Date;
}

const OUTFITS_STORAGE_KEY = '@wardrobe_outfits';

export default function WardrobeScreen() {
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [avatarUrl] = useState<string | undefined>(undefined); // TODO: Backend Integration - Load avatar from storage/API
  
  // Handle deep links from Share Extension
  const url = useURL();

  // Load saved outfits from storage
  useEffect(() => {
    loadOutfits();
  }, []);

  // Handle incoming URLs from Share Extension
  useEffect(() => {
    if (url) {
      handleIncomingURL(url);
    }
  }, [url]);

  // Check for shared URLs from Share Extension on mount
  useEffect(() => {
    checkSharedURL();
  }, []);

  const loadOutfits = async () => {
    try {
      const stored = await AsyncStorage.getItem(OUTFITS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const outfitsWithDates = parsed.map((outfit: any) => ({
          ...outfit,
          addedAt: new Date(outfit.addedAt),
        }));
        setOutfits(outfitsWithDates);
      }
    } catch (error) {
      console.error('Error loading outfits:', error);
    }
  };

  const saveOutfits = async (newOutfits: OutfitItem[]) => {
    try {
      await AsyncStorage.setItem(OUTFITS_STORAGE_KEY, JSON.stringify(newOutfits));
    } catch (error) {
      console.error('Error saving outfits:', error);
    }
  };

  const checkSharedURL = async () => {
    // Check for shared URL from Share Extension via App Groups
    try {
      const sharedURL = await AsyncStorage.getItem('@shared_product_url');
      if (sharedURL) {
        setProductUrl(sharedURL);
        // Clear the shared URL
        await AsyncStorage.removeItem('@shared_product_url');
        Alert.alert('Product Link Received', 'A product link was shared to your wardrobe. Add a name to save it!');
      }
    } catch (error) {
      console.error('Error checking shared URL:', error);
    }
  };

  const handleIncomingURL = (incomingUrl: string) => {
    try {
      // Parse the URL - format: yourapp://wardrobe?url=<product_url>
      const urlObj = new URL(incomingUrl);
      const sharedProductUrl = urlObj.searchParams.get('url');
      
      if (sharedProductUrl) {
        setProductUrl(decodeURIComponent(sharedProductUrl));
        Alert.alert('Product Link Received', 'A product link was shared to your wardrobe. Add a name to save it!');
      }
    } catch (error) {
      console.error('Error parsing incoming URL:', error);
    }
  };

  const handleAddOutfit = () => {
    if (!outfitName.trim()) {
      Alert.alert('Error', 'Please enter an outfit name');
      return;
    }
    if (!productUrl.trim()) {
      Alert.alert('Error', 'Please paste a product URL');
      return;
    }

    const newOutfit: OutfitItem = {
      id: Date.now().toString(),
      name: outfitName.trim(),
      productUrl: productUrl.trim(),
      addedAt: new Date(),
    };

    const updatedOutfits = [newOutfit, ...outfits];
    setOutfits(updatedOutfits);
    saveOutfits(updatedOutfits);
    setOutfitName('');
    setProductUrl('');
    Alert.alert('Success', 'Outfit added to wardrobe!');
  };

  const handleRemoveOutfit = (id: string, name: string) => {
    Alert.alert('Remove Outfit', `Remove "${name}" from wardrobe?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updatedOutfits = outfits.filter((o) => o.id !== id);
          setOutfits(updatedOutfits);
          saveOutfits(updatedOutfits);
        },
      },
    ]);
  };

  const handleOpenProduct = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open product link')
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>My Wardrobe</Text>

        {/* Avatar Display with Podium */}
        <View style={styles.avatarSection}>
          <AvatarPreview avatarUrl={avatarUrl} />
        </View>

        {/* Add Outfit Form */}
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add New Outfit</Text>
          <Text style={styles.helpText}>
            Share product links from Safari using the Share button, or paste them here
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Outfit Name (e.g., Summer Dress)"
            placeholderTextColor={colors.textSecondary}
            value={outfitName}
            onChangeText={setOutfitName}
          />
          <TextInput
            style={styles.input}
            placeholder="Paste Product URL"
            placeholderTextColor={colors.textSecondary}
            value={productUrl}
            onChangeText={setProductUrl}
            autoCapitalize="none"
            keyboardType="url"
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddOutfit}>
            <IconSymbol ios_icon_name="plus" android_material_icon_name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add to Wardrobe</Text>
          </TouchableOpacity>
        </View>

        {/* Outfits List */}
        <View style={styles.outfitsSection}>
          <Text style={styles.sectionTitle}>Saved Outfits ({outfits.length})</Text>
          {outfits.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="tshirt" 
                android_material_icon_name="checkroom" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={styles.emptyText}>No outfits yet. Add your first one!</Text>
              <Text style={styles.emptySubtext}>
                Tip: Use the Share button in Safari to quickly add products
              </Text>
            </View>
          ) : (
            outfits.map((outfit) => (
              <View key={outfit.id} style={styles.outfitCard}>
                <View style={styles.outfitInfo}>
                  <Text style={styles.outfitName}>{outfit.name}</Text>
                  <Text style={styles.outfitUrl} numberOfLines={1}>
                    {outfit.productUrl}
                  </Text>
                  <Text style={styles.outfitDate}>
                    Added {outfit.addedAt.toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.outfitActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenProduct(outfit.productUrl)}
                  >
                    <IconSymbol ios_icon_name="link" android_material_icon_name="link" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemoveOutfit(outfit.id, outfit.name)}
                  >
                    <IconSymbol ios_icon_name="trash" android_material_icon_name="delete" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  avatarSection: {
    marginBottom: 30,
  },
  addSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    color: colors.text,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outfitsSection: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  outfitCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outfitInfo: {
    flex: 1,
    marginRight: 10,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  outfitUrl: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  outfitDate: {
    fontSize: 11,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  outfitActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
  },
});
