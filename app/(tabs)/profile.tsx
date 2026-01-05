
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Share,
  Alert,
  Platform
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'profile' | 'features' | 'settings';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

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

  const renderProfileTab = () => (
    <>
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
    </>
  );

  const renderFeaturesTab = () => (
    <>
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
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>AI Body Scanning</Text>
              <Text style={styles.featureDescription}>
                Upload photos or videos to create your 3D avatar
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="ruler.fill" 
              android_material_icon_name="straighten" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Precise Measurements</Text>
              <Text style={styles.featureDescription}>
                Get accurate body measurements for perfect fit
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>3D Avatar Creation</Text>
              <Text style={styles.featureDescription}>
                See yourself in 3D with realistic proportions
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="cart.fill" 
              android_material_icon_name="shopping-cart" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Virtual Try-On</Text>
              <Text style={styles.featureDescription}>
                Try clothes virtually before purchasing
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.infoCard}>
          <Text style={styles.stepNumber}>1.</Text>
          <Text style={styles.stepText}>Upload your photo or video</Text>
          <Text style={styles.stepNumber}>2.</Text>
          <Text style={styles.stepText}>Enter your measurements</Text>
          <Text style={styles.stepNumber}>3.</Text>
          <Text style={styles.stepText}>AI creates your 3D avatar</Text>
          <Text style={styles.stepNumber}>4.</Text>
          <Text style={styles.stepText}>Try on clothes virtually</Text>
        </View>
      </View>
    </>
  );

  const renderSettingsTab = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Edit Profile</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="bell.fill" 
              android_material_icon_name="notifications" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Notifications</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Privacy</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="moon.fill" 
              android_material_icon_name="dark-mode" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Dark Mode</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="globe" 
              android_material_icon_name="language" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Language</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="questionmark.circle.fill" 
              android_material_icon_name="help" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Help Center</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="envelope.fill" 
              android_material_icon_name="email" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.settingText}>Contact Us</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'features':
        return renderFeaturesTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'profile' && styles.activeTabText
          ]}>
            Profile
          </Text>
          {activeTab === 'profile' && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'features' && styles.activeTab]}
          onPress={() => setActiveTab('features')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'features' && styles.activeTabText
          ]}>
            Features
          </Text>
          {activeTab === 'features' && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'settings' && styles.activeTabText
          ]}>
            Settings
          </Text>
          {activeTab === 'settings' && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 5,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    // Active state handled by indicator
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '80%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
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
  featureTextContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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
  stepNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 12,
  },
  stepText: {
    fontSize: 15,
    color: colors.text,
    marginTop: 4,
    marginBottom: 8,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
