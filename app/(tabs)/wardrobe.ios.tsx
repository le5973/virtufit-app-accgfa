
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSavedOutfits } from '@/hooks/useSavedOutfits';
import { SavedOutfit } from '@/types/bodyMeasurements';

export default function WardrobeScreen() {
  const { outfits, loading, addOutfit, removeOutfit } = useSavedOutfits();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    websiteUrl: '',
    websiteName: '',
    price: '',
    notes: '',
  });

  const handleAddOutfit = async () => {
    if (!formData.name || !formData.imageUrl || !formData.websiteUrl) {
      Alert.alert('Missing Information', 'Please fill in name, image URL, and website URL');
      return;
    }

    try {
      await addOutfit(formData);
      setFormData({
        name: '',
        imageUrl: '',
        websiteUrl: '',
        websiteName: '',
        price: '',
        notes: '',
      });
      setShowAddForm(false);
      Alert.alert('Success', 'Outfit added to your wardrobe!');
    } catch (error) {
      console.log('Error adding outfit:', error);
      Alert.alert('Error', 'Failed to add outfit');
    }
  };

  const handleRemoveOutfit = (id: string, name: string) => {
    Alert.alert(
      'Remove Outfit',
      `Remove "${name}" from your wardrobe?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeOutfit(id);
            } catch (error) {
              console.log('Error removing outfit:', error);
              Alert.alert('Error', 'Failed to remove outfit');
            }
          },
        },
      ]
    );
  };

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.log('Error opening URL:', err);
      Alert.alert('Error', 'Could not open website');
    });
  };

  const renderOutfitCard = (outfit: SavedOutfit) => (
    <View key={outfit.id} style={styles.outfitCard}>
      <Image source={{ uri: outfit.imageUrl }} style={styles.outfitImage} />
      <View style={styles.outfitInfo}>
        <Text style={styles.outfitName}>{outfit.name}</Text>
        <Text style={styles.outfitWebsite}>{outfit.websiteName || 'Unknown Store'}</Text>
        {outfit.price && <Text style={styles.outfitPrice}>{outfit.price}</Text>}
        {outfit.notes && <Text style={styles.outfitNotes}>{outfit.notes}</Text>}
        <View style={styles.outfitActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOpenWebsite(outfit.websiteUrl)}
          >
            <IconSymbol
              ios_icon_name="link"
              android_material_icon_name="link"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveOutfit(outfit.id, outfit.name)}
          >
            <IconSymbol
              ios_icon_name="delete"
              android_material_icon_name="delete"
              size={20}
              color={colors.error}
            />
            <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wardrobe</Text>
        <Text style={styles.subtitle}>Virtual try-on outfits from your favorite stores</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {!showAddForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
            <IconSymbol
              ios_icon_name="add"
              android_material_icon_name="add"
              size={24}
              color={colors.milkyWay}
            />
            <Text style={styles.addButtonText}>Add Outfit</Text>
          </TouchableOpacity>
        )}

        {showAddForm && (
          <View style={styles.addForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add New Outfit</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <IconSymbol
                  ios_icon_name="close"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Outfit Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={formData.imageUrl}
              onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Website URL"
              value={formData.websiteUrl}
              onChangeText={(text) => setFormData({ ...formData, websiteUrl: text })}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Store Name (e.g., Zara, H&M)"
              value={formData.websiteName}
              onChangeText={(text) => setFormData({ ...formData, websiteName: text })}
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              style={styles.input}
              placeholder="Price (optional)"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes (optional)"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddOutfit}>
              <Text style={styles.submitButtonText}>Save Outfit</Text>
            </TouchableOpacity>
          </View>
        )}

        {outfits.length === 0 && !showAddForm && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="shopping-bag"
              android_material_icon_name="shopping-bag"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateText}>No outfits saved yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add outfits from your favorite websites to see how they look on you
            </Text>
          </View>
        )}

        {outfits.map(renderOutfitCard)}
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
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.milkyWay,
  },
  addForm: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.milkyWay,
  },
  outfitCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  outfitImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  outfitInfo: {
    padding: 16,
  },
  outfitName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  outfitWebsite: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  outfitPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  outfitNotes: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  outfitActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  removeButton: {
    borderColor: colors.error,
  },
  removeButtonText: {
    color: colors.error,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
