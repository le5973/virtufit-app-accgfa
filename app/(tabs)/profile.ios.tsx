
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Share,
  Alert
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const handleShareProfile = async () => {
    try {
      const result = await Share.share({
        message: 'Check out my Ervenista profile! Create your own 3D avatar at ervenista.app',
        title: 'Share Ervenista Profile',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Profile shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.log('Error sharing profile:', error);
      Alert.alert('Error', 'Failed to share profile');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account-circle" 
              size={80} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.name}>Your Profile</Text>
          <Text style={styles.subtitle}>Ervenista Avatar</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
          <IconSymbol 
            ios_icon_name="square.and.arrow.up" 
            android_material_icon_name="share" 
            size={20} 
            color={colors.milkyWay} 
          />
          <Text style={styles.shareButtonText}>Share Profile</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Ervenista</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Ervenista creates highly accurate 3D avatars using AI-powered body scanning technology. 
              Upload your photo and measurements to see how clothes will look on you before buying.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <IconSymbol 
                ios_icon_name="camera.fill" 
                android_material_icon_name="camera" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.featureText}>AI Body Scanning</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol 
                ios_icon_name="ruler.fill" 
                android_material_icon_name="straighten" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.featureText}>Precise Measurements</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol 
                ios_icon_name="person.fill" 
                android_material_icon_name="person" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.featureText}>3D Avatar Creation</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol 
                ios_icon_name="cart.fill" 
                android_material_icon_name="shopping-cart" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.featureText}>Virtual Try-On</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurements Tracked</Text>
          <View style={styles.measurementsList}>
            <Text style={styles.measurementItem}>• Bust</Text>
            <Text style={styles.measurementItem}>• Waist</Text>
            <Text style={styles.measurementItem}>• Hip</Text>
            <Text style={styles.measurementItem}>• Shoulders</Text>
            <Text style={styles.measurementItem}>• Arm Length</Text>
            <Text style={styles.measurementItem}>• Legs Length</Text>
            <Text style={styles.measurementItem}>• Feet Size</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.milkyWay,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  measurementsList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  measurementItem: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
});
