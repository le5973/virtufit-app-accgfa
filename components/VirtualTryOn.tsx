
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAvatarGeneration } from '@/hooks/useAvatarGeneration';

interface VirtualTryOnProps {
  clothingImageUrl: string;
  clothingName: string;
  onTryOnComplete?: (tryOnImageUrl: string) => void;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  clothingImageUrl,
  clothingName,
  onTryOnComplete,
}) => {
  const [showTryOn, setShowTryOn] = useState(false);
  const [tryOnImageUrl, setTryOnImageUrl] = useState<string | null>(null);
  const { avatarData, generateTryOn, loading } = useAvatarGeneration();

  const handleTryOn = async () => {
    if (!avatarData) {
      Alert.alert(
        'No Avatar Found',
        'Please create your AI avatar first on the home screen to use virtual try-on',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await generateTryOn(clothingImageUrl);
    if (result) {
      setTryOnImageUrl(result);
      setShowTryOn(true);
      onTryOnComplete?.(result);
    }
  };

  if (!showTryOn) {
    return (
      <TouchableOpacity
        style={styles.tryOnButton}
        onPress={handleTryOn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <IconSymbol
              ios_icon_name="auto-awesome"
              android_material_icon_name="auto-awesome"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.tryOnButtonText}>Try On Avatar</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.tryOnContainer}>
      <View style={styles.tryOnHeader}>
        <View style={styles.tryOnHeaderLeft}>
          <IconSymbol
            ios_icon_name="auto-awesome"
            android_material_icon_name="auto-awesome"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.tryOnTitle}>Virtual Try-On</Text>
        </View>
        <TouchableOpacity onPress={() => setShowTryOn(false)}>
          <IconSymbol
            ios_icon_name="close"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.comparisonContainer}>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Your Avatar</Text>
          <Image
            source={{ uri: avatarData?.avatarUrl }}
            style={styles.comparisonImage}
          />
        </View>

        <View style={styles.plusIcon}>
          <IconSymbol
            ios_icon_name="add"
            android_material_icon_name="add"
            size={24}
            color={colors.textSecondary}
          />
        </View>

        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>{clothingName}</Text>
          <Image
            source={{ uri: clothingImageUrl }}
            style={styles.comparisonImage}
          />
        </View>
      </View>

      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <IconSymbol
            ios_icon_name="check-circle"
            android_material_icon_name="check-circle"
            size={20}
            color={colors.galaxy}
          />
          <Text style={styles.resultTitle}>Try-On Result</Text>
        </View>
        <Image
          source={{ uri: tryOnImageUrl || clothingImageUrl }}
          style={styles.resultImage}
        />
        <View style={styles.aiLabel}>
          <IconSymbol
            ios_icon_name="auto-awesome"
            android_material_icon_name="auto-awesome"
            size={16}
            color={colors.milkyWay}
          />
          <Text style={styles.aiLabelText}>AI Generated</Text>
        </View>
      </View>

      <Text style={styles.disclaimer}>
        This is a preview based on your avatar&apos;s measurements. Actual fit may vary.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tryOnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  tryOnButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  tryOnContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tryOnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tryOnHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tryOnTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  comparisonImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  plusIcon: {
    marginHorizontal: 8,
  },
  resultContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.background,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  resultImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    resizeMode: 'cover',
  },
  aiLabel: {
    position: 'absolute',
    top: 60,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  aiLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.milkyWay,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
