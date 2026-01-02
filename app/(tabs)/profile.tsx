
import { colors } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { useLogoGen } from '@/hooks/useLogoGen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.milkyWay,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.milkyWay,
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  logoSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  logoPreview: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: colors.border,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    fontSize: 48,
  },
  logoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: colors.milkyWay,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  shareButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  shareButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  colorSchemeInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default function ProfileScreen() {
  const { generate, loading, error, data, reset } = useLogoGen();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleGenerateLogo = async () => {
    console.log('Generating logo...');
    const result = await generate({
      appName: 'Ervenista',
      colorScheme: '#162456, #193cb8, #64B5F6',
      style: 'modern, elegant, fashion-focused',
    });

    if (result) {
      setLogoUrl(result.url);
      Alert.alert(
        'Logo Generated!',
        'Your app logo has been generated successfully. The backend will integrate this with OpenAI image generation.',
        [{ text: 'OK' }]
      );
    } else if (error) {
      Alert.alert('Error', error);
    }
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: 'Check out my Ervenista profile! Join me to share virtual try-on outfits and wishlists.',
        url: 'https://ervenista.app/profile/demo',
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your Ervenista account</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Logo</Text>
          <View style={styles.logoSection}>
            <View style={styles.logoPreview}>
              {logoUrl ? (
                <Image source={{ uri: logoUrl }} style={styles.logoImage} resizeMode="cover" />
              ) : (
                <Text style={styles.logoPlaceholder}>👗</Text>
              )}
            </View>
            <Text style={styles.logoText}>
              Generate a custom logo for Ervenista using AI with the blue color scheme
            </Text>
            <TouchableOpacity 
              style={styles.generateButton} 
              onPress={handleGenerateLogo}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.milkyWay} />
              ) : (
                <>
                  <IconSymbol 
                    ios_icon_name="sparkles" 
                    android_material_icon_name="auto-awesome" 
                    size={20} 
                    color={colors.milkyWay} 
                  />
                  <Text style={styles.generateButtonText}>Generate Logo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Color Scheme</Text>
            <Text style={styles.infoLabel}>Ervenista uses an elegant blue palette:</Text>
            <View style={styles.colorSchemeInfo}>
              <View style={[styles.colorSwatch, { backgroundColor: '#162456' }]} />
              <View style={[styles.colorSwatch, { backgroundColor: '#193cb8' }]} />
              <View style={[styles.colorSwatch, { backgroundColor: '#64B5F6' }]} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Name</Text>
              <Text style={styles.infoValue}>Ervenista</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Theme</Text>
              <Text style={styles.infoValue}>Blue Elegance</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Share Your Profile</Text>
            <Text style={styles.infoLabel}>
              Share your Ervenista profile with friends to connect and view each other&apos;s public wishlists.
            </Text>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
              <IconSymbol 
                ios_icon_name="square.and.arrow.up" 
                android_material_icon_name="share" 
                size={20} 
                color={colors.text} 
              />
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
