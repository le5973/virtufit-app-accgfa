
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
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useURL } from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';
import { useVirtualTryOn } from '@/hooks/useVirtualTryOn';

interface OutfitItem {
  id: string;
  name: string;
  productUrl: string;
  addedAt: Date;
  tryOnImageUrl?: string;
}

const OUTFITS_STORAGE_KEY = '@wardrobe_outfits';

export default function WardrobeScreen() {
  const url = useURL();
  const { avatar } = useAvatarStorage();
  const { tryOnClothing, isProcessing } = useVirtualTryOn();
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [newOutfitUrl, setNewOutfitUrl] = useState('');
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

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
    Alert.alert('Remove Outfit', `Remove "${name}" from wardrobe`, [
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

  const handleTryOnOutfit = async (outfit: OutfitItem) => {
    if (!avatar?.imageUri) {
      Alert.alert('No Avatar', 'Please create your AI avatar first to use virtual try-on');
      return;
    }

    setProcessingItemId(outfit.id);
    
    try {
      // TODO: Backend Integration - Call the /api/virtual-tryon endpoint
      // This endpoint will:
      // 1. Accept the avatar image URI and clothing product URL
      // 2. Use GPT-5.2 vision to analyze the clothing item from the URL
      // 3. Generate a realistic overlay of the clothing on the avatar
      // 4. Return the composite image URL showing the product on your avatar
      
      const result = await tryOnClothing(avatar.imageUri, outfit.productUrl);
      
      if (result?.imageUrl) {
        // Update the outfit with the try-on image
        const updatedOutfits = outfits.map(o => 
          o.id === outfit.id 
            ? { ...o, tryOnImageUrl: result.imageUrl }
            : o
        );
        saveOutfits(updatedOutfits);
        Alert.alert('Success', 'Virtual try-on complete! The product is now displayed on your avatar.');
      }
    } catch (error) {
      console.error('Try-on error:', error);
      Alert.alert('Error', 'Failed to generate virtual try-on. Please try again.');
    } finally {
      setProcessingItemId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Wardrobe</Text>

        {!avatar && (
          <View style={styles.noAvatarBanner}>
            <IconSymbol
              ios_icon_name="info.circle"
              android_material_icon_name="info"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.noAvatarText}>
              Create your AI avatar to see products on your virtual model
            </Text>
          </View>
        )}

        {avatar && (
          <View style={styles.avatarSection}>
            <AvatarDisplay size="medium" />
            <Text style={styles.avatarLabel}>Your AI Avatar</Text>
          </View>
        )}

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
            <IconSymbol ios_icon_name="plus.circle.fill" android_material_icon_name="add_circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add to Wardrobe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.outfitsSection}>
          <Text style={styles.sectionTitle}>My Outfits ({outfits.length})</Text>
          {outfits.length === 0 ? (
            <Text style={styles.emptyText}>No outfits yet. Add your first one</Text>
          ) : (
            <React.Fragment>
              {outfits.map((outfit) => (
                <View key={outfit.id} style={styles.outfitCard}>
                  {/* Try-On Image Display */}
                  {outfit.tryOnImageUrl ? (
                    <View style={styles.tryOnImageContainer}>
                      <Image 
                        source={{ uri: outfit.tryOnImageUrl }} 
                        style={styles.tryOnImage}
                        resizeMode="contain"
                      />
                      <View style={styles.tryOnBadge}>
                        <IconSymbol 
                          ios_icon_name="checkmark.circle.fill"
                          android_material_icon_name="check_circle" 
                          size={16} 
                          color="#FFFFFF" 
                        />
                        <Text style={styles.tryOnBadgeText}>On Avatar</Text>
                      </View>
                    </View>
                  ) : avatar ? (
                    <View style={styles.placeholderContainer}>
                      <IconSymbol 
                        ios_icon_name="sparkles"
                        android_material_icon_name="auto_awesome" 
                        size={48} 
                        color={colors.grey} 
                      />
                      <Text style={styles.placeholderText}>Tap Try On to see this on your avatar</Text>
                    </View>
                  ) : null}

                  <View style={styles.outfitInfo}>
                    <Text style={styles.outfitName}>{outfit.name}</Text>
                    <TouchableOpacity onPress={() => handleOpenProduct(outfit.productUrl)}>
                      <Text style={styles.outfitUrl} numberOfLines={1}>
                        {outfit.productUrl}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleOpenProduct(outfit.productUrl)}
                    >
                      <IconSymbol
                        ios_icon_name="link"
                        android_material_icon_name="link"
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={styles.actionButtonText}>View Product</Text>
                    </TouchableOpacity>

                    {avatar && (
                      <TouchableOpacity
                        style={[
                          styles.tryOnButton,
                          (isProcessing && processingItemId === outfit.id) && styles.buttonDisabled
                        ]}
                        onPress={() => handleTryOnOutfit(outfit)}
                        disabled={isProcessing && processingItemId === outfit.id}
                      >
                        {isProcessing && processingItemId === outfit.id ? (
                          <>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.tryOnButtonText}>Processing...</Text>
                          </>
                        ) : (
                          <>
                            <IconSymbol
                              ios_icon_name="sparkles"
                              android_material_icon_name="auto_awesome"
                              size={16}
                              color="#fff"
                            />
                            <Text style={styles.tryOnButtonText}>
                              {outfit.tryOnImageUrl ? 'Refresh' : 'Try On'}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => handleRemoveOutfit(outfit.id, outfit.name)}>
                      <IconSymbol ios_icon_name="trash" android_material_icon_name="delete" size={24} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </React.Fragment>
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
  noAvatarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  noAvatarText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey,
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
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tryOnImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  tryOnImage: {
    width: '100%',
    height: '100%',
  },
  tryOnBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  tryOnBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  placeholderContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: 20,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.grey,
    textAlign: 'center',
  },
  outfitInfo: {
    marginBottom: 12,
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  tryOnButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  tryOnButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
