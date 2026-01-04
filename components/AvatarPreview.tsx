
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { BodyMeasurements } from '@/types/bodyMeasurements';
import { IconSymbol } from '@/components/IconSymbol';

interface AvatarPreviewProps {
  imageUri?: string;
  avatarUrl?: string;
  measurements?: Partial<BodyMeasurements>;
  confidence?: number;
  loading?: boolean;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  imageUri,
  avatarUrl,
  measurements,
  confidence,
  loading = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <Text style={styles.sectionTitle}>Your AI Avatar</Text>
        <Text style={styles.sectionSubtitle}>
          Generated from your photos and measurements
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Generating your AI avatar...</Text>
            <Text style={styles.loadingSubtext}>
              This may take a few moments
            </Text>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: avatarUrl || imageUri }} 
              style={styles.image} 
            />
            {confidence && (
              <View style={styles.confidenceBadge}>
                <IconSymbol
                  ios_icon_name="check-circle"
                  android_material_icon_name="check-circle"
                  size={16}
                  color={colors.milkyWay}
                />
                <Text style={styles.confidenceText}>
                  {Math.round(confidence * 100)}% accurate
                </Text>
              </View>
            )}
            {avatarUrl && (
              <View style={styles.aiLabel}>
                <IconSymbol
                  ios_icon_name="auto-awesome"
                  android_material_icon_name="auto-awesome"
                  size={16}
                  color={colors.milkyWay}
                />
                <Text style={styles.aiLabelText}>AI Generated</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {measurements && !loading && (
        <View style={styles.measurementsContainer}>
          <Text style={styles.measurementsTitle}>Body Measurements</Text>
          <Text style={styles.measurementsSubtitle}>
            Used for accurate size recommendations
          </Text>
          <View style={styles.measurementsGrid}>
            {measurements.bust !== undefined && (
              <MeasurementItem label="Bust" value={`${measurements.bust} cm`} />
            )}
            {measurements.waist !== undefined && (
              <MeasurementItem label="Waist" value={`${measurements.waist} cm`} />
            )}
            {measurements.hip !== undefined && (
              <MeasurementItem label="Hip" value={`${measurements.hip} cm`} />
            )}
            {measurements.shoulders !== undefined && (
              <MeasurementItem label="Shoulders" value={`${measurements.shoulders} cm`} />
            )}
            {measurements.armLength !== undefined && (
              <MeasurementItem label="Arm Length" value={`${measurements.armLength} cm`} />
            )}
            {measurements.legsLength !== undefined && (
              <MeasurementItem label="Legs Length" value={`${measurements.legsLength} cm`} />
            )}
            {measurements.feetSize !== undefined && (
              <MeasurementItem label="Feet Size" value={`${measurements.feetSize} cm`} />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const MeasurementItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.measurementItem}>
    <Text style={styles.measurementLabel}>{label}</Text>
    <Text style={styles.measurementValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  avatarSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.meteor,
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  confidenceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.galaxy,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  confidenceText: {
    color: colors.milkyWay,
    fontSize: 13,
    fontWeight: '700',
  },
  aiLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  aiLabelText: {
    color: colors.milkyWay,
    fontSize: 13,
    fontWeight: '700',
  },
  measurementsContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  measurementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  measurementsSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  measurementsGrid: {
    gap: 12,
  },
  measurementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  measurementLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
