
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles, shadows } from "@/styles/commonStyles";
import { ErvenistaBranding } from "@/components/ErvenistaBranding";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

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
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
