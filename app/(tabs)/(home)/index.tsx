
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert,
  Image,
  Platform
} from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import * as ImagePicker from "expo-image-picker";
import { useBodyAnalysis } from "@/hooks/useBodyAnalysis";
import { AvatarPreview } from "@/components/AvatarPreview";

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const { analyzeBody, loading, error, data, reset } = useBodyAnalysis();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        reset(); // Reset previous analysis
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      console.log("Camera result:", result);

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        reset(); // Reset previous analysis
      }
    } catch (err) {
      console.error("Error taking photo:", err);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select or take a photo first.");
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!heightNum || heightNum < 100 || heightNum > 250) {
      Alert.alert("Invalid Height", "Please enter a valid height between 100-250 cm.");
      return;
    }

    if (!weightNum || weightNum < 30 || weightNum > 300) {
      Alert.alert("Invalid Weight", "Please enter a valid weight between 30-300 kg.");
      return;
    }

    console.log("Starting body analysis...");
    await analyzeBody({
      imageUri: selectedImage,
      manualMeasurements: {
        height: heightNum,
        weight: weightNum,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="person.fill" 
            android_material_icon_name="person" 
            size={48} 
            color={colors.primary} 
          />
          <Text style={styles.title}>AI Body Scanner</Text>
          <Text style={styles.subtitle}>
            Create your accurate 3D avatar for virtual try-ons
          </Text>
        </View>

        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Step 1: Upload Your Photo</Text>
          <Text style={styles.sectionDescription}>
            Take or upload a full-body photo in good lighting
          </Text>

          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => {
                  setSelectedImage(null);
                  reset();
                }}
              >
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="cancel" 
                  size={32} 
                  color={colors.error} 
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <IconSymbol 
                  ios_icon_name="camera.fill" 
                  android_material_icon_name="camera" 
                  size={32} 
                  color={colors.primary} 
                />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <IconSymbol 
                  ios_icon_name="photo.fill" 
                  android_material_icon_name="photo" 
                  size={32} 
                  color={colors.primary} 
                />
                <Text style={styles.uploadButtonText}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>Step 2: Enter Basic Measurements</Text>
          <Text style={styles.sectionDescription}>
            Provide your height and weight for accurate analysis
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 175"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 70"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!selectedImage || !height || !weight || loading) && styles.analyzeButtonDisabled
          ]}
          onPress={handleAnalyze}
          disabled={!selectedImage || !height || !weight || loading}
        >
          {loading ? (
            <React.Fragment>
              <ActivityIndicator color={colors.card} size="small" />
              <Text style={styles.analyzeButtonText}>Analyzing...</Text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <IconSymbol 
                ios_icon_name="sparkles" 
                android_material_icon_name="auto-awesome" 
                size={24} 
                color={colors.card} 
              />
              <Text style={styles.analyzeButtonText}>Generate Avatar</Text>
            </React.Fragment>
          )}
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle.fill" 
              android_material_icon_name="warning" 
              size={20} 
              color={colors.error} 
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {data && (
          <View style={styles.resultsSection}>
            <AvatarPreview
              imageUri={selectedImage || undefined}
              measurements={data.measurements}
              confidence={data.confidence}
            />

            {data.suggestions && data.suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Tips for Better Results</Text>
                {data.suggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Text style={styles.suggestionBullet}>•</Text>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.infoBox}>
              <IconSymbol 
                ios_icon_name="info.circle.fill" 
                android_material_icon_name="info" 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.infoText}>
                To enable full AI body analysis with OpenAI Vision API, please enable Supabase 
                by pressing the Supabase button and connecting to a project.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  uploadSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  imagePreviewContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.card,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.card,
    borderRadius: 20,
  },
  measurementsSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  analyzeButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.card,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.error,
  },
  resultsSection: {
    marginTop: 16,
    gap: 20,
  },
  suggestionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  suggestionBullet: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "700",
  },
  suggestionText: {
    flex: 1,
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
