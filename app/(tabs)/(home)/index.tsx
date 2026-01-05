
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
import { useAvatarGeneration } from '@/hooks/useAvatarGeneration';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [chest, setChest] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hips, setHips] = useState<string>('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const { avatarUri, isGenerating, error, generateAvatar, loadAvatar } = useAvatarGeneration();

  // Load existing avatar on mount
  useEffect(() => {
    loadAvatar();
  }, []);

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
        setFacePhoto(result.assets[0].uri);
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
        setFacePhoto(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error taking photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleGenerateAvatar = async () => {
    if (!facePhoto) {
      Alert.alert('Missing Photo', 'Please upload a face photo first');
      return;
    }
    
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (!heightNum || heightNum <= 0) {
      Alert.alert('Invalid Height', 'Please enter a valid height in cm');
      return;
    }
    if (!weightNum || weightNum <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in kg');
      return;
    }

    const additionalMeasurements = {
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
    };

    try {
      await generateAvatar(facePhoto, heightNum, weightNum, additionalMeasurements);
      Alert.alert(
        'Success!', 
        'Your AI avatar has been created! The body was generated from your measurements and your face was applied. Visit Wishlist or Wardrobe to try on clothes!',
        [{ text: 'OK' }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to generate avatar. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your AI Avatar</Text>
        <Text style={styles.subtitle}>
          📸 Upload a face photo only - we&apos;ll build the body from your measurements!
        </Text>
      </View>

      {avatarUri && !facePhoto && (
        <View style={styles.existingAvatarSection}>
          <Text style={styles.sectionTitle}>✨ Your AI Avatar</Text>
          <AvatarPreview
            avatarUri={avatarUri}
            isGenerating={false}
            width={250}
            height={350}
            showBackgroundInfo={true}
          />
          <View style={styles.updatePrompt}>
            <IconSymbol
              ios_icon_name="info.circle"
              android_material_icon_name="info"
              size={20}
              color={colors.accent}
            />
            <Text style={styles.updatePromptText}>
              Upload a new face photo below to update your avatar
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {avatarUri ? '📸 Update Face Photo' : '📸 Step 1: Face Photo'}
        </Text>
        <View style={styles.infoBox}>
          <IconSymbol
            ios_icon_name="face.smiling"
            android_material_icon_name="face"
            size={24}
            color={colors.accent}
          />
          <Text style={styles.infoBoxText}>
            Only your face is needed! AI will generate the full body from measurements.
          </Text>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <IconSymbol 
              ios_icon_name="photo" 
              android_material_icon_name="photo" 
              size={24} 
              color={colors.accent} 
            />
            <Text style={styles.imageButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <IconSymbol 
              ios_icon_name="camera" 
              android_material_icon_name="camera" 
              size={24} 
              color={colors.accentPink} 
            />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {facePhoto && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: facePhoto }} style={styles.previewImage} />
            <View style={styles.mediaTypeLabel}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check-circle" 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.mediaTypeLabelText}>Face Photo Ready</Text>
            </View>
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={() => setFacePhoto(null)}
            >
              <IconSymbol 
                ios_icon_name="arrow.clockwise" 
                android_material_icon_name="refresh" 
                size={16} 
                color={colors.text} 
              />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {avatarUri ? '📏 Update Measurements' : '📏 Step 2: Body Measurements'}
        </Text>
        
        <View style={styles.requiredLabel}>
          <Text style={styles.requiredLabelText}>Required *</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Height (cm) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 175"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
            placeholderTextColor={colors.textMuted}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Weight (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 70"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <TouchableOpacity 
          style={styles.optionalToggle}
          onPress={() => setShowOptionalFields(!showOptionalFields)}
        >
          <Text style={styles.optionalToggleText}>
            {showOptionalFields ? '▼' : '▶'} Optional measurements (for better accuracy)
          </Text>
        </TouchableOpacity>

        {showOptionalFields && (
          <React.Fragment>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Chest (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 95"
                keyboardType="numeric"
                value={chest}
                onChangeText={setChest}
                placeholderTextColor={colors.textMuted}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Waist (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 80"
                keyboardType="numeric"
                value={waist}
                onChangeText={setWaist}
                placeholderTextColor={colors.textMuted}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Hips (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 95"
                keyboardType="numeric"
                value={hips}
                onChangeText={setHips}
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </React.Fragment>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]} 
        onPress={handleGenerateAvatar}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <React.Fragment>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.generateButtonText}>Processing...</Text>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.generateButtonText}>
              {avatarUri ? 'Update AI Avatar' : 'Generate AI Avatar'}
            </Text>
          </React.Fragment>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle" 
            android_material_icon_name="warning" 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isGenerating && (
        <View style={styles.processingInfo}>
          <Text style={styles.processingTitle}>🤖 AI Processing Steps:</Text>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="1.circle.fill" 
              android_material_icon_name="looks-one" 
              size={20} 
              color={colors.accent} 
            />
            <Text style={styles.processingStepText}>Extracting face from photo</Text>
          </View>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="2.circle.fill" 
              android_material_icon_name="looks-two" 
              size={20} 
              color={colors.accent} 
            />
            <Text style={styles.processingStepText}>Removing background from face</Text>
          </View>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="3.circle.fill" 
              android_material_icon_name="looks-3" 
              size={20} 
              color={colors.accent} 
            />
            <Text style={styles.processingStepText}>Generating 3D body from measurements</Text>
          </View>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="4.circle.fill" 
              android_material_icon_name="looks-4" 
              size={20} 
              color={colors.accent} 
            />
            <Text style={styles.processingStepText}>Applying face to 3D avatar</Text>
          </View>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="5.circle.fill" 
              android_material_icon_name="looks-5" 
              size={20} 
              color={colors.accent} 
            />
            <Text style={styles.processingStepText}>Rendering on aesthetic podium</Text>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <IconSymbol 
          ios_icon_name="lightbulb.fill" 
          android_material_icon_name="lightbulb" 
          size={24} 
          color={colors.accent} 
        />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Upload ONLY a face photo (no full body needed){'\n'}
            • AI extracts and isolates your face{'\n'}
            • Generates full 3D body from your measurements{'\n'}
            • Applies your face to the generated body{'\n'}
            • Renders on aesthetic podium background{'\n'}
            • Ready for virtual clothing try-on!
          </Text>
        </View>
      </View>
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
    paddingBottom: 120,
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
    alignItems: 'center',
  },
  updatePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  previewContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.backgroundCard,
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    resizeMode: 'cover',
  },
  mediaTypeLabel: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  mediaTypeLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  retakeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  requiredLabel: {
    backgroundColor: colors.accentPink,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  requiredLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
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
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.glass,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  optionalToggle: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.glass,
  },
  optionalToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 18,
    marginVertical: 24,
    gap: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  processingInfo: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  processingStepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.glass,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
