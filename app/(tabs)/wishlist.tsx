
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
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useWishlist } from '@/hooks/useWishlist';
import { WishlistItem } from '@/types/bodyMeasurements';

export default function WishlistScreen() {
  const { items, loading, addItem, removeItem, togglePublic, getPublicItems } = useWishlist();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    websiteUrl: '',
    websiteName: '',
    price: '',
    notes: '',
    isPublic: false,
  });

  const handleAddItem = async () => {
    if (!formData.name || !formData.imageUrl || !formData.websiteUrl) {
      Alert.alert('Missing Information', 'Please fill in name, image URL, and website URL');
      return;
    }

    try {
      await addItem(formData);
      setFormData({
        name: '',
        imageUrl: '',
        websiteUrl: '',
        websiteName: '',
        price: '',
        notes: '',
        isPublic: false,
      });
      setShowAddForm(false);
      Alert.alert('Success', 'Item added to your wishlist!');
    } catch (error) {
      console.log('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Remove "${name}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeItem(id);
            } catch (error) {
              console.log('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item');
            }
          },
        },
      ]
    );
  };

  const handleTogglePublic = async (id: string, currentStatus: boolean) => {
    try {
      await togglePublic(id);
      Alert.alert(
        'Success',
        currentStatus ? 'Item is now private' : 'Item is now public and can be shared with friends'
      );
    } catch (error) {
      console.log('Error toggling public:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleShareWishlist = async () => {
    const publicItems = getPublicItems();
    if (publicItems.length === 0) {
      Alert.alert('No Public Items', 'Mark some items as public to share your wishlist');
      return;
    }

    const message = `Check out my Ervenista wishlist!\n\n${publicItems
      .map((item, index) => `${index + 1}. ${item.name} - ${item.websiteName || 'Unknown Store'}`)
      .join('\n')}`;

    try {
      await Share.share({
        message,
        title: 'My Ervenista Wishlist',
      });
    } catch (error) {
      console.log('Error sharing wishlist:', error);
    }
  };

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.log('Error opening URL:', err);
      Alert.alert('Error', 'Could not open website');
    });
  };

  const renderWishlistItem = (item: WishlistItem) => (
    <View key={item.id} style={styles.itemCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.isPublic && (
            <View style={styles.publicBadge}>
              <IconSymbol
                ios_icon_name="lock-open"
                android_material_icon_name="lock-open"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.publicBadgeText}>Public</Text>
            </View>
          )}
        </View>
        <Text style={styles.itemWebsite}>{item.websiteName || 'Unknown Store'}</Text>
        {item.price && <Text style={styles.itemPrice}>{item.price}</Text>}
        {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOpenWebsite(item.websiteUrl)}
          >
            <IconSymbol
              ios_icon_name="link"
              android_material_icon_name="link"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, item.isPublic && styles.publicButton]}
            onPress={() => handleTogglePublic(item.id, item.isPublic)}
          >
            <IconSymbol
              ios_icon_name={item.isPublic ? 'lock-open' : 'lock'}
              android_material_icon_name={item.isPublic ? 'lock-open' : 'lock'}
              size={18}
              color={item.isPublic ? colors.textSecondary : colors.primary}
            />
            <Text style={[styles.actionButtonText, item.isPublic && styles.publicButtonText]}>
              {item.isPublic ? 'Make Private' : 'Make Public'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveItem(item.id, item.name)}
          >
            <IconSymbol
              ios_icon_name="delete"
              android_material_icon_name="delete"
              size={18}
              color={colors.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>My Wishlist</Text>
            <Text style={styles.subtitle}>Share your favorite items with friends</Text>
          </View>
          {items.length > 0 && (
            <TouchableOpacity style={styles.shareButton} onPress={handleShareWishlist}>
              <IconSymbol
                ios_icon_name="share"
                android_material_icon_name="share"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
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
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        )}

        {showAddForm && (
          <View style={styles.addForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add to Wishlist</Text>
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
              placeholder="Item Name"
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

            <TouchableOpacity
              style={styles.publicToggle}
              onPress={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
            >
              <View style={styles.publicToggleLeft}>
                <IconSymbol
                  ios_icon_name={formData.isPublic ? 'lock-open' : 'lock'}
                  android_material_icon_name={formData.isPublic ? 'lock-open' : 'lock'}
                  size={20}
                  color={formData.isPublic ? colors.primary : colors.textSecondary}
                />
                <Text style={styles.publicToggleText}>Make Public</Text>
              </View>
              <View
                style={[
                  styles.toggleSwitch,
                  formData.isPublic && styles.toggleSwitchActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    formData.isPublic && styles.toggleKnobActive,
                  ]}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleAddItem}>
              <Text style={styles.submitButtonText}>Add to Wishlist</Text>
            </TouchableOpacity>
          </View>
        )}

        {items.length === 0 && !showAddForm && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="favorite-border"
              android_material_icon_name="favorite-border"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateText}>Your wishlist is empty</Text>
            <Text style={styles.emptyStateSubtext}>
              Add items you love and share them with friends
            </Text>
          </View>
        )}

        {items.map(renderWishlistItem)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  shareButton: {
    padding: 8,
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
  publicToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  publicToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  publicToggleText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: colors.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.milkyWay,
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
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
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    marginLeft: 8,
  },
  publicBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  itemWebsite: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  itemNotes: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
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
  publicButton: {
    borderColor: colors.textSecondary,
  },
  publicButtonText: {
    color: colors.textSecondary,
  },
  removeButton: {
    flex: 0,
    paddingHorizontal: 12,
    borderColor: colors.error,
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
