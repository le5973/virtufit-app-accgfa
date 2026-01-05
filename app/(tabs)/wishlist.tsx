
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useWishlist } from '@/hooks/useWishlist';
import { useAvatarGeneration } from '@/hooks/useAvatarGeneration';
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { WishlistItem } from '@/types/bodyMeasurements';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';

export default function WishlistScreen() {
  const { items, addItem, removeItem, togglePublic } = useWishlist();
  const { avatarUri } = useAvatarGeneration();
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [selectedItemForTryOn, setSelectedItemForTryOn] = useState<WishlistItem | null>(null);

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
      `Remove "${name}" from wishlist?`,
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

  const renderWishlistItem = (item: WishlistItem) => (
    <View key={item.id} style={[styles.itemCard, shadows.small]}>
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

        {avatarUri && (
          <TouchableOpacity
            style={[buttonStyles.primary, styles.actionButton]}
            onPress={() => setSelectedItemForTryOn(item)}
          >
            <IconSymbol
              android_material_icon_name="auto_awesome"
              size={16}
              color="#FFFFFF"
            />
            <Text style={[buttonStyles.primaryText, styles.actionButtonText]}>Try On</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedItemForTryOn?.id === item.id && avatarUri && (
        <VirtualTryOn
          avatarUri={avatarUri}
          clothingImageUrl={item.imageUrl || item.websiteUrl}
          clothingName={item.name}
          onTryOnComplete={(tryOnImageUrl) => {
            console.log('Try-on complete:', tryOnImageUrl);
            Alert.alert('Success!', 'Virtual try-on complete! Check the result above.');
          }}
        />
      )}
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

      {!avatarUri && (
        <View style={[styles.noAvatarBanner, shadows.small]}>
          <IconSymbol
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.noAvatarText}>
            Create your AI avatar to enable virtual try-on
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
              Add items you&apos;re interested in and try them on with your AI avatar
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
});
