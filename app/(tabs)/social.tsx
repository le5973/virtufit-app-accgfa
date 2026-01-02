
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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useFriends } from '@/hooks/useFriends';
import { GlassView } from 'expo-glass-effect';

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
    <GlassView key={friend.id} style={styles.friendCard} glassEffectStyle="regular">
      <View style={styles.friendAvatar}>
        {friend.image ? (
          <Image source={{ uri: friend.image }} style={styles.avatarImage} />
        ) : (
          <IconSymbol ios_icon_name="person.circle" android_material_icon_name="account-circle" size={40} color={colors.text} />
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
        <IconSymbol ios_icon_name="list.bullet" android_material_icon_name="list" size={20} color={colors.primary} />
      </TouchableOpacity>
    </GlassView>
  );

  const renderRequestCard = (request: any) => (
    <GlassView key={request.id} style={styles.requestCard} glassEffectStyle="regular">
      <View style={styles.friendAvatar}>
        {request.fromUser?.image ? (
          <Image source={{ uri: request.fromUser.image }} style={styles.avatarImage} />
        ) : (
          <IconSymbol ios_icon_name="person.circle" android_material_icon_name="account-circle" size={40} color={colors.text} />
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
        <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color="#fff" />
      </TouchableOpacity>
    </GlassView>
  );

  const renderSearchResult = (user: any) => (
    <GlassView key={user.id} style={styles.searchResultCard} glassEffectStyle="regular">
      <View style={styles.friendAvatar}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.avatarImage} />
        ) : (
          <IconSymbol ios_icon_name="person.circle" android_material_icon_name="account-circle" size={40} color={colors.text} />
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
        <IconSymbol ios_icon_name="person.badge.plus" android_material_icon_name="person-add" size={20} color="#fff" />
      </TouchableOpacity>
    </GlassView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
        <Text style={styles.subtitle}>Connect with friends and share wishlists</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends ({friends.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests ({friendRequests.length})
          </Text>
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
      >
        {activeTab === 'friends' && (
          <View>
            {friends.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol ios_icon_name="person.2" android_material_icon_name="group" size={60} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No friends yet</Text>
                <Text style={styles.emptySubtext}>Search for users to add friends</Text>
              </View>
            ) : (
              friends.map(renderFriendCard)
            )}
          </View>
        )}

        {activeTab === 'requests' && (
          <View>
            {friendRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol ios_icon_name="envelope" android_material_icon_name="mail" size={60} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No pending requests</Text>
              </View>
            ) : (
              friendRequests.map(renderRequestCard)
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
                <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={60} color={colors.textSecondary} />
                <Text style={styles.emptyText}>Search for friends</Text>
                <Text style={styles.emptySubtext}>Enter a username or email to find users</Text>
              </View>
            ) : (
              searchResults.map(renderSearchResult)
            )}
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
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.cardBackground,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.cardBackground,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.cardBackground,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
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
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.text,
    marginRight: 12,
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
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
