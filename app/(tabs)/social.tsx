
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { useFriends } from '@/hooks/useFriends';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';
import { LinearGradient } from 'expo-linear-gradient';

export default function SocialScreen() {
  const { friends, friendRequests, searchUsers, sendFriendRequest, acceptRequest, loading, refreshFriends } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a username or email to search');
      return;
    }
    // TODO: Backend Integration - Search for users by username or email
    console.log('Searching for users:', searchQuery);
    const results = await searchUsers(searchQuery);
    setSearchResults(results);
  };

  const handleSendRequest = async (userId: string) => {
    try {
      // TODO: Backend Integration - Send friend request to user
      await sendFriendRequest(userId);
      Alert.alert('Success', 'Friend request sent!');
    } catch (error) {
      console.log('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // TODO: Backend Integration - Accept friend request
      await acceptRequest(requestId);
      Alert.alert('Success', 'Friend request accepted!');
    } catch (error) {
      console.log('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  const handleViewWishlist = (friendId: string, friendName: string) => {
    // TODO: Backend Integration - Navigate to friend's public wishlist
    console.log('Viewing wishlist for:', friendId);
    Alert.alert('Coming Soon', `View ${friendName}'s public wishlist`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFriends();
    setRefreshing(false);
  };

  const renderFriendCard = (friend: any) => (
    <View key={friend.id} style={[styles.friendCard, shadows.small]}>
      <View style={styles.friendAvatar}>
        {friend.image ? (
          <Image source={{ uri: friend.image }} style={styles.avatarImage} />
        ) : (
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.avatarGradient}
          >
            <IconSymbol android_material_icon_name="person" size={28} color="#FFFFFF" />
          </LinearGradient>
        )}
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.name || 'Anonymous'}</Text>
        <Text style={styles.friendEmail}>{friend.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewWishlistButton}
        onPress={() => handleViewWishlist(friend.id, friend.name)}
      >
        <IconSymbol android_material_icon_name="list" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderRequestCard = (request: any) => (
    <View key={request.id} style={[styles.requestCard, shadows.small]}>
      <View style={styles.friendAvatar}>
        {request.fromUser?.image ? (
          <Image source={{ uri: request.fromUser.image }} style={styles.avatarImage} />
        ) : (
          <LinearGradient
            colors={[colors.secondary, colors.primary]}
            style={styles.avatarGradient}
          >
            <IconSymbol android_material_icon_name="person" size={28} color="#FFFFFF" />
          </LinearGradient>
        )}
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{request.fromUser?.name || 'Anonymous'}</Text>
        <Text style={styles.friendEmail}>{request.fromUser?.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptRequest(request.id)}
      >
        <IconSymbol android_material_icon_name="check" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderSearchResult = (user: any) => (
    <View key={user.id} style={[styles.searchResultCard, shadows.small]}>
      <View style={styles.friendAvatar}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.avatarImage} />
        ) : (
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            style={styles.avatarGradient}
          >
            <IconSymbol android_material_icon_name="person" size={28} color="#FFFFFF" />
          </LinearGradient>
        )}
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{user.name || 'Anonymous'}</Text>
        <Text style={styles.friendEmail}>{user.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleSendRequest(user.id)}
      >
        <IconSymbol android_material_icon_name="person_add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ErvenistaBranding size="small" variant="minimal" />
        <Text style={styles.title}>Social</Text>
        <Text style={styles.subtitle}>Connect with friends and share wishlists</Text>
      </View>

      <View style={[styles.tabBar, shadows.small]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends
          </Text>
          {friends.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friends.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests
          </Text>
          {friendRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friendRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'friends' && (
          <View>
            {friends.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol android_material_icon_name="group" size={64} color={colors.textLight} />
                <Text style={styles.emptyText}>No friends yet</Text>
                <Text style={styles.emptySubtext}>Search for users to add friends</Text>
              </View>
            ) : (
              <React.Fragment>
                {friends.map(renderFriendCard)}
              </React.Fragment>
            )}
          </View>
        )}

        {activeTab === 'requests' && (
          <View>
            {friendRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol android_material_icon_name="mail" size={64} color={colors.textLight} />
                <Text style={styles.emptyText}>No pending requests</Text>
              </View>
            ) : (
              <React.Fragment>
                {friendRequests.map(renderRequestCard)}
              </React.Fragment>
            )}
          </View>
        )}

        {activeTab === 'search' && (
          <View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by username or email"
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <IconSymbol android_material_icon_name="search" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol android_material_icon_name="search" size={64} color={colors.textLight} />
                <Text style={styles.emptyText}>Search for friends</Text>
                <Text style={styles.emptySubtext}>Enter a username or email to find users</Text>
              </View>
            ) : (
              <React.Fragment>
                {searchResults.map(renderSearchResult)}
              </React.Fragment>
            )}
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
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  viewWishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  acceptButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
});
