
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
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockSizeGuides, predictFit, getBestFitSize } from '@/utils/sizeGuideHelper';
import { BodyMeasurements, FitPrediction } from '@/types/bodyMeasurements';
import { useAvatarStorage } from '@/hooks/useAvatarStorage';
import { useRouter } from 'expo-router';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';
import { LinearGradient } from 'expo-linear-gradient';

export default function SizeGuideScreen() {
  const router = useRouter();
  const { avatar, loading: avatarLoading } = useAvatarStorage();
  const [selectedBrand, setSelectedBrand] = useState<string>('zara');
  const [predictions, setPredictions] = useState<FitPrediction[]>([]);
  const [userMeasurements, setUserMeasurements] = useState<BodyMeasurements | null>(null);

  useEffect(() => {
    if (avatar?.measurements) {
      const measurements: BodyMeasurements = {
        bust: parseFloat(avatar.measurements.bust) || 0,
        waist: parseFloat(avatar.measurements.waist) || 0,
        hip: parseFloat(avatar.measurements.hip) || 0,
        shoulders: 40,
        armLength: 60,
        legsLength: 80,
        feetSize: 25,
      };
      console.log('Loaded measurements from avatar:', measurements);
      setUserMeasurements(measurements);
    }
  }, [avatar]);

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
    if (score >= 85) return colors.success;
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
        shadows.small,
        prediction.perfectFit && styles.predictionCardPerfect,
      ]}
    >
      <View style={styles.predictionHeader}>
        <View style={styles.predictionLeft}>
          <Text style={styles.predictionSize}>Size {prediction.size}</Text>
          {prediction.perfectFit && (
            <View style={styles.perfectBadge}>
              <IconSymbol
                android_material_icon_name="check_circle"
                size={16}
                color={colors.success}
              />
              <Text style={styles.perfectBadgeText}>Perfect Fit</Text>
            </View>
          )}
        </View>
        <View style={[styles.fitScoreContainer, { backgroundColor: getFitScoreColor(prediction.fitScore) + '20' }]}>
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
              android_material_icon_name={
                prediction.tooSmall
                  ? 'warning'
                  : prediction.tooLarge
                  ? 'info'
                  : 'check_circle'
              }
              size={16}
              color={
                prediction.tooSmall
                  ? colors.error
                  : prediction.tooLarge
                  ? colors.accent
                  : colors.success
              }
            />
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (avatarLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your measurements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userMeasurements || userMeasurements.bust === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <ErvenistaBranding size="small" variant="minimal" />
        </View>
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.emptyIconCircle}
          >
            <IconSymbol
              android_material_icon_name="straighten"
              size={48}
              color="#FFFFFF"
            />
          </LinearGradient>
          <Text style={styles.emptyTitle}>No Measurements Found</Text>
          <Text style={styles.emptySubtitle}>
            Create your AI avatar first to get personalized size recommendations
          </Text>
          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
          >
            <Text style={buttonStyles.primaryText}>Create Avatar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ErvenistaBranding size="small" variant="minimal" />
        <Text style={styles.title}>Size Guide</Text>
        <Text style={styles.subtitle}>
          Find your perfect fit based on your measurements
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.measurementsCard, shadows.medium]}>
          <Text style={commonStyles.heading}>Your Measurements</Text>
          <View style={styles.measurementGrid}>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Bust</Text>
              <Text style={styles.measurementValue}>{userMeasurements.bust} cm</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Waist</Text>
              <Text style={styles.measurementValue}>{userMeasurements.waist} cm</Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>Hip</Text>
              <Text style={styles.measurementValue}>{userMeasurements.hip} cm</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => router.push('/(tabs)/(home)/avatar-generator')}
          >
            <IconSymbol
              android_material_icon_name="edit"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.updateButtonText}>Update Measurements</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.heading}>Select Brand</Text>
          <View style={styles.brandButtons}>
            {renderBrandButton('zara', 'Zara')}
            {renderBrandButton('h&m', 'H&M')}
            {renderBrandButton('nike', 'Nike')}
          </View>
        </View>

        {bestFit && (
          <View style={[styles.bestFitBanner, shadows.medium]}>
            <LinearGradient
              colors={[colors.success, colors.success + 'CC']}
              style={styles.bestFitGradient}
            >
              <IconSymbol
                android_material_icon_name="star"
                size={28}
                color="#FFFFFF"
              />
              <View style={styles.bestFitText}>
                <Text style={styles.bestFitTitle}>Recommended Size</Text>
                <Text style={styles.bestFitSize}>Size {bestFit.size}</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        <View style={styles.section}>
          <Text style={commonStyles.heading}>All Sizes</Text>
          {predictions.map(renderPrediction)}
        </View>

        <View style={[styles.infoBox, shadows.small]}>
          <IconSymbol
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Size predictions are based on your body measurements and brand size guides. 
            Actual fit may vary depending on fabric and style.
          </Text>
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
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
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
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
  section: {
    marginBottom: 24,
  },
  measurementsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  measurementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
  measurementItem: {
    alignItems: 'center',
    flex: 1,
  },
  measurementLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  measurementValue: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '800',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  brandButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
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
    color: '#FFFFFF',
  },
  bestFitBanner: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  bestFitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  bestFitText: {
    flex: 1,
  },
  bestFitTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  bestFitSize: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  predictionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  predictionCardPerfect: {
    borderColor: colors.success,
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
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  perfectBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
  },
  fitScoreContainer: {
    borderRadius: 10,
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
