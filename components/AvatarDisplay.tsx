
import React from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';

interface AvatarDisplayProps {
  size?: 'small' | 'medium' | 'large';
  showMeasurements?: boolean;
}

export function AvatarDisplay({ size = 'medium', showMeasurements = false }: AvatarDisplayProps) {
  const { avatar, loading } = useAvatarStorage();

  const sizeStyles = {
    small: { width: 80, height: 120 },
    medium: { width: 150, height: 225 },
    large: { width: 200, height: 300 },
  };

  if (loading) {
    return (
      <View style={[styles.container, sizeStyles[size]]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!avatar) {
    return (
      <View style={[styles.container, styles.placeholder, sizeStyles[size]]}>
        <Text style={styles.placeholderText}>No Avatar</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Image 
        source={{ uri: avatar.imageUri }} 
        style={[styles.avatar, sizeStyles[size]]}
        resizeMode="contain"
      />
      {showMeasurements && (
        <View style={styles.measurements}>
          <Text style={styles.measurementText}>
            H: {avatar.measurements.height} | W: {avatar.measurements.weight}
          </Text>
          <Text style={styles.measurementText}>
            B: {avatar.measurements.bust} | Wa: {avatar.measurements.waist} | H: {avatar.measurements.hip}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
  },
  placeholder: {
    borderWidth: 2,
    borderColor: colors.grey,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.grey,
    fontSize: 14,
  },
  avatar: {
    borderRadius: 12,
  },
  measurements: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  measurementText: {
    color: colors.text,
    fontSize: 12,
    textAlign: 'center',
  },
});
