
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
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAvatarGeneration, BodyMeasurements } from '@/hooks/useAvatarGeneration';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Your AI Avatar</Text>
        <Text style={styles.subtitle}>Upload a face photo and enter your measurements</Text>
        
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            {faceImage ? (
              <Image source={{ uri: faceImage }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <IconSymbol 
                  ios_icon_name="person.crop.circle" 
                  android_material_icon_name="account-circle" 
                  size={80} 
                  color={colors.primary} 
                />
                <Text style={styles.imageButtonText}>Upload Face Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <IconSymbol 
                ios_icon_name="photo" 
                android_material_icon_name="photo" 
                size={24} 
                color={colors.text} 
              />
              <Text style={styles.photoButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <IconSymbol 
                ios_icon_name="camera" 
                android_material_icon_name="camera" 
                size={24} 
                color={colors.text} 
              />
              <Text style={styles.photoButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>Body Measurements</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="170"
                placeholderTextColor={colors.grey}
                value={measurements.height > 0 ? measurements.height.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, height: parseFloat(text) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="70"
                placeholderTextColor={colors.grey}
                value={measurements.weight > 0 ? measurements.weight.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, weight: parseFloat(text) || 0 })}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chest (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="95"
                placeholderTextColor={colors.grey}
                value={measurements.chest > 0 ? measurements.chest.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, chest: parseFloat(text) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Waist (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="80"
                placeholderTextColor={colors.grey}
                value={measurements.waist > 0 ? measurements.waist.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, waist: parseFloat(text) || 0 })}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hips (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor={colors.grey}
                value={measurements.hips > 0 ? measurements.hips.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, hips: parseFloat(text) || 0 })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Inseam (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="75"
                placeholderTextColor={colors.grey}
                value={measurements.inseam > 0 ? measurements.inseam.toString() : ''}
                onChangeText={(text) => setMeasurements({ ...measurements, inseam: parseFloat(text) || 0 })}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.loadingText}>Generating your AI avatar...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <IconSymbol 
                ios_icon_name="sparkles" 
                android_material_icon_name="auto-awesome" 
                size={24} 
                color="#fff" 
              />
              <Text style={styles.generateButtonText}>Generate Avatar</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 100,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
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
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonText: {
    color: colors.primary,
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
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  photoButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  measurementsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
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
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
