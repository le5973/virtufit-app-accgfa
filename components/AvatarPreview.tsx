
import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface AvatarPreviewProps {
  avatarUri: string | null;
  onRetake?: () => void;
  size?: 'small' | 'medium' | 'large';
  showPodium?: boolean;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  avatarUri,
  onRetake,
  size = 'large',
  showPodium = true,
}) => {
  const sizeStyles = {
    small: { width: 120, height: 160 },
    medium: { width: 200, height: 280 },
    large: { width: 280, height: 400 },
  };

  if (!avatarUri) {
    return (
      <View style={[styles.placeholder, sizeStyles[size]]}>
        <IconSymbol name="person.fill" size={60} color={colors.textMuted} />
        <Text style={styles.placeholderText}>No Avatar Generated</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showPodium && <View style={styles.podium} />}
      <View style={[styles.avatarContainer, sizeStyles[size]]}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>
      {onRetake && (
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <IconSymbol name="camera.fill" size={20} color={colors.primary} />
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.textMuted,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
  podium: {
    position: 'absolute',
    bottom: -20,
    width: 200,
    height: 40,
    backgroundColor: colors.accent,
    borderRadius: 8,
    opacity: 0.3,
    zIndex: -1,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  retakeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
