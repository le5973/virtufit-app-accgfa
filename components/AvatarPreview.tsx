
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { BodyMeasurements } from '@/types/bodyMeasurements';

interface AvatarPreviewProps {
  imageUri?: string;
  measurements?: Partial<BodyMeasurements>;
  confidence?: number;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  imageUri,
  measurements,
  confidence,
}) => {
  return (
    <View style={styles.container}>
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {confidence && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {Math.round(confidence * 100)}% confident
              </Text>
            </View>
          )}
        </View>
      )}

      {measurements && (
        <View style={styles.measurementsContainer}>
          <Text style={styles.measurementsTitle}>Body Measurements</Text>
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
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.meteor,
    marginBottom: 20,
    position: 'relative',
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
    backgroundColor: colors.galaxy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: colors.milkyWay,
    fontSize: 12,
    fontWeight: '600',
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
