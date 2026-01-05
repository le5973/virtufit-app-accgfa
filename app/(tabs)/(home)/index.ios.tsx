
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, shadows } from '@/styles/commonStyles';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';
import { IconSymbol } from '@/components/IconSymbol';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';

export default function HomeScreen() {
  const router = useRouter();
  const { avatar, styleProfile } = useAvatarStorage();

  useEffect(() => {
    // If avatar exists but no style profile, redirect to questionnaire
    if (avatar && !styleProfile) {
      router.push('/(tabs)/(home)/style-questionnaire');
    }
  }, [avatar, styleProfile]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ErvenistaBranding size="medium" variant="gradient" />
        </View>

        {avatar ? (
          <>
            <View style={styles.greetingSection}>
              <IconSymbol 
                ios_icon_name="hand.wave.fill" 
                android_material_icon_name="waving_hand" 
                size={32} 
                color={colors.secondary} 
              />
              <Text style={styles.greetingText}>Hello! Meet your AI Avatar</Text>
            </View>

            <View style={styles.avatarSection}>
              <AvatarDisplay size="large" showMeasurements />
            </View>

            {styleProfile && (
              <View style={[styles.profileCard, shadows.medium]}>
                <Text style={styles.cardTitle}>Your Style Profile</Text>
                <View style={styles.profileRow}>
                  <Text style={styles.label}>Fit Preference:</Text>
                  <Text style={styles.value}>{styleProfile.fitPreference}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.label}>Style:</Text>
                  <Text style={styles.value}>{styleProfile.stylePreferences.join(', ')}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.updateButton, shadows.small]}
              onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
            >
              <IconSymbol 
                ios_icon_name="arrow.clockwise" 
                android_material_icon_name="refresh" 
                size={20} 
                color={colors.text} 
              />
              <Text style={styles.updateButtonText}>Update Avatar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={[styles.createSection, shadows.medium]}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto_awesome" 
              size={64} 
              color={colors.secondary} 
            />
            <Text style={styles.createTitle}>Create Your AI Avatar</Text>
            <Text style={styles.createSubtitle}>
              Get started with personalized virtual try-ons and size recommendations
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
            >
              <IconSymbol 
                ios_icon_name="person.crop.circle.badge.plus" 
                android_material_icon_name="person_add" 
                size={24} 
                color="#fff" 
              />
              <Text style={styles.createButtonText}>Create Your Avatar</Text>
            </TouchableOpacity>
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
  },
  content: {
    padding: 20,
    paddingTop: 100,
    paddingBottom: 100,
    alignItems: 'center',
  },
  header: {
    marginBottom: 32,
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  avatarSection: {
    marginBottom: 32,
  },
  createSection: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
    width: '100%',
  },
  createTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  createSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 12,
    gap: 12,
    ...shadows.medium,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileCard: {
    width: '100%',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginRight: 8,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  updateButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
