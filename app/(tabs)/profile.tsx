
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Share,
  Alert,
  Platform
} from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const handleShareProfile = async () => {
    try {
      const result = await Share.share({
        message: "Check out my AI body scan profile! Download the app to create your own virtual avatar for accurate clothing try-ons.",
        title: "My AI Body Scan Profile",
      });

      if (result.action === Share.sharedAction) {
        console.log("Profile shared successfully");
      }
    } catch (error) {
      console.error("Error sharing profile:", error);
      Alert.alert("Error", "Failed to share profile. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={64} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.name}>Your Profile</Text>
          <Text style={styles.subtitle}>Virtual Avatar Profile</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Your Profile</Text>
          <Text style={styles.sectionDescription}>
            Share your avatar profile with friends or clothing brands for personalized recommendations
          </Text>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
            <IconSymbol 
              ios_icon_name="square.and.arrow.up" 
              android_material_icon_name="share" 
              size={24} 
              color={colors.card} 
            />
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="camera.fill" 
                android_material_icon_name="camera" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>1. Scan Your Body</Text>
              <Text style={styles.featureDescription}>
                Upload a photo and provide basic measurements
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="sparkles" 
                android_material_icon_name="auto-awesome" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>2. AI Analysis</Text>
              <Text style={styles.featureDescription}>
                Our AI creates an accurate 3D avatar with precise measurements
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="tshirt.fill" 
                android_material_icon_name="checkroom" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>3. Virtual Try-On</Text>
              <Text style={styles.featureDescription}>
                See how clothes from any brand will look on you before buying
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol 
                ios_icon_name="person.2.fill" 
                android_material_icon_name="group" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>4. Share & Connect</Text>
              <Text style={styles.featureDescription}>
                Share your profile with friends or brands for personalized recommendations
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="lock.fill" 
            android_material_icon_name="lock" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            Your body measurements and photos are private and secure. 
            You control what you share and with whom.
          </Text>
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
  scrollContent: {
    paddingTop: Platform.OS === "android" ? 48 : 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.highlight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.card,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
