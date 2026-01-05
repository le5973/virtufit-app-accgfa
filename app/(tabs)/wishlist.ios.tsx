
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
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { WishlistItem } from '@/types/bodyMeasurements';
import { useWishlist } from '@/hooks/useWishlist';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';
import { useVirtualTryOn } from '@/hooks/useVirtualTryOn';

export default function WishlistScreen() {
  const { items, addItem, removeItem, togglePublic, updateItem } = useWishlist();
  const { avatar } = useAvatarStorage();
  const { tryOnClothing, isProcessing } = useVirtualTryOn();
  const [showAddForm, setShowAddForm] = useState(false);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    imageUrl: '',
    websiteUrl: '',
    websiteName: '',
    price: '',
    notes: '',
    isPublic: true,
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.websiteUrl) {
      Alert.alert('Missing Information', 'Please fill in at least name and website URL');
      return;
    }

    addItem({
      name: newItem.name,
      imageUrl: newItem.imageUrl,
      websiteUrl: newItem.websiteUrl,
      websiteName: newItem.websiteName || new URL(newItem.websiteUrl).hostname,
      price: newItem.price,
      notes: newItem.notes,
      isPublic: newItem.isPublic,
    });

    setNewItem({
      name: '',
      imageUrl: '',
      websiteUrl: '',
      websiteName: '',
      price: '',
      notes: '',
      isPublic: true,
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Item added to your wishlist!');
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeItem(id),
        },
      ]
    );
  };

  const handleTogglePublic = (id: string) => {
    togglePublic(id);
  };

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open website');
    });
  };

  const handleShareWishlist = async () => {
    const publicItems = items.filter(item => item.isPublic);
    if (publicItems.length === 0) {
      Alert.alert('No Public Items', 'Make some items public to share your wishlist');
      return;
    }

    const message = `Check out my Ervenista wishlist!\n\n${publicItems
      .map(item => `${item.name} - ${item.websiteName}${item.price ? ` (${item.price})` : ''}`)
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

  const handleTryOnItem = async (item: WishlistItem) => {
    if (!avatar?.imageUri) {
      Alert.alert('No Avatar', 'Please create your AI avatar first to use virtual try-on');
      return;
    }

    setProcessingItemId(item.id);
    
    try {
      // TODO: Backend Integration - Call the /api/virtual-tryon endpoint
      // This endpoint will:
      // 1. Accept the avatar image URI and clothing product URL
      // 2. Use GPT-5.2 vision to analyze the clothing item from the URL
      // 3. Generate a realistic overlay of the clothing on the avatar
      // 4. Return the composite image URL showing the product on your avatar
      
      const result = await tryOnClothing(avatar.imageUri, item.websiteUrl);
      
      if (result?.imageUrl) {
        // Update the item with the try-on image
        updateItem(item.id, { tryOnImageUrl: result.imageUrl });
        Alert.alert('Success!', 'Virtual try-on complete! The product is now displayed on your avatar.');
      }
    } catch (error) {
      console.error('Try-on error:', error);
      Alert.alert('Error', 'Failed to generate virtual try-on. Please try again.');
    } finally {
      setProcessingItemId(null);
    }
  };

  const publicCount = items.filter(item => item.isPublic).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <Text style={styles.subtitle}>
          Save items you want and share with friends
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareWishlist}>
          <IconSymbol
            ios_icon_name="share"
            android_material_icon_name="share"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.shareButtonText}>
            Share Public Items ({publicCount})
          </Text>
        </TouchableOpacity>
      </View>

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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <IconSymbol
            ios_icon_name="add"
            android_material_icon_name="add"
            size={24}
            color={colors.milkyWay}
          />
          <Text style={styles.addButtonText}>Add to Wishlist</Text>
        </TouchableOpacity>

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL (optional)"
              value={newItem.imageUrl}
              onChangeText={(text) => setNewItem({ ...newItem, imageUrl: text })}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Website URL"
              value={newItem.websiteUrl}
              onChangeText={(text) => setNewItem({ ...newItem, websiteUrl: text })}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Website Name"
              value={newItem.websiteName}
              onChangeText={(text) => setNewItem({ ...newItem, websiteName: text })}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Price (optional)"
              value={newItem.price}
              onChangeText={(text) => setNewItem({ ...newItem, price: text })}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes (optional)"
              value={newItem.notes}
              onChangeText={(text) => setNewItem({ ...newItem, notes: text })}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
            <View style={styles.publicToggle}>
              <Text style={styles.publicLabel}>Make this item public</Text>
              <Switch
                value={newItem.isPublic}
                onValueChange={(value) => setNewItem({ ...newItem, isPublic: value })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.milkyWay}
              />
            </View>
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddItem}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="favorite-border"
              android_material_icon_name="favorite_border"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Add items you want and share with friends
            </Text>
          </View>
        ) : (
          <View style={styles.itemsGrid}>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <View style={styles.itemCard}>
                  {/* Try-On Image Display */}
                  {item.tryOnImageUrl ? (
                    <View style={styles.tryOnImageContainer}>
                      <Image 
                        source={{ uri: item.tryOnImageUrl }} 
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
                  ) : item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  ) : avatar ? (
                    <View style={styles.placeholderContainer}>
                      <IconSymbol 
                        ios_icon_name="sparkles"
                        android_material_icon_name="auto_awesome" 
                        size={48} 
                        color={colors.grey} 
                      />
                      <Text style={styles.placeholderText}>Tap &quot;Try On&quot; to see this on your avatar</Text>
                    </View>
                  ) : (
                    <View style={styles.noImagePlaceholder}>
                      <IconSymbol
                        ios_icon_name="photo"
                        android_material_icon_name="image"
                        size={48}
                        color={colors.grey}
                      />
                    </View>
                  )}

                  <View style={styles.itemInfo}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.isPublic && (
                        <View style={styles.publicBadge}>
                          <Text style={styles.publicBadgeText}>Public</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.itemWebsite}>{item.websiteName}</Text>
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
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={styles.actionButtonText}>View</Text>
                      </TouchableOpacity>

                      {avatar && (
                        <TouchableOpacity
                          style={[
                            styles.tryOnButton,
                            (isProcessing && processingItemId === item.id) && styles.buttonDisabled
                          ]}
                          onPress={() => handleTryOnItem(item)}
                          disabled={isProcessing && processingItemId === item.id}
                        >
                          {isProcessing && processingItemId === item.id ? (
                            <>
                              <ActivityIndicator size="small" color={colors.primary} />
                              <Text style={styles.tryOnButtonText}>Processing...</Text>
                            </>
                          ) : (
                            <>
                              <IconSymbol
                                ios_icon_name="sparkles"
                                android_material_icon_name="auto_awesome"
                                size={20}
                                color={colors.primary}
                              />
                              <Text style={styles.tryOnButtonText}>
                                {item.tryOnImageUrl ? 'Refresh' : 'Try On'}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleTogglePublic(item.id)}
                      >
                        <IconSymbol
                          ios_icon_name={item.isPublic ? 'lock.open' : 'lock'}
                          android_material_icon_name={item.isPublic ? 'lock_open' : 'lock'}
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={styles.actionButtonText}>
                          {item.isPublic ? 'Public' : 'Private'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteItem(item.id)}
                      >
                        <IconSymbol
                          ios_icon_name="trash"
                          android_material_icon_name="delete"
                          size={20}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  noAvatarBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  noAvatarText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
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
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  publicLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.milkyWay,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  itemsGrid: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tryOnImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.background,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 20,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.grey,
    textAlign: 'center',
  },
  itemImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  noImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemInfo: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  publicBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  publicBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.milkyWay,
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
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  itemActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tryOnButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
