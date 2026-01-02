
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ervenista_friends';
const REQUESTS_KEY = '@ervenista_friend_requests';

interface Friend {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface FriendRequest {
  id: string;
  fromUser: Friend;
  status: 'pending' | 'accepted' | 'rejected';
}

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, []);

  const loadFriends = async () => {
    try {
      // TODO: Backend Integration - Fetch friends list from Supabase
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFriends(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      // TODO: Backend Integration - Fetch friend requests from Supabase
      const stored = await AsyncStorage.getItem(REQUESTS_KEY);
      if (stored) {
        setFriendRequests(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading friend requests:', error);
    }
  };

  const searchUsers = async (query: string): Promise<Friend[]> => {
    try {
      // TODO: Backend Integration - Search users in Supabase by username or email
      console.log('Searching users with query:', query);
      
      // Mock data for now
      return [
        {
          id: '1',
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
        {
          id: '2',
          name: 'John Smith',
          email: 'john@example.com',
        },
      ];
    } catch (error) {
      console.log('Error searching users:', error);
      return [];
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      // TODO: Backend Integration - Send friend request via Supabase
      console.log('Sending friend request to user:', userId);
      
      // Mock implementation
      const newRequest: FriendRequest = {
        id: Date.now().toString(),
        fromUser: {
          id: userId,
          name: 'New Friend',
          email: 'friend@example.com',
        },
        status: 'pending',
      };
      
      const updated = [...friendRequests, newRequest];
      await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
      setFriendRequests(updated);
    } catch (error) {
      console.log('Error sending friend request:', error);
      throw error;
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      // TODO: Backend Integration - Accept friend request in Supabase
      console.log('Accepting friend request:', requestId);
      
      const request = friendRequests.find(r => r.id === requestId);
      if (request) {
        // Add to friends
        const updatedFriends = [...friends, request.fromUser];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFriends));
        setFriends(updatedFriends);
        
        // Remove from requests
        const updatedRequests = friendRequests.filter(r => r.id !== requestId);
        await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));
        setFriendRequests(updatedRequests);
      }
    } catch (error) {
      console.log('Error accepting friend request:', error);
      throw error;
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      // TODO: Backend Integration - Remove friend from Supabase
      console.log('Removing friend:', friendId);
      
      const updated = friends.filter(f => f.id !== friendId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setFriends(updated);
    } catch (error) {
      console.log('Error removing friend:', error);
      throw error;
    }
  };

  const refreshFriends = async () => {
    await loadFriends();
    await loadRequests();
  };

  return {
    friends,
    friendRequests,
    loading,
    searchUsers,
    sendFriendRequest,
    acceptRequest,
    removeFriend,
    refreshFriends,
  };
};
