
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
import { useAvatarGeneration } from '@/hooks/useAvatarGeneration';
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { WishlistItem } from '@/types/bodyMeasurements';

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
      imageUrl: '', // Will be extracted by backend
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

      const message = `Check out my wishlist:\n\n${publicItems.map(item => 
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
    <View key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
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
              ios_icon_name={item.isPublic ? 'eye' : 'eye.slash'}
              android_material_icon_name={item.isPublic ? 'visibility' : 'visibility-off'}
              size={20}
              color={item.isPublic ? colors.galaxy : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemoveItem(item.id, item.name)}
            style={styles.iconButton}
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

      <TouchableOpacity
        style={styles.websiteButton}
        onPress={() => handleOpenWebsite(item.websiteUrl)}
      >
        <IconSymbol
          ios_icon_name="link"
          android_material_icon_name="link"
          size={16}
          color={colors.primary}
        />
        <Text style={styles.websiteButtonText}>View Product</Text>
      </TouchableOpacity>

      {avatarUri && (
        <TouchableOpacity
          style={styles.tryOnButton}
          onPress={() => setSelectedItemForTryOn(item)}
        >
          <IconSymbol
            ios_icon_name="sparkles"
            android_material_icon_name="auto-awesome"
            size={16}
            color="#fff"
          />
          <Text style={styles.tryOnButtonText}>Virtual Try-On</Text>
        </TouchableOpacity>
      )}

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
        <Text style={styles.title}>Wishlist</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleShareWishlist} style={styles.shareButton}>
            <IconSymbol
              ios_icon_name="square.and.arrow.up"
              android_material_icon_name="share"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {!avatarUri && (
        <View style={styles.noAvatarBanner}>
          <IconSymbol
            ios_icon_name="info.circle"
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.noAvatarText}>
            Create your AI avatar in the Home tab to enable virtual try-on
          </Text>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add New Item</Text>
          <TextInput
            style={styles.input}
            placeholder="Product name"
            value={newItemName}
            onChangeText={setNewItemName}
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Product URL"
            value={newItemUrl}
            onChangeText={setNewItemUrl}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="url"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add-circle"
              size={20}
              color="#fff"
            />
            <Text style={styles.addButtonText}>Add to Wishlist</Text>
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="heart"
              android_material_icon_name="favorite-border"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateText}>Your wishlist is empty</Text>
            <Text style={styles.emptyStateSubtext}>
              Add items you&apos;re interested in and try them on with your AI avatar
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            <Text style={styles.sectionTitle}>Your Items ({items.length})</Text>
            {items.map(renderWishlistItem)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
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
    paddingBottom: 120,
  },
  addSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
    gap: 16,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 12,
    gap: 6,
    marginBottom: 8,
  },
  websiteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  tryOnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  tryOnButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
