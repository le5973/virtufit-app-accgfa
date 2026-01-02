
import { colors } from '@/styles/commonStyles';
import React from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProfileScreen() {
  const { isSubscribed, subscriptionStatus, showPaywall } = useSubscription();
  const router = useRouter();

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: 'Check out my Ervenista profile! Join me on the AI-powered fashion platform.',
        title: 'Share Ervenista Profile',
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleManageSubscription = async () => {
    if (isSubscribed) {
      Alert.alert(
        'Manage Subscription',
        'To manage your subscription, please visit your device settings.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
    } else {
      router.push('/paywall');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* Subscription Status Card */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <MaterialIcons 
              name={isSubscribed ? 'verified' : 'lock'} 
              size={32} 
              color={isSubscribed ? colors.primary : colors.textSecondary} 
            />
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>
                {isSubscribed ? 'Premium Member' : 'Free Plan'}
              </Text>
              <Text style={styles.subscriptionStatus}>
                Status: {subscriptionStatus}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.subscriptionButton, isSubscribed && styles.subscriptionButtonActive]}
            onPress={handleManageSubscription}
          >
            <Text style={[styles.subscriptionButtonText, isSubscribed && styles.subscriptionButtonTextActive]}>
              {isSubscribed ? 'Manage Subscription' : 'Upgrade to Premium'}
            </Text>
          </TouchableOpacity>

          {!isSubscribed && (
            <View style={styles.premiumFeatures}>
              <Text style={styles.premiumFeaturesTitle}>Premium Features:</Text>
              <Text style={styles.premiumFeature}>• 7-day free trial</Text>
              <Text style={styles.premiumFeature}>• AI Body Scanning</Text>
              <Text style={styles.premiumFeature}>• Virtual Try-On</Text>
              <Text style={styles.premiumFeature}>• Unlimited Wishlist</Text>
              <Text style={styles.premiumFeature}>• AI Stylist Recommendations</Text>
              <Text style={styles.premiumPrice}>Only £0.99/month after trial</Text>
            </View>
          )}
        </View>

        {/* Profile Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
            <MaterialIcons name="share" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Share Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="settings" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="help" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Ervenista v1.0.0</Text>
          <Text style={styles.appInfoText}>Your AI Fashion Assistant</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  subscriptionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscriptionButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionButtonActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  subscriptionButtonTextActive: {
    color: colors.primary,
  },
  premiumFeatures: {
    marginTop: 8,
  },
  premiumFeaturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  premiumFeature: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  premiumPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
