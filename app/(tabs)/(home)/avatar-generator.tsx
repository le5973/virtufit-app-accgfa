
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { AvatarPreview } from '@/components/AvatarPreview';
import { useAvatarGeneration } from '@/hooks/useAvatarGeneration';

export default function AvatarGeneratorScreen() {
  const router = useRouter();
  const { avatarUri, isGenerating, generateAvatar, loadAvatar } = useAvatarGeneration();
  
  const [faceImageUri, setFaceImageUri] = useState<string | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');

  useEffect(() => {
    loadAvatar();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setFaceImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setFaceImageUri(result.assets[0].uri);
    }
  };

  const handleGenerateAvatar = async () => {
    if (!faceImageUri) {
      Alert.alert('Missing Photo', 'Please upload a face photo first');
      return;
    }

    if (!height || !weight) {
      Alert.alert('Missing Measurements', 'Please enter at least height and weight');
      return;
    }

    const measurements = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
    };

    const result = await generateAvatar(faceImageUri, measurements);
    
    if (result) {
      Alert.alert('Success!', 'Your AI avatar has been generated', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Error', 'Failed to generate avatar. Please try again.');
    }
  };

  return (
    <SafeAreaView style={commonStyles.wrapper} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={commonStyles.title}>Create Your AI Avatar</Text>
            <Text style={commonStyles.text}>
              Upload a face photo and enter your measurements
            </Text>
          </View>

          {/* Face Photo Section */}
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>📸 Face Photo</Text>
            <Text style={styles.sectionSubtitle}>
              Only your face is needed - we'll build the body!
            </Text>
            
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <IconSymbol name="photo.fill" size={32} color={colors.accent} />
                <Text style={styles.imageButtonText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <IconSymbol name="camera.fill" size={32} color={colors.accentPink} />
                <Text style={styles.imageButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>

            {faceImageUri && (
              <View style={styles.previewContainer}>
                <AvatarPreview
                  avatarUri={faceImageUri}
                  size="small"
                  showPodium={false}
                  onRetake={() => setFaceImageUri(null)}
                />
              </View>
            )}
          </View>

          {/* Measurements Section */}
          <View style={[commonStyles.card, styles.section]}>
            <Text style={styles.sectionTitle}>📏 Body Measurements</Text>
            <Text style={styles.sectionSubtitle}>Required fields *</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (cm) *</Text>
              <TextInput
                style={commonStyles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="e.g., 175"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg) *</Text>
              <TextInput
                style={commonStyles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="e.g., 70"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <Text style={[styles.sectionSubtitle, { marginTop: 16 }]}>
              Optional (for better accuracy)
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Chest (cm)</Text>
              <TextInput
                style={commonStyles.input}
                value={chest}
                onChangeText={setChest}
                placeholder="e.g., 95"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Waist (cm)</Text>
              <TextInput
                style={commonStyles.input}
                value={waist}
                onChangeText={setWaist}
                placeholder="e.g., 80"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hips (cm)</Text>
              <TextInput
                style={commonStyles.input}
                value={hips}
                onChangeText={setHips}
                placeholder="e.g., 95"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.generateButton]}
            onPress={handleGenerateAvatar}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <IconSymbol name="sparkles" size={24} color={colors.primary} />
                <Text style={styles.generateButtonText}>Generate AI Avatar</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Preview Generated Avatar */}
          {avatarUri && !isGenerating && (
            <View style={[commonStyles.card, styles.section]}>
              <Text style={styles.sectionTitle}>✨ Your AI Avatar</Text>
              <AvatarPreview avatarUri={avatarUri} size="medium" />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.glass,
  },
  imageButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  generateButton: {
    marginVertical: 24,
    flexDirection: 'row',
    gap: 12,
  },
  generateButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
