
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { AvatarPreview } from '@/components/AvatarPreview';
import { useBodyAnalysis } from '@/hooks/useBodyAnalysis';
import { IconSymbol } from '@/components/IconSymbol';
import { BodyScan } from '@/types/bodyMeasurements';

export default function HomeScreen() {
  const [bodyScan, setBodyScan] = useState<BodyScan>({
    height: 0,
    weight: 0,
    image: null,
  });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const { result, loading, error } = useBodyAnalysis(bodyScan);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setBodyScan(prev => ({ ...prev, image: result.assets[0].uri }));
        setHasAnalyzed(false);
      }
    } catch (err) {
      console.log('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setBodyScan(prev => ({ ...prev, image: result.assets[0].uri }));
        setHasAnalyzed(false);
      }
    } catch (err) {
      console.log('Error taking photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleAnalyze = () => {
    if (!bodyScan.image) {
      Alert.alert('Missing Image', 'Please upload or take a photo first');
      return;
    }
    if (!bodyScan.height || bodyScan.height <= 0) {
      Alert.alert('Missing Height', 'Please enter your height');
      return;
    }
    if (!bodyScan.weight || bodyScan.weight <= 0) {
      Alert.alert('Missing Weight', 'Please enter your weight');
      return;
    }
    setHasAnalyzed(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Avatar</Text>
        <Text style={styles.subtitle}>
          Upload a photo and provide your measurements to create an accurate 3D avatar
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Step 1: Upload Photo</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <IconSymbol 
              ios_icon_name="photo" 
              android_material_icon_name="photo" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.imageButtonText}>Choose Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <IconSymbol 
              ios_icon_name="camera" 
              android_material_icon_name="camera" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.imageButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {bodyScan.image && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: bodyScan.image }} style={styles.previewImage} />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Step 2: Enter Measurements</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="170"
            keyboardType="numeric"
            value={bodyScan.height > 0 ? bodyScan.height.toString() : ''}
            onChangeText={(text) => setBodyScan(prev => ({ ...prev, height: parseFloat(text) || 0 }))}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="70"
            keyboardType="numeric"
            value={bodyScan.weight > 0 ? bodyScan.weight.toString() : ''}
            onChangeText={(text) => setBodyScan(prev => ({ ...prev, weight: parseFloat(text) || 0 }))}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]} 
        onPress={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.milkyWay} />
        ) : (
          <Text style={styles.analyzeButtonText}>Analyze Body</Text>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {hasAnalyzed && result && (
        <View style={styles.resultsSection}>
          <AvatarPreview
            imageUri={bodyScan.image || undefined}
            measurements={result.measurements}
            confidence={result.confidence}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  imageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  previewContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.meteor,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    resizeMode: 'cover',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
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
    alignItems: 'center',
    marginVertical: 24,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.milkyWay,
  },
  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: colors.milkyWay,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsSection: {
    marginTop: 24,
  },
});
