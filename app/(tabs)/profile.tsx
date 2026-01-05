
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
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';
import { LinearGradient } from 'expo-linear-gradient';

type TabType = 'profile' | 'features' | 'settings';

const FEATURES_DATA = [
  { title: 'AI Avatar Generation', icon: 'person', enabled: true },
  { title: 'Virtual Try-On', icon: 'checkroom', enabled: true },
  { title: 'Size Recommendations', icon: 'straighten', enabled: true },
  { title: 'Social Sharing', icon: 'share', enabled: true },
];

const SETTINGS_DATA = [
  { title: 'Account Settings', icon: 'settings' },
  { title: 'Privacy & Security', icon: 'lock' },
  { title: 'Notifications', icon: 'notifications' },
  { title: 'Help & Support', icon: 'help' },
  { title: 'About Ervenista', icon: 'info' },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: 'Check out my Ervenista profile! Join me for personalized virtual try-ons.',
        title: 'Share Ervenista Profile',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.profileHeader, shadows.medium]}>
        <LinearGradient
          colors={[colors.secondary, colors.primary]}
          style={styles.avatarGradient}
        >
          <IconSymbol android_material_icon_name="person" size={48} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.profileName}>Your Profile</Text>
        <Text style={styles.profileEmail}>user@ervenista.com</Text>
      </View>

      <View style={[styles.card, shadows.small]}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Saved Items</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Try-Ons</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleShareProfile} style={[buttonStyles.primary, { marginTop: 16 }]}>
        <Text style={buttonStyles.primaryText}>Share Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFeaturesTab = () => (
    <View style={styles.tabContent}>
      <Text style={commonStyles.heading}>Premium Features</Text>
      <React.Fragment>
        {FEATURES_DATA.map((feature, index) => (
          <View key={index} style={[styles.featureItem, shadows.small]}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol android_material_icon_name={feature.icon as any} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.featureText}>{feature.title}</Text>
            <IconSymbol 
              android_material_icon_name={feature.enabled ? "check_circle" : "cancel"} 
              size={24} 
              color={feature.enabled ? colors.success : colors.textLight} 
            />
          </View>
        ))}
      </React.Fragment>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={commonStyles.heading}>Settings</Text>
      <React.Fragment>
        {SETTINGS_DATA.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.settingItem, shadows.small]}>
            <IconSymbol android_material_icon_name={item.icon as any} size={24} color={colors.primary} />
            <Text style={styles.settingText}>{item.title}</Text>
            <IconSymbol android_material_icon_name="chevron_right" size={24} color={colors.textLight} />
          </TouchableOpacity>
        ))}
      </React.Fragment>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'features':
        return renderFeaturesTab();
      case 'settings':
        return renderSettingsTab();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ErvenistaBranding size="small" variant="minimal" />
      </View>

      <View style={[styles.tabBar, shadows.small]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'features' && styles.tabActive]}
          onPress={() => setActiveTab('features')}
        >
          <Text style={[styles.tabText, activeTab === 'features' && styles.tabTextActive]}>
            Features
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  profileHeader: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
});
