
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useVirtualTryOn } from '@/hooks/useVirtualTryOn';

interface VirtualTryOnProps {
  avatarUri: string;
  clothingImageUrl: string;
  clothingName: string;
  onTryOnComplete?: (tryOnImageUrl: string) => void;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  avatarUri,
  clothingImageUrl,
  clothingName,
  onTryOnComplete,
}) => {
  const { tryOnResult, isProcessing, error, tryOnClothing } = useVirtualTryOn();

  const handleTryOn = async () => {
    try {
      const result = await tryOnClothing(avatarUri, clothingImageUrl);
      if (result) {
        onTryOnComplete?.(result);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to try on clothing. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isProcessing && styles.buttonDisabled]}
        onPress={handleTryOn}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.buttonText}>Processing...</Text>
          </>
        ) : (
          <>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto-awesome" 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.buttonText}>Try On {clothingName}</Text>
          </>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle" 
            android_material_icon_name="warning" 
            size={20} 
            color={colors.error} 
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {tryOnResult && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.galaxy} 
            />
            <Text style={styles.resultTitle}>Try-On Result</Text>
          </View>
          <Image 
            source={{ uri: tryOnResult }} 
            style={styles.resultImage} 
            resizeMode="contain" 
          />
          <Text style={styles.resultSubtext}>
            AI-generated preview with clothing overlay
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  resultImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  resultSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
});
