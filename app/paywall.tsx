
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useSubscription } from '@/contexts/SubscriptionContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function PaywallScreen() {
  const router = useRouter();
  const { showPaywall, isSubscribed } = useSubscription();

  const handleShowPaywall = async () => {
    await showPaywall();
    if (isSubscribed) {
      router.back();
    }
  };

  const features = [
    { icon: 'camera-alt', text: 'AI Body Scanning' },
    { icon: 'checkroom', text: 'Virtual Try-On' },
    { icon: 'favorite', text: 'Unlimited Wishlist' },
    { icon: 'people', text: 'Social Features' },
    { icon: 'auto-awesome', text: 'AI Stylist Recommendations' },
    { icon: 'straighten', text: 'Accurate Size Predictions' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ervenista Premium</Text>
          <Text style={styles.subtitle}>Your Personal AI Fashion Assistant</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <MaterialIcons name={feature.icon as any} size={24} color={colors.primary} />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pricingCard}>
          <Text style={styles.priceTitle}>Premium Subscription</Text>
          <Text style={styles.price}>£0.99</Text>
          <Text style={styles.priceSubtitle}>per month</Text>
          <Text style={styles.trialText}>7-day free trial included</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleShowPaywall}
          >
            <Text style={styles.buttonText}>Start Free Trial</Text>
            <Text style={styles.buttonSubtext}>7 days free, then £0.99/month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Maybe Later
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          Cancel anytime. Subscription automatically renews unless cancelled at least 24 hours
          before the end of the current period.
        </Text>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    fontWeight: '500',
  },
  pricingCard: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  priceTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  priceSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  trialText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});
