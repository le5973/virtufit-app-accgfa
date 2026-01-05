
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';
import { IconSymbol } from '@/components/IconSymbol';

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
        <Text style={styles.title}>Your AI Avatar</Text>
        
        <View style={styles.avatarSection}>
          <AvatarDisplay size="large" showMeasurements />
        </View>

        {!avatar && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
          >
            <IconSymbol 
              ios_icon_name="person.crop.circle.badge.plus" 
              android_material_icon_name="person-add" 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.createButtonText}>Create Your Avatar</Text>
          </TouchableOpacity>
        )}

        {avatar && styleProfile && (
          <View style={styles.profileCard}>
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

        {avatar && (
          <TouchableOpacity
            style={styles.updateButton}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  avatarSection: {
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileCard: {
    width: '100%',
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    color: colors.grey,
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
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
  },
  updateButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
