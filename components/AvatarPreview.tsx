
import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface AvatarPreviewProps {
  avatarUrl?: string;
  loading?: boolean;
}

export function AvatarPreview({ avatarUrl, loading }: AvatarPreviewProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/078cbbf7-0f64-4353-b98b-a72c26367678.png')}
        style={styles.podiumBackground}
        resizeMode="cover"
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Generating Avatar...</Text>
          </View>
        ) : avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Upload photos to generate your AI avatar</Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  podiumBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '60%',
    height: '70%',
    marginBottom: '15%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
});
