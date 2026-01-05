
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';

interface ErvenistaBrandingProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  variant?: 'default' | 'gradient' | 'minimal';
}

export function ErvenistaBranding({ 
  size = 'medium', 
  showTagline = false,
  variant = 'default' 
}: ErvenistaBrandingProps) {
  const sizeStyles = {
    small: { fontSize: 20, taglineSize: 10 },
    medium: { fontSize: 32, taglineSize: 12 },
    large: { fontSize: 48, taglineSize: 14 },
  };

  const currentSize = sizeStyles[size];

  if (variant === 'gradient') {
    return (
      <View style={styles.container}>
        <View
          style={[styles.gradientContainer, { backgroundColor: colors.secondary }]}
        >
          <Text style={[styles.logoText, { fontSize: currentSize.fontSize }]}>
            Ervenista
          </Text>
        </View>
        {showTagline && (
          <Text style={[styles.tagline, { fontSize: currentSize.taglineSize }]}>
            Your Perfect Fit, Virtually
          </Text>
        )}
      </View>
    );
  }

  if (variant === 'minimal') {
    return (
      <View style={styles.container}>
        <Text style={[styles.logoTextMinimal, { fontSize: currentSize.fontSize }]}>
          E
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.logoText, { fontSize: currentSize.fontSize, color: colors.secondary }]}>
        Ervenista
      </Text>
      {showTagline && (
        <Text style={[styles.tagline, { fontSize: currentSize.taglineSize }]}>
          Your Perfect Fit, Virtually
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '800',
    letterSpacing: -1,
    color: '#FFFFFF',
  },
  logoTextMinimal: {
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: -2,
  },
  gradientContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  tagline: {
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
