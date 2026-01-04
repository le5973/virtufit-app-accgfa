
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { AvatarPreview } from '@/components/AvatarPreview';
import { useBodyAnalysis } from '@/hooks/useBodyAnalysis';
import { useAvatarGeneration } from '@/hooks/useAvatarGeneration';
import { IconSymbol } from '@/components/IconSymbol';
import { BodyScan } from '@/types/bodyMeasurements';

export default function HomeScreen() {
  const [bodyScan, setBodyScan] = useState<BodyScan>({
    height: 0,
    weight: 0,
    image: null,
    video: null,
  });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const { result, loading, error } = useBodyAnalysis(bodyScan);
  const { avatarData, loadAvatar } = useAvatarGeneration();

  // Load existing avatar on mount
  useEffect(() => {
    loadAvatar();
  }, [loadAvatar]);

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
        setBodyScan(prev => ({ ...prev, image: result.assets[0].uri, video: null }));
        setHasAnalyzed(false);
      }
    } catch (err) {
      console.log('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickVideo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setBodyScan(prev => ({ ...prev, video: result.assets[0].uri, image: null }));
        setHasAnalyzed(false);
      }
    } catch (err) {
      console.log('Error picking video:', err);
      Alert.alert('Error', 'Failed to pick video');
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
        setBodyScan(prev => ({ ...prev, image: result.assets[0].uri, video: null }));
        setHasAnalyzed(false);
      }
    } catch (err) {
      console.log('Error taking photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleAnalyze = () => {
    if (!bodyScan.image && !bodyScan.video) {
      Alert.alert('Missing Media', 'Please upload a photo or video first');
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

  // Show existing avatar if available and no new analysis
  const showExistingAvatar = avatarData && !hasAnalyzed && !bodyScan.image && !bodyScan.video;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your AI Avatar</Text>
        <Text style={styles.subtitle}>
          Upload a photo or video and provide your measurements to create an accurate 3D avatar for virtual try-on
        </Text>
      </View>

      {showExistingAvatar && (
        <View style={styles.existingAvatarSection}>
          <AvatarPreview
            avatarUrl={avatarData.avatarUrl}
            measurements={avatarData.measurements}
            confidence={avatarData.confidence}
          />
          <View style={styles.updatePrompt}>
            <IconSymbol
              ios_icon_name="info"
              android_material_icon_name="info"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.updatePromptText}>
              Upload new photos below to update your avatar
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Step 1: Upload Photo or Video</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <IconSymbol 
              ios_icon_name="photo" 
              android_material_icon_name="photo" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.imageButtonText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={pickVideo}>
            <IconSymbol 
              ios_icon_name="videocam" 
              android_material_icon_name="videocam" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.imageButtonText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <IconSymbol 
              ios_icon_name="camera" 
              android_material_icon_name="camera" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {bodyScan.image && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: bodyScan.image }} style={styles.previewImage} />
            <View style={styles.mediaTypeLabel}>
              <IconSymbol 
                ios_icon_name="photo" 
                android_material_icon_name="photo" 
                size={16} 
                color={colors.milkyWay} 
              />
              <Text style={styles.mediaTypeLabelText}>Photo</Text>
            </View>
          </View>
        )}

        {bodyScan.video && (
          <View style={styles.previewContainer}>
            <View style={styles.videoPlaceholder}>
              <IconSymbol 
                ios_icon_name="videocam" 
                android_material_icon_name="videocam" 
                size={48} 
                color={colors.primary} 
              />
              <Text style={styles.videoPlaceholderText}>Video uploaded</Text>
              <Text style={styles.videoPlaceholderSubtext}>
                Higher accuracy for body measurements
              </Text>
            </View>
            <View style={styles.mediaTypeLabel}>
              <IconSymbol 
                ios_icon_name="videocam" 
                android_material_icon_name="videocam" 
                size={16} 
                color={colors.milkyWay} 
              />
              <Text style={styles.mediaTypeLabelText}>Video</Text>
            </View>
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
          <>
            <IconSymbol
              ios_icon_name="auto-awesome"
              android_material_icon_name="auto-awesome"
              size={20}
              color={colors.milkyWay}
            />
            <Text style={styles.analyzeButtonText}>Generate AI Avatar</Text>
          </>
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
            avatarUrl={result.avatarUrl}
            measurements={result.measurements}
            confidence={result.confidence}
            loading={loading}
          />
          {result.avatarUrl && (
            <View style={styles.successMessage}>
              <IconSymbol
                ios_icon_name="check-circle"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.galaxy}
              />
              <Text style={styles.successMessageText}>
                Avatar created! Visit Wishlist or Wardrobe to try on clothes
              </Text>
            </View>
          )}
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
  existingAvatarSection: {
    marginBottom: 32,
  },
  updatePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  updatePromptText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
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
    gap: 8,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  imageButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  previewContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.meteor,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    resizeMode: 'cover',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  videoPlaceholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  mediaTypeLabel: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  mediaTypeLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.milkyWay,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    marginVertical: 24,
    gap: 8,
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
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.galaxy,
  },
  successMessageText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
});
