
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles, shadows } from "@/styles/commonStyles";
import { ErvenistaBranding } from "@/components/ErvenistaBranding";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { useAvatarStorage } from "@/hooks/useAvatarStorage";

const features = [
  {
    title: "AI Avatar",
    description: "Create your digital twin with precise measurements",
    route: "/(tabs)/(home)/avatar-generator",
    icon: "person",
    color: colors.primary,
  },
  {
    title: "Virtual Try-On",
    description: "See how clothes look on your avatar",
    route: "/(tabs)/wardrobe",
    icon: "checkroom",
    color: colors.secondary,
  },
  {
    title: "Size Guide",
    description: "Get personalized size recommendations",
    route: "/(tabs)/size-guide",
    icon: "straighten",
    color: colors.accent,
  },
  {
    title: "Wishlist",
    description: "Save and share your favorite items",
    route: "/(tabs)/wishlist",
    icon: "favorite",
    color: colors.info,
  },
  {
    title: "Social",
    description: "Connect with friends and share styles",
    route: "/(tabs)/social",
    icon: "people",
    color: colors.success,
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { avatar, styleProfile } = useAvatarStorage();

  useEffect(() => {
    // If avatar exists but no style profile, redirect to questionnaire
    if (avatar && !styleProfile) {
      router.push('/(tabs)/(home)/style-questionnaire');
    }
  }, [avatar, styleProfile]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Branding */}
        <View style={styles.header}>
          <ErvenistaBranding size="large" showTagline variant="gradient" />
          <Text style={styles.welcomeText}>
            Welcome to the future of online shopping
          </Text>
        </View>

        {/* AI Avatar Section */}
        {avatar ? (
          <View style={[styles.avatarSection, shadows.medium]}>
            <View style={styles.avatarHeader}>
              <IconSymbol
                android_material_icon_name="waving_hand"
                size={28}
                color={colors.secondary}
              />
              <Text style={styles.greetingText}>Hello! Meet your AI Avatar</Text>
            </View>
            <View style={styles.avatarDisplayContainer}>
              <AvatarDisplay size="large" showMeasurements />
            </View>
            <TouchableOpacity
              style={styles.updateAvatarButton}
              onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
            >
              <IconSymbol
                android_material_icon_name="edit"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.updateAvatarText}>Update Avatar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.createAvatarBanner, shadows.medium]}>
            <IconSymbol
              android_material_icon_name="auto_awesome"
              size={48}
              color={colors.secondary}
            />
            <Text style={styles.bannerTitle}>Create Your AI Avatar</Text>
            <Text style={styles.bannerSubtitle}>
              Get started with personalized virtual try-ons and size recommendations
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
            >
              <IconSymbol
                android_material_icon_name="add_circle"
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.createButtonText}>Create Avatar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <View style={commonStyles.sectionHeader}>
            <Text style={commonStyles.subtitle}>Features</Text>
          </View>
          
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(feature.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.featureCard, shadows.medium]}>
                <View style={[styles.iconCircle, { backgroundColor: feature.color }]}>
                  <IconSymbol
                    android_material_icon_name={feature.icon as any}
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <IconSymbol
                  android_material_icon_name="chevron_right"
                  size={24}
                  color={colors.textLight}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, shadows.small]}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={[styles.statCard, shadows.small]}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={[styles.statCard, shadows.small]}>
            <Text style={styles.statNumber}>100+</Text>
            <Text style={styles.statLabel}>Brands</Text>
          </View>
        </View>

        {/* Bottom Padding for Tab Bar */}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  avatarSection: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  avatarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  avatarDisplayContainer: {
    marginBottom: 20,
  },
  updateAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  updateAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  createAvatarBanner: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    ...shadows.medium,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
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
});
