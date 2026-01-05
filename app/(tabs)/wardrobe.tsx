
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
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ErvenistaBranding size="small" variant="minimal" />
        <Text style={styles.title}>My Wardrobe</Text>
      </View>

      {!avatar && (
        <View style={[styles.noAvatarBanner, shadows.small]}>
          <IconSymbol
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.noAvatarText}>
            Create your AI avatar to see products on your virtual model
          </Text>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {avatar && (
          <View style={styles.avatarSection}>
            <AvatarDisplay size="medium" />
            <Text style={styles.avatarLabel}>Your AI Avatar</Text>
          </View>
        )}

        <View style={[styles.addSection, shadows.medium]}>
          <Text style={commonStyles.heading}>Add New Outfit</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Outfit Name"
            placeholderTextColor={colors.textSecondary}
            value={newOutfitName}
            onChangeText={setNewOutfitName}
          />
          <TextInput
            style={commonStyles.input}
            placeholder="Product URL"
            placeholderTextColor={colors.textSecondary}
            value={newOutfitUrl}
            onChangeText={setNewOutfitUrl}
            autoCapitalize="none"
          />
          <TouchableOpacity style={buttonStyles.primary} onPress={handleAddOutfit}>
            <View style={styles.buttonContent}>
              <IconSymbol android_material_icon_name="add_circle" size={20} color="#FFFFFF" />
              <Text style={buttonStyles.primaryText}>Add to Wardrobe</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.outfitsSection}>
          <View style={commonStyles.sectionHeader}>
            <Text style={commonStyles.subtitle}>My Outfits</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{outfits.length}</Text>
            </View>
          </View>
          
          {outfits.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol android_material_icon_name="checkroom" size={64} color={colors.textLight} />
              <Text style={styles.emptyText}>No outfits yet</Text>
              <Text style={styles.emptySubtext}>Add your first outfit to get started</Text>
            </View>
          ) : (
            <React.Fragment>
              {outfits.map((outfit) => (
                <View key={outfit.id} style={[styles.outfitCard, shadows.small]}>
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
                        android_material_icon_name="auto_awesome" 
                        size={48} 
                        color={colors.textLight} 
                      />
                      <Text style={styles.placeholderText}>Tap Try On to see this on your avatar</Text>
                    </View>
                  ) : null}

                  <View style={styles.outfitHeader}>
                    <View style={styles.outfitIconCircle}>
                      <IconSymbol android_material_icon_name="checkroom" size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.outfitInfo}>
                      <Text style={styles.outfitName}>{outfit.name}</Text>
                      <TouchableOpacity onPress={() => handleOpenProduct(outfit.productUrl)}>
                        <Text style={styles.outfitUrl} numberOfLines={1}>
                          {outfit.productUrl}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleRemoveOutfit(outfit.id, outfit.name)}
                      style={styles.deleteButton}
                    >
                      <IconSymbol android_material_icon_name="delete" size={24} color={colors.error} />
                    </TouchableOpacity>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[buttonStyles.outline, styles.actionButton]}
                      onPress={() => handleOpenProduct(outfit.productUrl)}
                    >
                      <IconSymbol
                        android_material_icon_name="link"
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={[buttonStyles.outlineText, styles.actionButtonText]}>
                        View Product
                      </Text>
                    </TouchableOpacity>

                    {avatar && (
                      <TouchableOpacity
                        style={[
                          buttonStyles.primary, 
                          styles.actionButton,
                          (isProcessing && processingItemId === outfit.id) && styles.buttonDisabled
                        ]}
                        onPress={() => handleTryOnOutfit(outfit)}
                        disabled={isProcessing && processingItemId === outfit.id}
                      >
                        {isProcessing && processingItemId === outfit.id ? (
                          <>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text style={[buttonStyles.primaryText, styles.actionButtonText]}>
                              Processing...
                            </Text>
                          </>
                        ) : (
                          <>
                            <IconSymbol
                              android_material_icon_name="auto_awesome"
                              size={16}
                              color="#FFFFFF"
                            />
                            <Text style={[buttonStyles.primaryText, styles.actionButtonText]}>
                              {outfit.tryOnImageUrl ? 'Refresh Try-On' : 'Try On'}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </React.Fragment>
          )}
        </View>

        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  noAvatarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  noAvatarText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatarLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  addSection: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outfitsSection: {
    marginBottom: 24,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  outfitCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textSecondary,
    textAlign: 'center',
  },
  outfitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  outfitIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  outfitInfo: {
    flex: 1,
    marginRight: 12,
  },
  outfitName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  outfitUrl: {
    color: colors.primary,
    fontSize: 13,
  },
  deleteButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 13,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
