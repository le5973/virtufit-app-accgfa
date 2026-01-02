
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockSizeGuides, predictFit, getBestFitSize } from '@/utils/sizeGuideHelper';
import { BodyMeasurements, FitPrediction } from '@/types/bodyMeasurements';

// Mock user measurements - in production, this would come from the body scan
const mockUserMeasurements: BodyMeasurements = {
  bust: 88,
  waist: 70,
  hip: 96,
  shoulders: 40,
  armLength: 60,
  legsLength: 80,
  feetSize: 25,
};

export default function SizeGuideScreen() {
  const [selectedBrand, setSelectedBrand] = useState<string>('zara');
  const [predictions, setPredictions] = useState<FitPrediction[]>([]);

  React.useEffect(() => {
    const sizeGuide = mockSizeGuides[selectedBrand];
    if (sizeGuide) {
      const fitPredictions = predictFit(mockUserMeasurements, sizeGuide);
      setPredictions(fitPredictions);
    }
  }, [selectedBrand]);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
              <Text style={styles.measurementValue}>{mockUserMeasurements.bust} cm</Text>
            </View>
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Waist:</Text>
              <Text style={styles.measurementValue}>{mockUserMeasurements.waist} cm</Text>
            </View>
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Hip:</Text>
              <Text style={styles.measurementValue}>{mockUserMeasurements.hip} cm</Text>
            </View>
          </View>
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
