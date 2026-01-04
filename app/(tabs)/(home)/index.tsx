
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');

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
        setUploadedImage(result.assets[0].uri);
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
        setUploadedImage(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error taking photo:', err);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleGenerateAvatar = async () => {
    if (!uploadedImage) {
      Alert.alert('Missing Photo', 'Please upload a photo first');
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

    try {
      await generateAvatar(uploadedImage, heightNum, weightNum);
      Alert.alert(
        'Success!', 
        'Your AI avatar has been created with background removed. Visit Wishlist or Wardrobe to try on clothes!',
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
          Upload a photo and provide measurements. AI will remove the background and create a clean avatar for virtual try-on.
        </Text>
      </View>

      {/* Show existing avatar if available */}
      {avatarUri && !uploadedImage && (
        <View style={styles.existingAvatarSection}>
          <Text style={styles.sectionTitle}>Your AI Avatar</Text>
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
              color={colors.primary}
            />
            <Text style={styles.updatePromptText}>
              Upload a new photo below to update your avatar
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {avatarUri ? 'Update Avatar' : 'Step 1: Upload Photo'}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <IconSymbol 
              ios_icon_name="photo" 
              android_material_icon_name="photo" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.imageButtonText}>Gallery</Text>
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

        {uploadedImage && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
            <View style={styles.mediaTypeLabel}>
              <IconSymbol 
                ios_icon_name="photo" 
                android_material_icon_name="photo" 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.mediaTypeLabelText}>Photo Uploaded</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {avatarUri ? 'Update Measurements' : 'Step 2: Enter Measurements'}
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="170"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="70"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]} 
        onPress={handleGenerateAvatar}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.generateButtonText}>Processing...</Text>
          </>
        ) : (
          <>
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={20}
              color="#fff"
            />
            <Text style={styles.generateButtonText}>
              {avatarUri ? 'Update AI Avatar' : 'Generate AI Avatar'}
            </Text>
          </>
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
          <Text style={styles.processingTitle}>AI Processing Steps:</Text>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="1.circle.fill" 
              android_material_icon_name="looks-one" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.processingStepText}>Removing background from photo</Text>
          </View>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="2.circle.fill" 
              android_material_icon_name="looks-two" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.processingStepText}>Generating AI human replica</Text>
          </View>
          <View style={styles.processingStep}>
            <IconSymbol 
              ios_icon_name="3.circle.fill" 
              android_material_icon_name="looks-3" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.processingStepText}>Creating clean avatar model</Text>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <IconSymbol 
          ios_icon_name="info.circle" 
          android_material_icon_name="info" 
          size={24} 
          color={colors.primary} 
        />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • AI removes the background from your photo{'\n'}
            • Creates a clean human replica avatar{'\n'}
            • Ready for virtual clothing try-on{'\n'}
            • Visit Wishlist or Wardrobe to try on clothes
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
    gap: 12,
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
    padding: 16,
    gap: 8,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  previewContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
    position: 'relative',
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
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  mediaTypeLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    marginVertical: 24,
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary,
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
    color: colors.text,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
