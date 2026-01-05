
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
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ErvenistaBranding size="small" variant="minimal" />
        <Text style={styles.title}>My Wardrobe</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <AvatarDisplay size="medium" />
        </View>

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
              <Text style={styles.emptySubtext}>Add your first outfit to get started!</Text>
            </View>
          ) : (
            outfits.map((outfit) => (
              <View key={outfit.id} style={[styles.outfitCard, shadows.small]}>
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
            ))
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
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
});
