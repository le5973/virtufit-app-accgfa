
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Share,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useWishlist } from '@/hooks/useWishlist';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';
import { useVirtualTryOn } from '@/hooks/useVirtualTryOn';
import { WishlistItem } from '@/types/bodyMeasurements';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';

export default function WishlistScreen() {
  const { items, addItem, removeItem, togglePublic, updateItem } = useWishlist();
  const { avatar } = useAvatarStorage();
  const { tryOnClothing, isProcessing } = useVirtualTryOn();
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Missing Name', 'Please enter a product name');
      return;
    }
    if (!newItemUrl.trim()) {
      Alert.alert('Missing URL', 'Please enter a product URL');
      return;
    }

    addItem({
      name: newItemName.trim(),
      websiteUrl: newItemUrl.trim(),
      imageUrl: '',
      websiteName: new URL(newItemUrl).hostname,
      price: '',
      isPublic: false,
    });

    setNewItemName('');
    setNewItemUrl('');
    Alert.alert('Success', 'Item added to wishlist!');
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      'Remove Item',
      `Remove "${name}" from wishlist`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeItem(id)
        }
      ]
    );
  };

  const handleTogglePublic = (id: string, currentStatus: boolean) => {
    togglePublic(id);
    Alert.alert(
      'Visibility Updated',
      currentStatus ? 'Item is now private' : 'Item is now public'
    );
  };

  const handleShareWishlist = async () => {
    try {
      const publicItems = items.filter(item => item.isPublic);
      if (publicItems.length === 0) {
        Alert.alert('No Public Items', 'Make some items public first to share your wishlist');
        return;
      }

      const message = `Check out my Ervenista wishlist:\n\n${publicItems.map(item => 
        `${item.name} - ${item.websiteUrl}`
      ).join('\n\n')}`;

      await Share.share({ message });
    } catch (err) {
      console.log('Error sharing wishlist:', err);
    }
  };

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open website');
    });
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
        Alert.alert('Success', 'Virtual try-on complete! The product is now displayed on your avatar.');
      }
    } catch (error) {
      console.error('Try-on error:', error);
      Alert.alert('Error', 'Failed to generate virtual try-on. Please try again.');
    } finally {
      setProcessingItemId(null);
    }
  };

  const renderWishlistItem = (item: WishlistItem) => (
    <View key={item.id} style={[styles.itemCard, shadows.small]}>
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

      <View style={styles.itemHeader}>
        <View style={styles.itemIconCircle}>
          <IconSymbol android_material_icon_name="favorite" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemWebsite}>{item.websiteName}</Text>
          {item.price && <Text style={styles.itemPrice}>{item.price}</Text>}
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            onPress={() => handleTogglePublic(item.id, item.isPublic)}
            style={styles.iconButton}
          >
            <IconSymbol
              android_material_icon_name={item.isPublic ? 'visibility' : 'visibility_off'}
              size={20}
              color={item.isPublic ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemoveItem(item.id, item.name)}
            style={styles.iconButton}
          >
            <IconSymbol
              android_material_icon_name="delete"
              size={20}
              color={colors.error}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[buttonStyles.outline, styles.actionButton]}
          onPress={() => handleOpenWebsite(item.websiteUrl)}
        >
          <IconSymbol
            android_material_icon_name="link"
            size={16}
            color={colors.primary}
          />
          <Text style={[buttonStyles.outlineText, styles.actionButtonText]}>View Product</Text>
        </TouchableOpacity>

        {avatar && (
          <TouchableOpacity
            style={[
              buttonStyles.primary, 
              styles.actionButton,
              (isProcessing && processingItemId === item.id) && styles.buttonDisabled
            ]}
            onPress={() => handleTryOnItem(item)}
            disabled={isProcessing && processingItemId === item.id}
          >
            {isProcessing && processingItemId === item.id ? (
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
                  {item.tryOnImageUrl ? 'Refresh' : 'Try On'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ErvenistaBranding size="small" variant="minimal" />
          {items.length > 0 && (
            <TouchableOpacity onPress={handleShareWishlist} style={styles.shareButton}>
              <IconSymbol
                android_material_icon_name="share"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>Wishlist</Text>
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.addSection, shadows.medium]}>
          <Text style={commonStyles.heading}>Add New Item</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Product name"
            value={newItemName}
            onChangeText={setNewItemName}
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={commonStyles.input}
            placeholder="Product URL"
            value={newItemUrl}
            onChangeText={setNewItemUrl}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="url"
          />
          <TouchableOpacity style={buttonStyles.primary} onPress={handleAddItem}>
            <View style={styles.buttonContent}>
              <IconSymbol
                android_material_icon_name="add_circle"
                size={20}
                color="#FFFFFF"
              />
              <Text style={buttonStyles.primaryText}>Add to Wishlist</Text>
            </View>
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              android_material_icon_name="favorite_border"
              size={64}
              color={colors.textLight}
            />
            <Text style={styles.emptyStateText}>Your wishlist is empty</Text>
            <Text style={styles.emptyStateSubtext}>
              Add items you are interested in and try them on with your AI avatar
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            <View style={commonStyles.sectionHeader}>
              <Text style={commonStyles.subtitle}>Your Items</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{items.length}</Text>
              </View>
            </View>
            <React.Fragment>
              {items.map(renderWishlistItem)}
            </React.Fragment>
          </View>
        )}

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
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  shareButton: {
    padding: 8,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  addSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  itemsList: {
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
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  itemWebsite: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 8,
  },
  buttonRow: {
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
