
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "@/styles/commonStyles";
import { BodyMeasurements } from "@/types/bodyMeasurements";

interface AvatarPreviewProps {
  imageUri?: string;
  measurements?: Partial<BodyMeasurements>;
  confidence?: number;
}

export function AvatarPreview({ imageUri, measurements, confidence }: AvatarPreviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Avatar</Text>
      
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {confidence !== undefined && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {Math.round(confidence * 100)}% accurate
              </Text>
            </View>
          )}
        </View>
      )}

      {measurements && (
        <View style={styles.measurementsContainer}>
          <Text style={styles.measurementsTitle}>Body Measurements</Text>
          
          <View style={styles.measurementGrid}>
            {measurements.height && (
              <MeasurementItem label="Height" value={`${measurements.height} cm`} />
            )}
            {measurements.weight && (
              <MeasurementItem label="Weight" value={`${measurements.weight} kg`} />
            )}
            {measurements.chest && (
              <MeasurementItem label="Chest" value={`${measurements.chest} cm`} />
            )}
            {measurements.waist && (
              <MeasurementItem label="Waist" value={`${measurements.waist} cm`} />
            )}
            {measurements.hips && (
              <MeasurementItem label="Hips" value={`${measurements.hips} cm`} />
            )}
            {measurements.shoulders && (
              <MeasurementItem label="Shoulders" value={`${measurements.shoulders} cm`} />
            )}
            {measurements.inseam && (
              <MeasurementItem label="Inseam" value={`${measurements.inseam} cm`} />
            )}
            {measurements.neck && (
              <MeasurementItem label="Neck" value={`${measurements.neck} cm`} />
            )}
            {measurements.sleeve && (
              <MeasurementItem label="Sleeve" value={`${measurements.sleeve} cm`} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function MeasurementItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.measurementItem}>
      <Text style={styles.measurementLabel}>{label}</Text>
      <Text style={styles.measurementValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.background,
    marginBottom: 20,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  confidenceBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: "600",
  },
  measurementsContainer: {
    width: "100%",
  },
  measurementsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  measurementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  measurementItem: {
    width: "48%",
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
  },
  measurementLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
});
