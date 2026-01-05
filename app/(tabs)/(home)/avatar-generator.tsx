
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
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAvatarGeneration, BodyMeasurements } from '@/hooks/useAvatarGeneration';
import { colors, commonStyles, shadows, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { ErvenistaBranding } from '@/components/ErvenistaBranding';
import { LinearGradient } from 'expo-linear-gradient';

export default function AvatarGeneratorScreen() {
  const router = useRouter();
  const { generateAvatar, loading } = useAvatarGeneration();
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    height: 0,
    weight: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    inseam: 0,
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a photo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFaceImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take a photo');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFaceImage(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!faceImage) {
      Alert.alert('Error', 'Please upload a face photo');
      return;
    }

    if (measurements.height === 0 || measurements.weight === 0) {
      Alert.alert('Error', 'Please enter at least height and weight');
      return;
    }

    try {
      console.log('Generating avatar with face image and measurements...');
      await generateAvatar(faceImage, measurements);
      Alert.alert('Success', 'Avatar generated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error('Avatar generation failed:', err);
      Alert.alert('Error', 'Failed to generate avatar. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ErvenistaBranding size="small" variant="minimal" />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Your AI Avatar</Text>
        <Text style={styles.subtitle}>Upload a face photo and enter your measurements</Text>
        
        <View style={styles.imageSection}>
          <TouchableOpacity style={[styles.imageButton, shadows.medium]} onPress={pickImage}>
            {faceImage ? (
              <Image source={{ uri: faceImage }} style={styles.image} />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
                <IconSymbol 
                  android_material_icon_name="account_circle" 
                  size={80} 
                  color="#FFFFFF" 
                />
                <Text style={styles.imageButtonText}>Upload Face Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.photoButtons}>
            <TouchableOpacity style={[styles.photoButton, shadows.small]} onPress={pickImage}>
              <IconSymbol 
                android_material_icon_name="photo" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.photoButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.photoButton, shadows.small]} onPress={takePhoto}>
              <IconSymbol 
                android_material_icon_name="camera" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={styles.photoButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.measurementsSection, shadows.medium]}>
          <Text style={commonStyles.heading}>Body Measurements</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="numeric"
                placeholder="170"
                placeholderTextColor={colors.textSecondary}
                value={measurements.height > 0 ? measurements.height.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, height: parseFloat(text) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="numeric"
                placeholder="70"
                placeholderTextColor={colors.textSecondary}
                value={measurements.weight > 0 ? measurements.weight.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, weight: parseFloat(text) || 0 })}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chest (inches)</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="numeric"
                placeholder="37"
                placeholderTextColor={colors.textSecondary}
                value={measurements.chest > 0 ? measurements.chest.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, chest: parseFloat(text) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Waist (inches)</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="numeric"
                placeholder="31"
                placeholderTextColor={colors.textSecondary}
                value={measurements.waist > 0 ? measurements.waist.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, waist: parseFloat(text) || 0 })}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hips (inches)</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="numeric"
                placeholder="39"
                placeholderTextColor={colors.textSecondary}
                value={measurements.hips > 0 ? measurements.hips.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, hips: parseFloat(text) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Inseam (inches)</Text>
              <TextInput
                style={commonStyles.input}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={colors.textSecondary}
                value={measurements.inseam > 0 ? measurements.inseam.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, inseam: parseFloat(text) || 0 })}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, loading && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.loadingText}>Generating your AI avatar...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <IconSymbol 
                android_material_icon_name="auto_awesome" 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={buttonStyles.primaryText}>Generate Avatar</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 100 }} />
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
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  measurementsSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
