
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockSizeGuides, predictFit, getBestFitSize } from '@/utils/sizeGuideHelper';
import { BodyMeasurements, FitPrediction } from '@/types/bodyMeasurements';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';
import { useRouter } from 'expo-router';

export default function SizeGuideScreen() {
  const router = useRouter();
  const { avatar, loading: avatarLoading } = useAvatarStorage();
  const [selectedBrand, setSelectedBrand] = useState<string>('zara');
  const [predictions, setPredictions] = useState<FitPrediction[]>([]);
  const [userMeasurements, setUserMeasurements] = useState<BodyMeasurements | null>(null);

  // Load measurements from stored avatar data
  useEffect(() => {
    if (avatar?.measurements) {
      // Convert stored measurements to BodyMeasurements format
      const measurements: BodyMeasurements = {
        bust: parseFloat(avatar.measurements.bust) || 0,
        waist: parseFloat(avatar.measurements.waist) || 0,
        hip: parseFloat(avatar.measurements.hip) || 0,
        shoulders: 40, // Default value if not stored
        armLength: 60, // Default value if not stored
        legsLength: 80, // Default value if not stored
        feetSize: 25, // Default value if not stored
      };
      console.log('Loaded measurements from avatar:', measurements);
      setUserMeasurements(measurements);
    }
  }, [avatar]);

  // Calculate predictions when brand or measurements change
  useEffect(() => {
    if (userMeasurements) {
      const sizeGuide = mockSizeGuides[selectedBrand];
      if (sizeGuide) {
        const fitPredictions = predictFit(userMeasurements, sizeGuide);
        setPredictions(fitPredictions);
      }
    }
  }, [selectedBrand, userMeasurements]);

  const bestFit = getBestFitSize(predictions);

  const getFitScoreColor = (score: number) => {
    if (score >= 85) return colors.primary;
    if (score >= 70) return colors.accent;
    return colors.error;
  };

  const renderBrandButton = (brandKey: string, brandName: string) => (
    <TouchableOpacity
      key={brandKey}
      style={[
        styles.brandButton,
        selectedBrand === brandKey && styles.brandButtonActive,
      ]}
      onPress={() => setSelectedBrand(brandKey)}
    >
      <Text
        style={[
          styles.brandButtonText,
          selectedBrand === brandKey && styles.brandButtonTextActive,
        ]}
      >
        {brandName}
      </Text>
    </TouchableOpacity>
  );

  const renderPrediction = (prediction: FitPrediction) => (
    <View
      key={prediction.size}
      style={[
        styles.predictionCard,
        prediction.perfectFit && styles.predictionCardPerfect,
      ]}
    >
      <View style={styles.predictionHeader}>
        <View style={styles.predictionLeft}>
          <Text style={styles.predictionSize}>Size {prediction.size}</Text>
          {prediction.perfectFit && (
            <View style={styles.perfectBadge}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.perfectBadgeText}>Perfect Fit</Text>
            </View>
          )}
        </View>
        <View style={styles.fitScoreContainer}>
          <Text
            style={[
              styles.fitScore,
              { color: getFitScoreColor(prediction.fitScore) },
            ]}
          >
            {prediction.fitScore}%
          </Text>
        </View>
      </View>

      <View style={styles.recommendationsContainer}>
        {prediction.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <IconSymbol
              ios_icon_name={
                prediction.tooSmall
                  ? 'exclamationmark.triangle.fill'
                  : prediction.tooLarge
                  ? 'info.circle.fill'
                  : 'checkmark.circle.fill'
              }
              android_material_icon_name={
                prediction.tooSmall
                  ? 'warning'
                  : prediction.tooLarge
                  ? 'info'
                  : 'check-circle'
              }
              size={16}
              color={
                prediction.tooSmall
                  ? colors.error
                  : prediction.tooLarge
                  ? colors.accent
                  : colors.primary
              }
            />
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Show loading state while avatar data is being loaded
  if (avatarLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your measurements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show message if no avatar/measurements exist
  if (!userMeasurements || userMeasurements.bust === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <IconSymbol
            ios_icon_name="person.circle"
            android_material_icon_name="person"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>No Measurements Found</Text>
          <Text style={styles.emptySubtitle}>
            Create your AI avatar first to get personalized size recommendations
          </Text>
          <TouchableOpacity
            style={styles.createAvatarButton}
            onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
          >
            <Text style={styles.createAvatarButtonText}>Create Avatar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Size Guide</Text>
        <Text style={styles.subtitle}>
          Find your perfect fit based on your measurements
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Measurements</Text>
          <View style={styles.measurementsCard}>
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Bust:</Text>
              <Text style={styles.measurementValue}>{userMeasurements.bust} cm</Text>
            </View>
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Waist:</Text>
              <Text style={styles.measurementValue}>{userMeasurements.waist} cm</Text>
            </View>
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Hip:</Text>
              <Text style={styles.measurementValue}>{userMeasurements.hip} cm</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.updateMeasurementsButton}
            onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
          >
            <IconSymbol
              ios_icon_name="pencil"
              android_material_icon_name="edit"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.updateMeasurementsText}>Update Measurements</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Brand</Text>
          <View style={styles.brandButtons}>
            {renderBrandButton('zara', 'Zara')}
            {renderBrandButton('h&m', 'H&M')}
            {renderBrandButton('nike', 'Nike')}
          </View>
        </View>

        {bestFit && (
          <View style={styles.bestFitBanner}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={24}
              color={colors.primary}
            />
            <View style={styles.bestFitText}>
              <Text style={styles.bestFitTitle}>Recommended Size</Text>
              <Text style={styles.bestFitSize}>Size {bestFit.size}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Sizes</Text>
          {predictions.map(renderPrediction)}
        </View>

        <View style={styles.infoBox}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Size predictions are based on your body measurements and brand size guides. 
            Actual fit may vary depending on fabric and style.
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
  header: {
    padding: 20,
    paddingTop: 100,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  createAvatarButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  createAvatarButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.milkyWay,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  measurementsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  measurementLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  measurementValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '700',
  },
  updateMeasurementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  updateMeasurementsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  brandButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  brandButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  brandButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  brandButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  brandButtonTextActive: {
    color: colors.milkyWay,
  },
  bestFitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 12,
  },
  bestFitText: {
    flex: 1,
  },
  bestFitTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  bestFitSize: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '800',
  },
  predictionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  predictionCardPerfect: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  predictionSize: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  perfectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  perfectBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  fitScoreContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fitScore: {
    fontSize: 16,
    fontWeight: '800',
  },
  recommendationsContainer: {
    gap: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
