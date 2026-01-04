
import React from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface AvatarPreviewProps {
  avatarUri: string | null;
  isGenerating?: boolean;
  width?: number;
  height?: number;
  showBackgroundInfo?: boolean;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  avatarUri,
  isGenerating = false,
  width = 200,
  height = 300,
  showBackgroundInfo = true,
}) => {
  if (isGenerating) {
    return (
      <View style={[styles.container, { width, height }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Removing background...</Text>
        <Text style={styles.loadingSubtext}>Generating AI avatar</Text>
      </View>
    );
  }

  if (!avatarUri) {
    return (
      <View style={[styles.container, styles.placeholder, { width, height }]}>
        <IconSymbol 
          ios_icon_name="person.crop.circle.badge.plus" 
          android_material_icon_name="person-add" 
          size={48} 
          color={colors.textSecondary} 
        />
        <Text style={styles.placeholderText}>No Avatar Generated</Text>
        <Text style={styles.placeholderSubtext}>Upload a photo to create your AI avatar</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Image 
        source={{ uri: avatarUri }} 
        style={styles.avatar} 
        resizeMode="contain" 
      />
      {showBackgroundInfo && (
        <View style={styles.infoLabel}>
          <IconSymbol 
            ios_icon_name="checkmark.circle.fill" 
            android_material_icon_name="check-circle" 
            size={16} 
            color={colors.galaxy} 
          />
          <Text style={styles.infoLabelText}>Background Removed</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  placeholder: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    gap: 12,
  },
  placeholderText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderSubtext: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
  },
  infoLabel: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.galaxy,
  },
  infoLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.galaxy,
  },
});
