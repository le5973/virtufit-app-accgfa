
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { WishlistItem } from '@/types/bodyMeasurements';

export default function WishlistScreen() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'Designer Handbag',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      websiteUrl: 'https://example.com',
      websiteName: 'Luxury Store',
      price: '$299.99',
      dateAdded: new Date().toISOString(),
      notes: 'Birthday wishlist item',
      isPublic: true,
    },
    {
      id: '2',
      name: 'Running Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      websiteUrl: 'https://example.com',
      websiteName: 'Sports Shop',
      price: '$129.99',
      dateAdded: new Date().toISOString(),
      notes: 'For marathon training',
      isPublic: false,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
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
    if (!newItem.name || !newItem.imageUrl || !newItem.websiteUrl) {
      Alert.alert('Missing Information', 'Please fill in at least name, image URL, and website URL');
      return;
    }

    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name,
      imageUrl: newItem.imageUrl,
      websiteUrl: newItem.websiteUrl,
      websiteName: newItem.websiteName || 'Unknown Store',
      price: newItem.price,
      dateAdded: new Date().toISOString(),
      notes: newItem.notes,
      isPublic: newItem.isPublic,
    };

    setWishlistItems([item, ...wishlistItems]);
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
          onPress: () => setWishlistItems(wishlistItems.filter(i => i.id !== id)),
        },
      ]
    );
  };

  const handleTogglePublic = (id: string) => {
    setWishlistItems(
      wishlistItems.map(item =>
        item.id === id ? { ...item, isPublic: !item.isPublic } : item
      )
    );
  };

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open website');
    });
  };

  const handleShareWishlist = async () => {
    const publicItems = wishlistItems.filter(item => item.isPublic);
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

  const publicCount = wishlistItems.filter(item => item.isPublic).length;

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
              placeholder="Image URL"
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

        {wishlistItems.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="favorite-border"
              android_material_icon_name="favorite-border"
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
            {wishlistItems.map((item) => (
              <React.Fragment key={item.id}>
                <View style={styles.itemCard}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
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
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleTogglePublic(item.id)}
                      >
                        <IconSymbol
                          ios_icon_name={item.isPublic ? 'lock-open' : 'lock'}
                          android_material_icon_name={item.isPublic ? 'lock-open' : 'lock'}
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
                          ios_icon_name="delete"
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
  itemImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
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
});
